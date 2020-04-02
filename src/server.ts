import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import twilio, { jwt, Twilio } from 'twilio';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import textToSpeech from '@google-cloud/text-to-speech';
import { Server } from 'http';
import { ApolloServer, PubSub } from 'apollo-server-express';
import graphRoot from './server/graphRoot';
import { RequestContext } from './server/context';
import { PartyRoom, Admin } from './server/db';
import ngrok from 'ngrok';
import LocalDB from './server/db/local';
import morgan from 'morgan';

const AccessToken = jwt.AccessToken;
const app = express();
const VideoGrant = AccessToken.VideoGrant;
const SyncGrant = AccessToken.SyncGrant;
dotenv.config();

const ENV = process.env.ENVIRONMENT;
const MAX_ALLOWED_SESSION_DURATION =
  parseInt(process.env.MAX_SESSION_DURATION || '0') || (ENV === 'production' ? 18000 : 600);
const ITEM_TTL = 120;
const PASSCODE = process.env.PASSCODE;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;
const ROOM_TYPE = ENV === 'production' ? 'group' : 'group-small';
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioServiceSID = process.env.TWILIO_SERVICE_SID;
if (!twilioAccountSid || !twilioAuthToken) throw new Error('need Twilio account sid/auth token');
if (!twilioApiKeySID || !twilioApiKeySecret) throw new Error('need Twilio API key/secret');
//@ts-ignore
const client: Twilio = new twilio(twilioAccountSid, twilioAuthToken);
if (!twilioServiceSID) throw new Error('need TWILIO_SERVICE_SID');
const service = client.sync.services.get(twilioServiceSID);
var url = process.env.BASE_URL;
var server: Server | undefined = undefined;
var database = new LocalDB();
const pubsub = new PubSub();

service.syncMaps
  .create({ uniqueName: 'users' })
  .then(() => {
    console.log(`Created user list`);
  })
  .catch(e => {
    if (e.code !== 54301) console.error(e);
  });
service.syncMaps
  .create({ uniqueName: 'rooms' })
  .then(() => {
    console.log(`Created user list`);
  })
  .catch(e => {
    if (e.code !== 54301) console.error(e);
  });
service.syncMaps
  .create({ uniqueName: 'admins' })
  .then(() => {
    console.log(`Created admin list`);
  })
  .catch(e => {
    if (e.code !== 54301) console.error(e);
  });
service.syncLists
  .create({ uniqueName: 'broadcasts' })
  .then(() => {
    console.log(`Created broadcast list`);
  })
  .catch(e => {
    if (e.code !== 54301) console.error(e);
  });
service.syncStreams
  .create({ uniqueName: 'reactions' })
  .then(() => {
    console.log(`Created reactions stream`);
  })
  .catch(e => {
    if (e.code !== 54301) console.error(e);
  });

const updateRoomHooks = (hookUrl: string) => {
  client.video.rooms
    .list({ status: 'in-progress', limit: 50 })
    .then(rooms => {
      rooms.forEach(room => {
        client.video
          .rooms(room.sid)
          .update({
            status: 'completed',
          })
          .then(r => {
            console.log(`Deleted old video room ${r.uniqueName}`);
          })
          .catch(e => console.log(e));
      });

      service
        .syncMaps('rooms')
        .syncMapItems.list({ limit: 50 })
        .then(items => {
          items.forEach(item => {
            const room = item.data as PartyRoom;
            client.video.rooms
              .create({
                type: ROOM_TYPE,
                uniqueName: room.id,
                statusCallback: `${hookUrl}/api/hooks/room_status`,
              })
              .then(() => {
                console.log(`Created video room ${room.name}`);
              })
              .catch(e => {
                console.log(e);
              });
          });
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};

if (ENV !== 'production') {
  ngrok
    .connect(PORT)
    .then((u: string) => {
      url = u;
      console.log(`Ngrok started at ${u}`);

      service
        .update({
          webhookUrl: `${u}/api/service_status`,
          reachabilityWebhooksEnabled: true,
          reachabilityDebouncingEnabled: true,
        })
        .then(() => {
          console.log('Updated service webhooks');
        })
        .catch(e => console.log(e));

      updateRoomHooks(u);
    })
    .catch((e: any) => {
      console.log('Failed to start ngrok');
      console.log(e);
    });
} else {
  service
    .update({
      webhookUrl: `${url}/api/service_status`,
      reachabilityWebhooksEnabled: true,
      reachabilityDebouncingEnabled: true,
    })
    .then(() => {
      console.log('Updated service webhooks');
    })
    .catch(e => console.log(e));
}

const setAdmin = (identity: string, shouldBeAdmin: boolean) => {
  const token = (new Date().getTime() * Math.random()).toString();
  return new Promise((resolve, reject) => {
    if (shouldBeAdmin) {
      service
        .syncMaps('admins')
        .syncMapItems(identity)
        .fetch()
        .then(item => {
          const admin = item.data as Admin;
          resolve(admin.token);
        })
        .catch(() => {
          service
            .syncMaps('admins')
            .syncMapItems.create({ key: identity, data: { token } })
            .then(() => {
              console.log(`Added admin for ${identity}`);
              service
                .syncMaps('users')
                .syncMapItems(identity)
                .fetch()
                .then(item => {
                  const data = {
                    ...item.data,
                    admin: true,
                  };

                  item
                    .update({ data: data, itemTtl: ITEM_TTL })
                    .then(() => {
                      console.log(`Added admin flag for ${identity}`);
                      resolve(token);
                    })
                    .catch(e => {
                      console.log(e);
                      reject(e);
                    });
                })
                .catch(e => {
                  console.log(e);
                  reject(e);
                });
            })
            .catch(reject);
        });
    } else {
      service
        .syncMaps('admins')
        .syncMapItems(identity)
        .remove()
        .then(() => {
          console.log(`Removed admin for ${identity}`);
          service
            .syncMaps('users')
            .syncMapItems(identity)
            .fetch()
            .then(item => {
              const data = {
                ...item.data,
                admin: false,
              };

              item
                .update({ data: data, itemTtl: ITEM_TTL })
                .then(() => {
                  console.log(`Removed admin flag for ${identity}`);
                  resolve();
                })
                .catch(e => {
                  console.log(e);
                  reject(e);
                });
            })
            .catch(e => {
              console.log(e);
              reject(e);
            });
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    }
  });
};

const getAdminToken = (identity: string) => {
  return new Promise((resolve, reject) => {
    service
      .syncMaps('admins')
      .syncMapItems(identity)
      .fetch()
      .then(item => {
        const admin = item.data as Admin;
        resolve(admin.token);
      })
      .catch(e => {
        reject(e);
      });
  });
};

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// disable cache for API
app.disable('etag');
if (ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/api/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
    identity,
  });
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.post('/api/token', (req, res) => {
  const { identity, roomName, passcode } = req.body;

  if (passcode === PASSCODE) {
    const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
      ttl: MAX_ALLOWED_SESSION_DURATION,
      identity,
    });
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);
    res.send({ token: token.toJwt() });
    console.log(`issued token for ${identity} in room ${roomName}`);
  } else {
    res.statusCode = 401;
    res.send({ error: { message: 'Incorrect Passcode' } });
  }
});

app.get('/api/sync_token', (req, res) => {
  const { identity, passcode } = req.query;

  if (passcode === PASSCODE) {
    const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
      ttl: MAX_ALLOWED_SESSION_DURATION,
      identity,
    });
    const syncGrant = new SyncGrant({ serviceSid: twilioServiceSID });
    token.addGrant(syncGrant);

    service
      .syncMaps('users')
      .syncMapPermissions(identity)
      .update({ read: true, write: false, manage: false })
      .then(() => {
        console.log(`Gave ${identity} permission for 'users'`);

        service
          .syncMaps('rooms')
          .syncMapPermissions(identity)
          .update({ read: true, write: false, manage: false })
          .then(() => {
            console.log(`Gave ${identity} permission for 'rooms'`);
            res.send(token.toJwt());
          });
      });

    console.log(`issued sync token for ${identity}`);
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/set_admin', (req, res) => {
  const { identity, adminToken, newAdminIdentity, adminPasscode, admin } = req.body;

  if (adminPasscode === ADMIN_PASSCODE) {
    setAdmin(newAdminIdentity, admin)
      .then(token => {
        if (identity === newAdminIdentity) {
          res.send({ success: true, token });
        } else {
          res.send({ success: true });
        }
      })
      .catch(e => {
        console.log(e);
        res.send({ error: { message: e } });
      });
  } else {
    getAdminToken(identity)
      .then(token => {
        if (token === adminToken) {
          setAdmin(newAdminIdentity, admin)
            .then(newToken => {
              if (identity === newAdminIdentity) {
                res.send({ success: true, newToken });
              } else {
                res.send({ success: true });
              }
            })
            .catch(e => {
              console.log(e);
              res.send({ error: { message: e } });
            });
        } else {
          res.send({ error: { message: 'wrong token' } });
        }
      })
      .catch(e => {
        res.send({ error: { message: 'not an admin' } });
      });
  }
});

app.get('/api/heartbeat', (req, res) => {
  service
    .syncMaps('users')
    .syncMapItems(req.query.identity)
    .update({ itemTtl: ITEM_TTL })
    .then(() => {
      console.log(`Updated TTL for ${req.query.identity}`);
    })
    .catch(e => console.log(e));

  res.send('');
});

app.post('/api/hooks/room_status', async (req, res) => {
  console.log(`Received ${req.body.StatusCallbackEvent}`);

  const identity = req.body.ParticipantIdentity;
  const room = req.body.RoomName;

  switch (req.body.StatusCallbackEvent) {
    case 'room-created':
      break;
    case 'room-ended':
      if (ENV !== 'production') {
        client.video.rooms
          .create({
            type: ROOM_TYPE,
            uniqueName: room,
            statusCallback: `${url}/api/hooks/room_status`,
          })
          .then(() => {
            console.log(`Re-created room ${room}`);
          })
          .catch(e => {
            console.log(e);
          });
      }

      break;
    case 'participant-connected':
      if (!identity) {
        res.sendStatus(200);
        return;
      }

      const user = await database.getUser(identity);

      if (!user) console.log(`unregistered user ${identity} connected to room ${room}`);

      const newUser = await database.editUser(identity, { ...user, room });
      await pubsub.publish('UPDATE_USER', { identity: newUser.identity, user: newUser });

      break;
    case 'participant-disconnected':
      if (!identity) {
        res.sendStatus(200);
        return;
      }

      const disconnectedUser = await database.getUser(identity);

      if (!disconnectedUser) console.log(`unregistered user ${identity} disconnected from room ${room}`);

      const newDisconnectedUser = await database.editUser(identity, { ...disconnectedUser, room: undefined });
      await pubsub.publish('UPDATE_USER', { identity: newDisconnectedUser.identity, user: newDisconnectedUser });

      break;
    default:
      break;
  }

  res.send('');
});

app.post('/api/service_status', (req, res) => {
  const identity = req.body.Identity;

  if (identity) {
    switch (req.body.EventType) {
      case 'endpoint_disconnected':
        service
          .syncMaps('users')
          .syncMapItems(identity)
          .remove()
          .then(() => {
            console.log(`Removed disconnected user ${identity} from users list`);
          })
          .catch(e => {
            console.log(e);
            res.sendStatus(500);
          });
        break;
      default:
        res.sendStatus(200);
    }
  } else {
    res.sendStatus(200);
  }
});

app.post('/api/get_tts', (req, res) => {
  const { text } = req.body;

  console.log('get_tts', text);
  const ttsClient = new textToSpeech.TextToSpeechClient();

  ttsClient
    .synthesizeSpeech({
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    })
    .then(response => {
      const audioContent = response[0].audioContent;
      if (audioContent) res.send({ audio: audioContent.toString() });
      else res.sendStatus(500);
    })
    .catch(e => {
      console.log('Could not get TTS:', e);
      res.sendStatus(500);
    });
});

app.get('/', (_req, res) => res.send(''));

graphRoot(pubsub)
  .then(({ typeDefs, resolvers }) => {
    const loggingPlugin = {
      didEncounterErrors(request: any) {
        console.log(request);
      },
    };
    const graph = new ApolloServer({
      resolvers,
      typeDefs,
      context: ({ req, connection }): RequestContext => {
        if (connection) {
          return connection.context;
        } else {
          const { passcode, identity } = req.headers;
          if (passcode === PASSCODE) {
            return {
              identity: identity as string | undefined,
              db: database,
            };
          } else {
            return {
              db: database,
            };
          }
        }
      },
      subscriptions: {
        path: '/api/graphql',
      },
      plugins: [loggingPlugin as any],
    });
    graph.applyMiddleware({
      app,
      path: '/api/graphql',
    });

    app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

    server = createServer(app);
    graph.installSubscriptionHandlers(server);

    server.listen(PORT, () => {
      console.log(`server running on ${PORT}`);
      console.log(`graphql endpoint: http://localhost:${PORT}${graph.graphqlPath}`);
      console.log(`subscriptions endpoint: ws://localhost:${PORT}${graph.subscriptionsPath}`);
    });
  })
  .catch(e => {
    console.log(e);
  });

//@ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
  // @ts-ignore
  module.hot.dispose(() => {
    server?.close();
    ngrok.disconnect(url);
  });
}

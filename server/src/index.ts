import 'reflect-metadata';
import express, { Application } from 'express';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import { Server } from 'http';
import { ApolloServer, PubSubEngine } from 'apollo-server-express';
import { PartyDB } from './db';
import graphRoot from './graphRoot';
import { RequestContext } from './context';
import { SESSION_SECRET, ENV, ITEM_TTL, PASSCODE } from './config';

export interface PartyServerOptions {
  pubsub: PubSubEngine;
  database: PartyDB;
  cullUsers?: boolean;
}

export interface PartyServer {
  app: Application;
  attachWebsocketListener: (server: Server) => void;
  cullTimer?: NodeJS.Timeout;
}

export default function createPartyServer(options: PartyServerOptions): Promise<PartyServer> {
  return new Promise((resolveServer, rejectServer) => {
    const app = express();
    app.use(express.json());
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());
    app.use(
      session({
        secret: SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: ENV === 'production' },
      })
    );

    const database = options.database;
    const pubsub = options.pubsub;

    const cullDeadUsers = async () => {
      const users = await options.database.getUsers();
      const now = new Date().getTime();

      for (const user of users) {
        const timeSinceHeartbeat = now - user.lastHeartbeat.getTime();
        if (timeSinceHeartbeat > ITEM_TTL) {
          await database.removeUser(user.identity);
          pubsub.publish('DELETED_USER', { identity: user.identity, user });
          console.log(`culled dead user ${user.displayName}(${user.identity})`);
        }
      }
    };

    app.post('/api/hooks/room_status', async (req, res) => {
      console.log(`Received ${req.body.StatusCallbackEvent}`);

      const identity = req.body.ParticipantIdentity;
      const room = req.body.RoomName;

      switch (req.body.StatusCallbackEvent) {
        case 'room-created':
          break;
        case 'room-ended':
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
          context: async ({ req, connection }): Promise<RequestContext> => {
            var user = undefined;

            if (connection) {
              if (connection.context.identity) {
                user = await database.getUser(connection.context.identity);
              }

              return {
                passcode: PASSCODE!,
                db: database,
                user,
              };
            } else {
              if (req.session?.identity) {
                try {
                  user = await database.getUser(req.session.identity);

                  return {
                    passcode: PASSCODE!,
                    db: database,
                    session: req.session,
                    user,
                  };
                } catch (_e) {}
              }

              return {
                passcode: PASSCODE!,
                db: database,
                session: req.session,
              };
            }
          },
          subscriptions: {
            path: '/api/graphql',
            onConnect: async (connectionParams: any) => {
              if (connectionParams.identity) {
                try {
                  const user = await database.getUser(connectionParams.identity);

                  if (connectionParams.websocketToken === user.websocketToken) {
                    return {
                      identity: user.identity,
                    };
                  } else {
                    throw new Error('invalid user');
                  }
                } catch (_e) {
                  return Promise.reject('invalid user token');
                }
              } else {
                return Promise.resolve({});
              }
            },
          },
          plugins: [loggingPlugin as any],
        });
        graph.applyMiddleware({
          app,
          path: '/api/graphql',
        });

        app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

        const attachWebsocketListener = (server: Server) => {
          graph.installSubscriptionHandlers(server);
        };

        resolveServer({
          app,
          attachWebsocketListener,
          cullTimer: options.cullUsers ? setInterval(cullDeadUsers, 1000) : undefined,
        });
      })
      .catch(e => {
        console.log(e);
      });
  });
}

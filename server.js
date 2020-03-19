const express = require('express');
const app = express();
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const SyncGrant = AccessToken.SyncGrant;
const twilio = require('twilio');
require('dotenv').config();
const bodyParser = require('body-parser');

const MAX_ALLOWED_SESSION_DURATION = 14400;
const ITEM_TTL = 120;
const PASSCODE = process.env.PASSCODE;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioServiceSID = process.env.TWILIO_SERVICE_SID;
const client = new twilio(twilioAccountSid, twilioAuthToken);
const service = client.sync.services.get(twilioServiceSID);

service.syncMaps.create({ uniqueName: 'users' }).then(list => {
  console.log(`Created user list`);
}).catch(e => console.error(e));
service.syncMaps.create({ uniqueName: 'rooms' }).then(list => {
  console.log(`Created user list`);
}).catch(e => console.error(e));

const setUserRoom = (identity, room, displayName, photoURL) => {
  const user = {
    identity,
    room,
  };

  service.syncMaps('users').syncMapItems(identity).fetch().then(item => {
    item.update({ data: {...item.data, ...user}, itemTtl: ITEM_TTL })
      .then(() => {
        console.log(`Updated user ${user.identity}`);
      });
  }).catch(e => {
    console.log(e);
    service.syncMaps('users').syncMapItems.create({key: identity, data: user, itemTtl: ITEM_TTL })
      .then(item => {
        console.log(`Created user ${user.identity}`);
      });
  });
};

const addUser = (identity, displayName, photoURL) => {
  const user = {
    identity,
    displayName,
    photoURL,
  };

  service.syncMaps('users').syncMapItems(identity).fetch().then(item => {
    item.update({ data: {...item.data, ...user}, itemTtl: ITEM_TTL })
      .then(() => {
        console.log(`Updated user ${user.identity}`);
      });
  }).catch(e => {
    console.log(e);
    service.syncMaps('users').syncMapItems.create({key: identity, data: user, itemTtl: ITEM_TTL })
      .then(item => {
        console.log(`Created user ${user.identity}`);
      });
  });
};

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/api/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
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
    });
    token.identity = identity;
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
  const { identity } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const syncGrant = new SyncGrant({ serviceSid: twilioServiceSID });
  token.addGrant(syncGrant);

  service.syncMaps('users').syncMapPermissions(identity).update({ read: true, write: false, manage: false }).then(() => {
    console.log(`Gave ${identity} permission for 'users'`);

    service.syncMaps('rooms').syncMapPermissions(identity).update({ read: true, write: false, manage: false }).then(() => {
      console.log(`Gave ${identity} permission for 'rooms'`);
      res.send(token.toJwt());
    });
  });
  
  console.log(`issued sync token for ${identity}`);
});

app.post('/api/register', (req, res) => {
  const { uid, displayName, photoURL, passcode } = req.body;

  if (passcode === PASSCODE) {
    addUser(uid, displayName, photoURL);
    res.send('{}');
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/heartbeat', (req, res) => {
  service.syncMaps('users').syncMapItems(req.query.identity).update({ itemTtl: ITEM_TTL }).then(() => {
    console.log(`Updated TTL for ${req.query.identity}`);
  }).catch(e => console.log(e));

  res.send('');
});

app.post('/api/hooks/room_status', (req, res) => {
  console.log(`Received ${req.body.StatusCallbackEvent}`);

  const identity = req.body.ParticipantIdentity;
  const room = req.body.RoomName;

  switch(req.body.StatusCallbackEvent) {
    case 'room-created':

      break;
    case 'room-ended':
      // service.syncMaps.get(`room-${room}`).remove().then(() => console.log(`Deleted ${room} room list`)).catch(e => console.error(e));

      break;
    case 'participant-connected':
      setUserRoom(identity, room);

      break;
    case 'participant-disconnected':
      setUserRoom(identity, null);

      break;
    default:
      break
  }

  res.send('');
});

app.get('/', (req, res) => res.send(''));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(process.env.PORT || 8081, () => console.log('token server running on 8081'));

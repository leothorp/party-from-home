import 'reflect-metadata';
import express from 'express';
import { createServer, Server } from 'http';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { PORT } from './config';
import LocalDB from './db/local';
import { PubSub } from 'apollo-server-express';
import createPartyServer from './index';

const app = express();
dotenv.config({ path: '../.env' });
var server: Server | undefined = undefined;
var database = new LocalDB();
const pubsub = new PubSub();
//@ts-ignore
pubsub.ee.setMaxListeners(100);
var cullTimer: NodeJS.Timeout | undefined;

const ENV = process.env.ENVIRONMENT;

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
app.set('trust proxy', 1);
// disable cache for API
app.disable('etag');
if (ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => res.send(''));

createPartyServer({
  pubsub,
  database,
  cullUsers: true,
}).then(partyServer => {
  app.use(partyServer.app);

  server = createServer(app);
  partyServer.attachWebsocketListener(server);

  cullTimer = partyServer.cullTimer;

  server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    // console.log(`graphql endpoint: http://localhost:${PORT}${graph.graphqlPath}`);
    // console.log(`subscriptions endpoint: ws://localhost:${PORT}${graph.subscriptionsPath}`);
  });
});

//@ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
  // @ts-ignore
  module.hot.dispose(() => {
    if (cullTimer) clearInterval(cullTimer);
    server?.close();
  });
}

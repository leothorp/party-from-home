import { Express } from 'express';
import { PartyDB, PartyUser } from './db';

export interface RequestContext {
  passcode: string;
  db: PartyDB;
  session?: Express.Session;
  user?: PartyUser;
}

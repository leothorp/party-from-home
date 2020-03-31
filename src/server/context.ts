import { PartyDB } from './db';

export interface RequestContext {
  identity?: string;
  db: PartyDB;
}

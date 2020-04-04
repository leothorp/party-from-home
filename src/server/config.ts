import dotenv from 'dotenv';
dotenv.config();

export const ENV = process.env.ENVIRONMENT;
export const MAX_ALLOWED_SESSION_DURATION =
  parseInt(process.env.MAX_SESSION_DURATION || '0') || (ENV === 'production' ? 18000 : 600);
export const ITEM_TTL = 120;
export const PASSCODE = process.env.PASSCODE;
export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;
export const PORT = process.env.PORT || 8081;
export const ROOM_TYPE = ENV === 'production' ? 'group' : 'group-small';
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
export const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
export const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
export const twilioServiceSID = process.env.TWILIO_SERVICE_SID;
if (!twilioAccountSid || !twilioAuthToken) throw new Error('need Twilio account sid/auth token');
if (!twilioApiKeySID || !twilioApiKeySecret) throw new Error('need Twilio API key/secret');
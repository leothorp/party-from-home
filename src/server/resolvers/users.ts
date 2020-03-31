import { PartyUser } from '../db';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { RequestContext } from '../context';
import { jwt } from 'twilio';

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION =
  parseInt(process.env.MAX_SESSION_DURATION || '0') || (process.env.ENVIRONMENT === 'production' ? 18000 : 600);
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

@Resolver(PartyUser)
export default class PartyUserResolver {
  @Query(_returns => String)
  async getToken(@Arg('roomId') roomId: string, @Ctx() { identity }: RequestContext): Promise<string> {
    const token = new AccessToken(twilioAccountSid!, twilioApiKeySID!, twilioApiKeySecret!, {
      ttl: MAX_ALLOWED_SESSION_DURATION,
      identity,
    });
    const videoGrant = new VideoGrant({ room: roomId });
    token.addGrant(videoGrant);
    console.log(`issued token for ${identity} in room ${roomId}`);

    return token.toJwt();
  }
}

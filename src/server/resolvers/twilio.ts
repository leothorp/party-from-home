import { Resolver, Mutation, Authorized, Arg, Ctx } from 'type-graphql';
import { RequestContext } from '../context';
import { jwt } from 'twilio';
import { twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, MAX_ALLOWED_SESSION_DURATION } from '../config';

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

@Resolver()
export default class TwilioResolver {
  @Mutation(_returns => String)
  @Authorized('USER')
  async generateRoomToken(@Arg('roomId') roomId: string, @Ctx() { identity }: RequestContext): Promise<string> {
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

import Base64 from 'base-64';
import { TwitterRequest } from './TwitterRequest';
import { UnexpectedResponseError, NeedAppTokenError, NoAPIKeys } from './TwitterErrors';

const TWITTER_AUTH_RETRY_DEFAULT = true;
const TWITTER_AUTH_RETRY_NONE = false;

export class TwitterAppAPI {
  constructor(store, net) {
    this.store = store;
    this.net = net;
  }

  fetch(twitterRequest) {
    return this.fetchWithAppAuth(twitterRequest, TWITTER_AUTH_RETRY_DEFAULT);
  }

  fetchWithAppAuth(twitterRequest, shouldRetry) {
    return this.store.appToken
      .get()
      .then(appToken => {
        if (!appToken) {
          throw new NeedAppTokenError();
        }
        twitterRequest.headers = {
          ...twitterRequest.headers,
          Authorization: `Bearer ${appToken}`
        };
        return this.net.fetch(twitterRequest);
        // TODO: check for expired token
      })
      .catch(error => {
        if (error instanceof NeedAppTokenError) {
          if (shouldRetry) {
            return this.fetchAppToken()
              .then(receivedAppToken => this.store.appToken.set(receivedAppToken))
              .then(() => this.fetchWithAppAuth(twitterRequest, TWITTER_AUTH_RETRY_NONE));
          }
        }
        throw error;
      });
  }

  fetchAppToken() {
    return Promise.all([this.store.apiKey.get(), this.store.apiSecret.get()])
      .then(([apiKey, apiSecret]) => {
        if (!apiKey || !apiSecret) {
          throw new NoAPIKeys();
        }
        const token = Base64.encode(
          `${encodeURIComponent(apiKey)}:${encodeURIComponent(apiSecret)}`
        );
        return new TwitterRequest('POST', '/oauth2/token', {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          body: 'grant_type=client_credentials'
        });
      })
      .then(twitterRequest => this.net.fetch(twitterRequest))
      .then(response => response.json())
      .then(json => {
        const appToken = json.access_token;
        if (json.token_type !== 'bearer' || !appToken) {
          throw new UnexpectedResponseError();
        }
        return appToken;
      });
  }
}

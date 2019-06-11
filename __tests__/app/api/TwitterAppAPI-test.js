/* eslint-disable max-lines-per-function */
/* eslint-disable babel/camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import { fetchMock } from 'fetch-mock';
import 'react-native';
import { TwitterAppAPI } from '../../../app/api/TwitterAppAPI';
import {
  HTTPResponseStatusError,
  NoAPIKeys,
  UnexpectedResponseError
} from '../../../app/api/TwitterErrors';
import { TwitterNetworking } from '../../../app/api/TwitterNetworking';
import { TwitterRequest } from '../../../app/api/TwitterRequest';
import { TwitterStore } from '../../../app/api/TwitterStore';

const getOAuth2TokenData = {
  access_token: 'access-token',
  token_type: 'bearer'
};

const getOAuth2TokenDataWithoutToken = {
  access_token: undefined,
  token_type: 'bearer'
};

const getOAuth2TokenDataWithInvalidType = {
  access_token: 'token',
  token_type: 'asd'
};

describe('TwitterNetworking', () => {
  let net = null;
  let store = null;
  let api = null;

  beforeEach(async () => {
    global.fetch = fetchMock.sandbox();
    AsyncStorage.clear();
    store = new TwitterStore();
    await store.baseURL.set('https://t');
    await store.apiKey.set('apiKey');
    await store.apiSecret.set('apiSecret');
    net = new TwitterNetworking(store);
    api = new TwitterAppAPI(store, net);
  });

  it('return error when auth response without token is received', async () => {
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenDataWithoutToken);

    await expect(api.fetch(new TwitterRequest('GET', '/withAppAuth'))).rejects.toThrow(
      new UnexpectedResponseError()
    );
  });

  it('return error when auth response with invalid token type is received', async () => {
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenDataWithInvalidType);
    await expect(api.fetch(new TwitterRequest('GET', '/withAppAuth'))).rejects.toThrow(
      new UnexpectedResponseError()
    );
  });

  it('returns token error on http non 200', async () => {
    fetch.postOnce('https://t/oauth2/token', 500);
    await expect(api.fetch(new TwitterRequest('GET', '/w'))).rejects.toThrow(
      new HTTPResponseStatusError(500)
    );
  });

  it('returns endpoint error on http non 200', async () => {
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenData);
    fetch.getOnce('https://t/w', 500);
    await expect(api.fetch(new TwitterRequest('GET', '/w'))).rejects.toThrow(
      new HTTPResponseStatusError(500)
    );
  });
  it('returns endpoint error if no api keys', async () => {
    await store.apiKey.remove();
    await store.apiSecret.remove();
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenData);
    fetch.getOnce('https://t/w', 'ok');
    await expect(api.fetch(new TwitterRequest('GET', '/w'))).rejects.toThrow(new NoAPIKeys());
  });

  it('fetches data from server when server returns a successful response', async () => {
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenData);
    fetch.getOnce('https://t/withAppAuth', 'ok');
    const response = await api.fetch(new TwitterRequest('GET', '/withAppAuth'));
    expect(JSON.stringify(fetch.calls())).toBe(
      JSON.stringify([
        [
          'https://t/oauth2/token',
          {
            method: 'POST',
            headers: {
              Authorization: ['Basic YXBpS2V5OmFwaVNlY3JldA=='],
              'Content-Type': ['application/x-www-form-urlencoded;charset=UTF-8'],
              body: ['grant_type=client_credentials']
            }
          }
        ],
        [
          'https://t/withAppAuth',
          {
            method: 'GET',
            headers: {
              Authorization: ['Bearer access-token']
            }
          }
        ]
      ])
    );
    expect(await response.text()).toStrictEqual('ok');
  });
});

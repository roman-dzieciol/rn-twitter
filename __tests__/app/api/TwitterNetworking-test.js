/* eslint-disable max-lines-per-function */
/* eslint-disable babel/camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import { fetchMock } from 'fetch-mock';
import 'react-native';

import { HTTPResponseStatusError, UnexpectedResponseError } from '../../../app/api/TwitterErrors';
import { TwitterStore } from '../../../app/api/TwitterStore';
import { TwitterRequest } from '../../../app/api/TwitterRequest';
import { TwitterNetworking } from '../../../app/api/TwitterNetworking';
import { TwitterAppAPI } from '../../../app/api/TwitterAppAPI';
import { TwitterAPI } from '../../../app/api/Twitter';

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

const getUserTimelineData = [
  {
    text: 't',
    id: '1'
  },
  {
    text: 't',
    id: '2'
  }
];

describe('TwitterNetworking', () => {
  let net = null;
  let store = null;

  beforeEach(() => {
    global.fetch = fetchMock.sandbox();
    AsyncStorage.clear();
    store = new TwitterStore();
    store.baseURL.set('https://t');
    net = new TwitterNetworking(store);
  });

  it('returns error on http non 200', async () => {
    fetch.mock('https://t/w', 500);
    await expect(net.fetch(new TwitterRequest('GET', '/w'))).rejects.toThrow(
      new HTTPResponseStatusError(500)
    );
  });

  it('returns data on http 200', async () => {
    fetch.mock('https://t/w', 'ok', {
      method: 'POST',
      headers: {
        Authorization: 'token'
      },
      functionMatcher: async (url, headers, request) => {
        const text = await request.text();
        return text === 'ok';
      }
    });
    const response = await net.fetch(
      new TwitterRequest('POST', '/w', { Authorization: 'token' }, 'query')
    );
    await expect(response.text()).resolves.toEqual('ok');
  });

  it('logs request and response', async () => {
    fetch.mock('https://t/w', { ok: true });
    net.logRequest = true;
    net.logResponse = true;
    net.logResponseJSON = true;
    net.logger = {};
    net.logger.log = jest.fn();

    const response = await net.fetch(
      new TwitterRequest('POST', '/w', { Authorization: 'token' }, 'query')
    );

    expect(net.logger.log.mock.calls[0][0]).toMatch(/request stack: .*/u);
    expect(net.logger.log.mock.calls.slice(1)).toEqual([
      ['request {"size":0,"timeout":0,"follow":20,"compress":true,"counter":0}'],
      ['response: {"size":0,"timeout":0}'],
      ['response json: {"ok":true}']
    ]);
  });
});

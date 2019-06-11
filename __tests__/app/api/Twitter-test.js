/* eslint-disable babel/camelcase */
import 'react-native';
import React from 'react';
import { fetchMock } from 'fetch-mock';

import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
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
  let store = null;
  let api = null;

  beforeEach(async () => {
    global.fetch = fetchMock.sandbox();
    AsyncStorage.clear();
    store = new TwitterStore();
    await store.baseURL.set('https://t');
    await store.apiKey.set('apiKey');
    await store.apiSecret.set('apiSecret');
    api = new TwitterAPI(store);
  });

  it('returns timeline', async () => {
    fetch.postOnce('https://t/oauth2/token', getOAuth2TokenData);
    fetch.getOnce(
      'https://t/1.1/statuses/user_timeline.json?screen_name=twitterdev&count=2',
      getUserTimelineData
    );
    await expect(api.fetchUserTimeline()).resolves.toStrictEqual(getUserTimelineData);
  });

  it('logs out', async () => {
    await store.userToken.remove();
    await expect(api.needsLogin()).resolves.toBeTruthy();
    await store.userToken.set('token');
    await expect(api.needsLogin()).resolves.toBeFalsy();
    await api.logout();
    await expect(api.needsLogin()).resolves.toBeTruthy();
  });
});

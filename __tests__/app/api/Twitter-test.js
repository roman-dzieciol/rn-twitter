/* eslint-disable babel/camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import { fetchMock } from 'fetch-mock';
import 'react-native';
import { TwitterAPI } from '../../../app/api/Twitter';
import { TwitterStore } from '../../../app/api/TwitterStore';

const getOAuth2TokenData = {
  access_token: 'access-token',
  token_type: 'bearer'
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

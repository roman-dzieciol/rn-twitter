/* eslint-disable babel/camelcase */
import 'react-native';
import React from 'react';
import { Twitter } from '../../../app/api/Twitter';
import { fetchMock } from 'fetch-mock';

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

describe('ExampleComponent', () => {
  it('fetches data from server when server returns a successful response', async () => {
    global.fetch = fetchMock.sandbox();

    fetch.mock('https://t/oauth2/token', getOAuth2TokenData);

    fetch.mock(
      'https://t/1.1/statuses/user_timeline.json?screen_name=twitterdev&count=2',
      getUserTimelineData
    );

    const twitter = new Twitter();
    const data = await twitter.fetchUserTimeline();
    expect(data).toStrictEqual(getUserTimelineData);
  });
});

import 'react-native';
import React from 'react';
import { Twitter } from '../../../app/api/Twitter';

test('logs out', async () => {
  await Twitter.logout();
});

describe('ExampleComponent', () => {
  it('fetches data from server when server returns a successful response', async () => {
    // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const twitter = new Twitter();
    await twitter.fetchUserTimeline();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://url-of-your-server.com/example/json');
    global.fetch.mockClear();
  });
});

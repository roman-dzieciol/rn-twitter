import { TwitterStore } from './TwitterStore';
import { TwitterRequest } from './TwitterRequest';
import { TwitterNetworking } from './TwitterNetworking';
import { TwitterAppAPI } from './TwitterAppAPI';

const TWITTER_FETCH_USER_TIMELINE_MAX_DEFAULT = 2;

export class TwitterAPI {
  constructor(store = new TwitterStore()) {
    this.store = store;
    this.net = new TwitterNetworking(store);
    this.appAPI = new TwitterAppAPI(store, this.net);
  }

  fetchUserTimeline(
    screenName = 'twitterdev',
    maxTweets = TWITTER_FETCH_USER_TIMELINE_MAX_DEFAULT
  ) {
    const twitterRequest = new TwitterRequest(
      'GET',
      `/1.1/statuses/user_timeline.json?screen_name=${screenName}&count=${maxTweets}`
    );
    return this.appAPI.fetch(twitterRequest).then(response => response.json());
  }

  logout() {
    return this.store.userToken.remove();
  }

  needsLogin() {
    return this.store.userToken.get().then(userToken => {
      return !userToken;
    });
  }
}

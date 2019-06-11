import AsyncStorage from '@react-native-community/async-storage';

const TWITTER_STORE_API_KEY = 'TWITTER_STORE_API_KEY';
const TWITTER_STORE_API_SECRET = 'TWITTER_STORE_API_SECRET';
const TWITTER_STORE_APP_TOKEN = 'TWITTER_STORE_APP_TOKEN';
const TWITTER_STORE_USER_TOKEN = 'TWITTER_STORE_USER_TOKEN';
const TWITTER_STORE_BASE_URL = 'TWITTER_STORE_BASE_URL';

export class TwitterStoreItem {
  constructor(key) {
    this.key = key;
  }

  get() {
    return AsyncStorage.getItem(this.key);
  }

  set(value) {
    return AsyncStorage.setItem(this.key, value);
  }

  remove(value) {
    return AsyncStorage.removeItem(this.key);
  }
}

export class TwitterStore {
  apiKey = new TwitterStoreItem(TWITTER_STORE_API_KEY);

  apiSecret = new TwitterStoreItem(TWITTER_STORE_API_SECRET);

  appToken = new TwitterStoreItem(TWITTER_STORE_APP_TOKEN);

  userToken = new TwitterStoreItem(TWITTER_STORE_USER_TOKEN);

  baseURL = new TwitterStoreItem(TWITTER_STORE_BASE_URL);
}

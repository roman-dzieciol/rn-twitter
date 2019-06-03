import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import Base64 from 'base-64';

const TWITTER_STORE_APP_TOKEN_KEY = 'TWITTER_STORE_AUTH_TOKEN_KEY';
const TWITTER_STORE_USER_TOKEN_KEY = 'TWITTER_STORE_USER_TOKEN_KEY';

const TWITTER_AUTH_RETRY_DEFAULT = 1;
const TWITTER_AUTH_RETRY_NONE = 0;

const TWITTER_FETCH_USER_TIMELINE_MAX_DEFAULT = 2;

class NeedAppTokenError extends Error {}
class UnexpectedResponseError extends Error {}

class HTTPResponseStatusError extends Error {
  constructor(response, message) {
    super(message);
    this.response = response;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

function _url(path) {
  return new URL(path, Config.TWITTER_API_URL);
}

function _headersForAnyRequest() {
  return new Headers();
}

function _headersForJSONRequest() {
  return new Headers({
    'Content-Type': 'application/json'
  });
}

function _headersForAppAuth(appToken) {
  return new Headers({
    Authorization: `Bearer ${appToken}`
  });
}

function _appToken() {
  return AsyncStorage.getItem(TWITTER_STORE_APP_TOKEN_KEY).then(appToken => {
    if (!appToken) {
      throw new NeedAppTokenError();
    }
    return appToken;
  });
}

function _withHeaders(headersToAdd, request) {
  const headers = new Headers(request.headers);
  for (const [key, value] of headersToAdd.entries()) {
    headers.append(key, value);
  }
  return new Request(request, { headers });
}

function _fetch(request) {
  return Promise.resolve().then(() => {
    const err = new Error();
    console.log(`request stack: ${err.stack}`);
    console.log(`request ${JSON.stringify(request)}`);
    return fetch(_withHeaders(_headersForAnyRequest(), request)).then(response => {
      if (!response.ok) {
        throw new HTTPResponseStatusError(response);
      }
      return response;
    });
  });
}

function _fetchJSON(request) {
  return Promise.resolve().then(() => {
    return _fetch(_withHeaders(_headersForJSONRequest(), request))
      .then(response => {
        console.log(`response: ${JSON.stringify(response)}`);
        return response;
      })
      .then(response => response.json())
      .then(json => {
        // console.log(`response json: ${JSON.stringify(json)}`);
        return json;
      });
  });
}

function _fetchWithAppAuth(request, shouldRetry = TWITTER_AUTH_RETRY_DEFAULT) {
  return _appToken()
    .then(appToken => {
      return _fetchJSON(_withHeaders(_headersForAppAuth(appToken), request));
    })
    .catch(error => {
      if (error instanceof NeedAppTokenError && shouldRetry) {
        return _fetchToken().then(() => _fetchWithAppAuth(request, TWITTER_AUTH_RETRY_NONE));
      } else {
        throw error;
      }
    });
}

function _fetchToken() {
  return Promise.resolve().then(() => {
    const token = Base64.encode(
      `${encodeURIComponent(Config.TWITTER_API_KEY)}:${encodeURIComponent(
        Config.TWITTER_API_SECRET_KEY
      )}`
    );
    const request = new Request(_url(`/oauth2/token`), {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: 'grant_type=client_credentials'
    });
    return _fetchJSON(request).then(json => {
      const appToken = json.access_token;
      if (json.token_type !== 'bearer' || !appToken) {
        throw new UnexpectedResponseError();
      }
      return AsyncStorage.setItem(TWITTER_STORE_APP_TOKEN_KEY, appToken);
    });
  });
}

export class Twitter {
  fetchUserTimeline = (
    screenName = 'twitterdev',
    maxTweets = TWITTER_FETCH_USER_TIMELINE_MAX_DEFAULT
  ) => {
    return Promise.resolve().then(() => {
      const request = new Request(
        _url(`/1.1/statuses/user_timeline.json?screen_name=${screenName}&count=${maxTweets}`),
        {
          method: 'GET'
        }
      );
      return _fetchWithAppAuth(request);
    });
  };

  logout = () => {
    return AsyncStorage.removeItem(TWITTER_STORE_APP_TOKEN_KEY);
  };

  needsLogin = () => {
    return AsyncStorage.getItem(TWITTER_STORE_USER_TOKEN_KEY).then(userToken => {
      return !userToken;
    });
  };
}

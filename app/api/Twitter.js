

import Config from "react-native-config";
import AsyncStorage from "@react-native-community/async-storage";
import Base64 from 'base-64';

const TWITTER_STORE_APP_TOKEN_KEY = 'TWITTER_STORE_AUTH_TOKEN_KEY'

class NeedAppTokenError extends Error { };
class UnexpectedResponseError extends Error { };

class HTTPResponseStatusError extends Error {
    constructor(response, message) {
        super(message);
        this.response = response
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
};

function _url(path) {
    return new URL(path, Config.TWITTER_API_URL)
}

function _headersForAnyRequest() {
    return new Headers()
}

function _headersForJSONRequest() {
    return new Headers({
        'Content-Type': 'application/json'
    })
}

function _headersForAppAuth(appToken) {
    return new Headers({
        'Authorization': `Bearer ${appToken}`
    })
}

async function _appToken() {
    return AsyncStorage.getItem(TWITTER_STORE_APP_TOKEN_KEY)
        .then(appToken => {
            if (!appToken) {
                throw new NeedAppTokenError();
            }
            return appToken;
        })
}

function _withHeaders(headersToAdd, request) {
    const headers = new Headers(request.headers)
    for (var pair of headersToAdd.entries()) {
        headers.append(pair[0], pair[1]);
    }
    return new Request(request, { headers: headers });
}

async function _fetch2(request) {
    var err = new Error();
    console.log(`request stack: ${err.stack}`);
    console.log(`request ${JSON.stringify(request)}`)
    return fetch(request)
}

async function _fetch(request) {
    return Promise.resolve()
        .then(() => _fetch2(_withHeaders(_headersForAnyRequest(), request)))
        .then(response => {
            if (!response.ok) {
                throw new HTTPResponseStatusError(response);
            }
            return response
        });
}

async function _fetchJSON(request) {
    return Promise.resolve()
        .then(() => _fetch(_withHeaders(_headersForJSONRequest(), request)))
        .then(response => {
            console.log(`response: ${JSON.stringify(response)}`);
            return response;
        })
        .then(response => response.json())
        .then(json => {
            //console.log(`response json: ${JSON.stringify(json)}`);
            return json;
        });
}

async function _fetchWithAppAuth(request, shouldRetry = 1) {
    return _appToken()
        .then(appToken => _fetchJSON(_withHeaders(_headersForAppAuth(appToken), request)))
        .catch(error => {
            if (error instanceof NeedAppTokenError && shouldRetry) {
                return _fetchToken().then(() => _fetchWithAppAuth(request, 0))
            } else {
                throw error;
            }
        });
}

function _fetchToken() {
    return Promise.resolve().then(() => {
        const token = Base64.encode(`${encodeURIComponent(Config.TWITTER_API_KEY)}:${encodeURIComponent(Config.TWITTER_API_SECRET_KEY)}`)
        const request = new Request(_url(`/oauth2/token`), {
            method: "POST",
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: 'grant_type=client_credentials'
        });
        return _fetchJSON(request)
            .then(json => {
                const appToken = json.access_token;
                if (json.token_type !== 'bearer' || !appToken) {
                    throw new UnexpectedResponseError();
                }
                return AsyncStorage.setItem(TWITTER_STORE_APP_TOKEN_KEY, appToken);
            });
    });
}

export function fetchUserTimeline(screenName = "twitterdev", maxTweets = 11) {
    return Promise.resolve().then(() => {
        const request = new Request(_url(`/1.1/statuses/user_timeline.json?screen_name=${screenName}&count=${maxTweets}`), {
            method: "GET"
        });
        return _fetchWithAppAuth(request);
    });
};

export async function logout() {
    return AsyncStorage.removeItem(TWITTER_STORE_APP_TOKEN_KEY)
}

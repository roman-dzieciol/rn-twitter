import { HTTPResponseStatusError } from './TwitterErrors';

export class TwitterNetworking {
  logRequest = false;

  logResponse = false;

  logResponseJSON = false;

  logger = console;

  constructor(store) {
    this.store = store;
  }

  requestForFetch(twitterRequest) {
    return this.store.baseURL.get().then(baseURL => {
      return new Request(new URL(twitterRequest.url, baseURL), {
        method: twitterRequest.method,
        headers: twitterRequest.headers,
        body: twitterRequest.body
      });
    });
  }

  fetch(twitterRequest) {
    return this.requestForFetch(twitterRequest).then(request => {
      const err = new Error();
      if (this.logRequest) {
        this.logger.log(`request stack: ${err.stack}`);
        this.logger.log(`request ${JSON.stringify(request)}`);
      }
      return fetch(request)
        .then(async response => {
          if (this.logResponse) {
            this.logger.log(`response: ${JSON.stringify(response)}`);
          }
          if (this.logResponseJSON) {
            try {
              const json = await response.json();
              this.logger.log(`response json: ${JSON.stringify(json)}`);
            } catch (error) {}
          }
          return response;
        })
        .then(response => {
          if (!response.ok) {
            throw new HTTPResponseStatusError(response);
          }
          return response;
        });
    });
  }
}

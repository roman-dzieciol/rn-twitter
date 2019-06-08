import { Request, Headers, Response } from 'node-fetch';

global.Request = Request;
global.Headers = Headers;
global.Response = Response;

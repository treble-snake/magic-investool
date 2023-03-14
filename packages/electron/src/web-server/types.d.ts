import type {Request} from 'express';

export type ApiEvent = Pick<Request, 'query' | 'url' | 'path' | 'params' | 'body' | 'method'>;
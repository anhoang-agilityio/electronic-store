import {
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
  type HttpMethod,
} from '@effect/platform';
import { Context, Effect, Layer, Schema } from 'effect';

import { loadPublicConfig } from '@/config/public-config';

export class HttpRequestError extends Schema.TaggedError<HttpRequestError>(
  'HttpRequestError',
)('HttpRequestError', {
  method: Schema.String,
  url: Schema.String,
  cause: Schema.Defect,
}) {}

export class HttpResponseError extends Schema.TaggedError<HttpResponseError>(
  'HttpResponseError',
)('HttpResponseError', {
  status: Schema.Number,
  method: Schema.String,
  url: Schema.String,
  cause: Schema.Defect,
}) {}

export type Error = HttpRequestError | HttpResponseError;

export type RequestOptions = Omit<HttpClientRequest.Options, 'method' | 'url'>;

export type TransportOptions = RequestOptions & {
  readonly method?: HttpMethod.HttpMethod;
};

export type Interface = {
  readonly request: (
    path: string,
    options?: TransportOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
  readonly get: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
  readonly post: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
  readonly put: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
  readonly patch: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
  readonly delete: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<HttpClientResponse.HttpClientResponse, Error>;
};

export class Service extends Context.Tag('ApiClient')<Service, Interface>() {}

function mapHttpClientError(error: HttpClientError.HttpClientError): Error {
  if (error instanceof HttpClientError.RequestError) {
    return new HttpRequestError({
      method: error.request.method,
      url: error.request.url,
      cause: error,
    });
  }

  return new HttpResponseError({
    status: error.response.status,
    method: error.request.method,
    url: error.request.url,
    cause: error,
  });
}
export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const config = yield* loadPublicConfig();
    const httpClient = yield* HttpClient.HttpClient;
    const baseUrl = config.apiUrl.toString().replace(/\/?$/, '/');

    const configuredClient = httpClient.pipe(
      HttpClient.mapRequest((request) => {
        const callerHeaders = request.headers;

        return request.pipe(
          HttpClientRequest.prependUrl(baseUrl),
          HttpClientRequest.acceptJson,
          HttpClientRequest.setHeader('Content-Type', 'application/json'),
          HttpClientRequest.setHeader('X-API-Key', config.apiKey),
          HttpClientRequest.setHeaders(callerHeaders),
        );
      }),
    );

    const request: Interface['request'] = Effect.fn('ApiClient.request')((
      path,
      options = {},
    ) => {
      const { method = 'GET', ...requestOptions } = options;
      const httpRequest = HttpClientRequest.make(method)(path, requestOptions);

      return configuredClient
        .execute(httpRequest)
        .pipe(
          Effect.flatMap(HttpClientResponse.filterStatusOk),
          Effect.mapError(mapHttpClientError),
        );
    });

    const get: Interface['get'] = Effect.fn('ApiClient.get')((path, options) =>
      request(path, { ...options, method: 'GET' }),
    );
    const post: Interface['post'] = Effect.fn('ApiClient.post')(
      (path, options) => request(path, { ...options, method: 'POST' }),
    );
    const put: Interface['put'] = Effect.fn('ApiClient.put')((path, options) =>
      request(path, { ...options, method: 'PUT' }),
    );
    const patch: Interface['patch'] = Effect.fn('ApiClient.patch')(
      (path, options) => request(path, { ...options, method: 'PATCH' }),
    );
    const del: Interface['delete'] = Effect.fn('ApiClient.delete')(
      (path, options) => request(path, { ...options, method: 'DELETE' }),
    );

    return Service.of({ request, get, post, put, patch, delete: del });
  }),
);

/** Resolves the configured API client from the calling Effect environment. */
export const apiTransport = Effect.fn('ApiClient.apiTransport')(
  (path: string, options: TransportOptions = {}) =>
    Effect.flatMap(Service, (client) => client.request(path, options)),
);

export * as ApiClient from './api-client';

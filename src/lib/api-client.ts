import {
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
  type HttpMethod,
} from '@effect/platform';
import { Context, Effect, Layer } from 'effect';

import { loadPublicConfig } from '@/config/public-config';

export type RequestOptions = Omit<HttpClientRequest.Options, 'method' | 'url'>;

export type TransportOptions = RequestOptions & {
  readonly method?: HttpMethod.HttpMethod;
};

export type Interface = {
  readonly request: (
    path: string,
    options?: TransportOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
  readonly get: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
  readonly post: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
  readonly put: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
  readonly patch: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
  readonly delete: (
    path: string,
    options?: RequestOptions,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError
  >;
};

export class Service extends Context.Tag('ApiClient')<Service, Interface>() {}

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
        .pipe(Effect.flatMap(HttpClientResponse.filterStatusOk));
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

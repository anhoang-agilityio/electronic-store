import {
  FetchHttpClient,
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

export type ApiClientType = {
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

/** Application HTTP transport. Body decoding remains the caller's concern. */
export class ApiClient extends Context.Tag('ApiClient')<
  ApiClient,
  ApiClientType
>() {}

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

/** Fetch-backed implementation of ApiClient. */
export const ApiClientLive = Layer.effect(
  ApiClient,
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

    const request: ApiClientType['request'] = Effect.fn('ApiClient.request')((
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

    const withMethod =
      (method: HttpMethod.HttpMethod) =>
      (path: string, options?: RequestOptions) =>
        request(path, { ...options, method });

    return ApiClient.of({
      request,
      get: withMethod('GET'),
      post: withMethod('POST'),
      put: withMethod('PUT'),
      patch: withMethod('PATCH'),
      delete: withMethod('DELETE'),
    });
  }),
).pipe(Layer.provide(FetchHttpClient.layer));

/**
 * Compatibility facade for existing callers. New Effect code should yield
 * ApiClient and call its methods directly.
 */
export const apiTransport = Effect.fn('ApiClient.apiTransport')(
  (path: string, options: TransportOptions = {}) =>
    Effect.flatMap(ApiClient, (client) => client.request(path, options)).pipe(
      Effect.provide(ApiClientLive),
      Effect.mapError((cause) =>
        cause instanceof HttpRequestError || cause instanceof HttpResponseError
          ? cause
          : new HttpRequestError({
              method: options.method ?? 'GET',
              url: path,
              cause,
            }),
      ),
    ),
);

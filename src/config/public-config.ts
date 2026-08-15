import { Context, Effect, Layer, ParseResult, Schema } from 'effect';

const HttpUrl = Schema.URL.pipe(
  Schema.filter(
    (url) => url.protocol === 'http:' || url.protocol === 'https:',
    { message: () => 'Expected an HTTP or HTTPS URL' },
  ),
);

const TrimmedNonEmptyString = Schema.Trim.pipe(Schema.nonEmptyString());

const publicConfig = Schema.Struct({
  baseUrl: HttpUrl,
  apiUrl: HttpUrl,
  apiKey: TrimmedNonEmptyString,
});

type PublicConfig = Schema.Schema.Type<typeof publicConfig>;
export type Interface = {
  readonly get: Effect.Effect<PublicConfig, ParseResult.ParseError>;
};

export class Service extends Context.Tag('PublicConfig')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const get = yield* Effect.cached(
      Schema.decodeUnknown(publicConfig)({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
      }),
    );

    return Service.of({ get });
  }),
);

export const defaultLayer = layer;

export * as PublicConfig from './public-config';

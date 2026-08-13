import {
  Config,
  type ConfigError,
  ConfigProvider,
  Effect,
  Schema,
} from 'effect';

const HttpUrl = Schema.URL.pipe(
  Schema.filter(
    (url) => url.protocol === 'http:' || url.protocol === 'https:',
    { message: () => 'Expected an HTTP or HTTPS URL' },
  ),
);

const TrimmedNonEmptyString = Schema.Trim.pipe(Schema.nonEmptyString());

const publicConfigRecipe = Config.all({
  baseUrl: Schema.Config('NEXT_PUBLIC_BASE_URL', HttpUrl),
  apiUrl: Schema.Config('NEXT_PUBLIC_API_URL', HttpUrl),
  apiKey: Schema.Config('NEXT_PUBLIC_API_KEY', TrimmedNonEmptyString),
});

/** Browser-safe configuration decoded from Next.js public environment values. */
export type PublicConfig = Config.Config.Success<typeof publicConfigRecipe>;

/** Loads public environment configuration while preserving typed configuration failures. */
export function loadPublicConfig(): Effect.Effect<
  PublicConfig,
  ConfigError.ConfigError
> {
  const nextPublicConfigProvider = ConfigProvider.fromJson({
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  });

  return Effect.withConfigProvider(
    publicConfigRecipe,
    nextPublicConfigProvider,
  );
}

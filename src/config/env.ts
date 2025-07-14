import { z } from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    BASE_URL: z.string(),
    API_URL: z.string(),
    API_KEY: z.string(),
  });

  const envVars = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v?.join(', ')}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();

export interface Config {
  jwtSecret: string;
  inviteCode: string;
}

/** Reads the settings the API cannot run without. Exported separately from
 * `config` so it can be tested without touching the real environment. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const jwtSecret = env.JWT_SECRET;
  const inviteCode = env.INVITE_CODE;
  if (!jwtSecret) throw new Error("JWT_SECRET is required but not set");
  if (!inviteCode) throw new Error("INVITE_CODE is required but not set");
  return { jwtSecret, inviteCode };
}

/** Evaluated at import time: a server that starts with an empty signing secret
 * issues tokens anyone can forge, so failing loudly here is the point. */
export const config = loadConfig();

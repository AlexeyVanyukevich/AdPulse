import type { Request } from "express";
import { UnauthorizedError } from "../errors.js";

/** The caller's id, narrowed to a plain string. `req.user` is optional in the
 * type because Express does not know about the middleware, but every route
 * that calls this sits behind requireAuth. */
export function userId(req: Request): string {
  if (!req.user) throw new UnauthorizedError("Authentication required");
  return req.user.id;
}

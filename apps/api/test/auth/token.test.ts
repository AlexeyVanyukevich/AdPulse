import { describe, it, expect } from "vitest";
import {
  signAccessToken, verifyAccessToken, generateRefreshToken,
  hashRefreshToken, refreshTokenExpiry,
} from "../../src/auth/token.js";

const claims = { sub: "user-1", name: "Buyer", email: "buyer@acme.com" };

describe("access tokens", () => {
  it("round-trips its claims", async () => {
    const token = await signAccessToken(claims);
    expect(await verifyAccessToken(token)).toMatchObject(claims);
  });

  it("expires 15 minutes after it is issued", async () => {
    const token = await signAccessToken(claims);
    const [, payload] = token.split(".");
    const { iat, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    expect(Math.abs(exp - iat - 900)).toBeLessThanOrEqual(1);
  });

  it("rejects a tampered token", async () => {
    const token = await signAccessToken(claims);
    await expect(verifyAccessToken(`${token}x`)).rejects.toThrow();
  });

  it("rejects a token that is not a token at all", async () => {
    await expect(verifyAccessToken("nonsense")).rejects.toThrow();
  });
});

describe("refresh tokens", () => {
  it("generates 32 bytes of hex", () => {
    expect(generateRefreshToken()).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates a different token each time", () => {
    expect(generateRefreshToken()).not.toBe(generateRefreshToken());
  });

  it("hashes deterministically and does not return the token itself", () => {
    const token = generateRefreshToken();
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).not.toBe(token);
  });

  it("expires 30 days after the given moment", () => {
    const now = new Date("2026-08-13T00:00:00.000Z");
    expect(refreshTokenExpiry(now).toISOString()).toBe("2026-09-12T00:00:00.000Z");
  });
});

import { describe, it, expect } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("reads both required variables", () => {
    const config = loadConfig({ JWT_SECRET: "s", INVITE_CODE: "c" });
    expect(config).toEqual({ jwtSecret: "s", inviteCode: "c" });
  });

  it("throws when JWT_SECRET is missing", () => {
    expect(() => loadConfig({ INVITE_CODE: "c" })).toThrow(/JWT_SECRET/);
  });

  it("throws when INVITE_CODE is missing", () => {
    expect(() => loadConfig({ JWT_SECRET: "s" })).toThrow(/INVITE_CODE/);
  });

  it("treats an empty value as missing", () => {
    expect(() => loadConfig({ JWT_SECRET: "", INVITE_CODE: "c" })).toThrow(/JWT_SECRET/);
  });
});

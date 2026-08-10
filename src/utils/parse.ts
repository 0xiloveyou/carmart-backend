import { Request } from "express";
import { throwError } from "./appError";

export const pick = <T extends Record<string, unknown>>(source: T, keys: string[]) => {
  return keys.reduce<Record<string, unknown>>((acc, key) => {
    if (source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
};

export const requireFields = (body: Record<string, unknown>, fields: string[]) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) {
    throw Object.assign(new Error(`Missing required field(s): ${missing.join(", ")}`), { statusCode: 400 });
  }
};

export const numberFromQuery = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw Object.assign(new Error("Invalid numeric query parameter"), { statusCode: 400 });
  }
  return parsed;
};

export const getUser = (req: Request) => {
  if (!req.user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return req.user;
};

export const requiredParam = (value: string | string[] | undefined, name: string): string => {
  if (typeof value !== "string" || !value) {
    throwError(400, `${name} parameter is required`);
  }
  return value as string;
};

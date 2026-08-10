import { UserRole } from "@prisma/client";
import { throwError } from "../../utils/appError";
import { requireFields } from "../../utils/parse";

const profileFields = ["firstName", "lastName", "phone", "avatar", "address", "city", "country"];

export const validateRegister = (body: Record<string, any>) => {
  requireFields(body, ["email", "password", "role"]);

  if (![UserRole.CUSTOMER, UserRole.SELLER].includes(body.role)) {
    throwError(400, "Role must be CUSTOMER or SELLER");
  }

  if (String(body.password).length < 6) {
    throwError(400, "Password must be at least 6 characters");
  }

  return {
    email: String(body.email).toLowerCase().trim(),
    password: String(body.password),
    role: body.role as UserRole,
    profile: profileFields.reduce<Record<string, string>>((acc, field) => {
      if (body[field] !== undefined) {
        acc[field] = String(body[field]);
      }
      return acc;
    }, {}),
  };
};

export const validateLogin = (body: Record<string, any>) => {
  requireFields(body, ["email", "password"]);

  return {
    email: String(body.email).toLowerCase().trim(),
    password: String(body.password),
  };
};

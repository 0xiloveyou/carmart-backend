import { CarCondition, FuelType, Transmission } from "@prisma/client";
import { throwError } from "../../utils/appError";
import { requireFields } from "../../utils/parse";

const assertEnum = <T extends Record<string, string>>(value: unknown, enumValue: T, field: string) => {
  if (!Object.values(enumValue).includes(String(value))) {
    throwError(400, `${field} is invalid`);
  }
};

export const validateCarCreate = (body: Record<string, any>) => {
  requireFields(body, ["brand", "model", "year", "price", "mileage", "fuelType", "transmission", "condition"]);

  assertEnum(body.fuelType, FuelType, "fuelType");
  assertEnum(body.transmission, Transmission, "transmission");
  assertEnum(body.condition, CarCondition, "condition");

  return {
    brand: String(body.brand),
    model: String(body.model),
    year: Number(body.year),
    price: Number(body.price),
    mileage: Number(body.mileage),
    fuelType: body.fuelType as FuelType,
    transmission: body.transmission as Transmission,
    condition: body.condition as CarCondition,
    description: body.description ? String(body.description) : undefined,
    images: Array.isArray(body.images) ? body.images : [],
  };
};

export const validateCarUpdate = (body: Record<string, any>) => {
  const data: Record<string, any> = {};
  for (const field of ["brand", "model", "description"]) {
    if (body[field] !== undefined) {
      data[field] = String(body[field]);
    }
  }

  for (const field of ["year", "price", "mileage"]) {
    if (body[field] !== undefined) {
      data[field] = Number(body[field]);
    }
  }

  if (body.fuelType !== undefined) {
    assertEnum(body.fuelType, FuelType, "fuelType");
    data.fuelType = body.fuelType;
  }

  if (body.transmission !== undefined) {
    assertEnum(body.transmission, Transmission, "transmission");
    data.transmission = body.transmission;
  }

  if (body.condition !== undefined) {
    assertEnum(body.condition, CarCondition, "condition");
    data.condition = body.condition;
  }

  if (Array.isArray(body.images)) {
    data.images = body.images;
  }

  return data;
};

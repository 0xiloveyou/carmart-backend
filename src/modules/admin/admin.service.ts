import { CarStatus, OrderStatus, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { pick } from "../../utils/parse";

const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: true },
    omit: { password: true },
  });
};

const updateUser = async (id: string, payload: Record<string, any>) => {
  const data = pick(payload, ["isActive", "role"]);

  if (data.role && !Object.values(UserRole).includes(data.role as UserRole)) {
    throw Object.assign(new Error("Invalid role"), { statusCode: 400 });
  }

  return prisma.user.update({
    where: { id },
    data,
    include: { profile: true },
    omit: { password: true },
  });
};

const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id } });
  return null;
};

const getCars = async () => {
  return prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      seller: { select: { id: true, email: true, profile: true } },
    },
  });
};

const updateCar = async (id: string, payload: Record<string, any>) => {
  const data = pick(payload, ["status"]);
  if (data.status && !Object.values(CarStatus).includes(data.status as CarStatus)) {
    throw Object.assign(new Error("Invalid car status"), { statusCode: 400 });
  }

  return prisma.car.update({
    where: { id },
    data,
    include: {
      images: true,
      seller: { select: { id: true, email: true, profile: true } },
    },
  });
};

const deleteCar = async (id: string) => {
  await prisma.car.delete({ where: { id } });
  return null;
};

const getOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      car: { include: { images: true } },
      customer: { select: { id: true, email: true, profile: true } },
      seller: { select: { id: true, email: true, profile: true } },
      payment: true,
    },
  });
};

const updateOrder = async (id: string, payload: Record<string, any>) => {
  const data = pick(payload, ["status"]);
  if (data.status && !Object.values(OrderStatus).includes(data.status as OrderStatus)) {
    throw Object.assign(new Error("Invalid order status"), { statusCode: 400 });
  }

  return prisma.order.update({
    where: { id },
    data,
    include: {
      car: true,
      customer: { select: { id: true, email: true } },
      seller: { select: { id: true, email: true } },
      payment: true,
    },
  });
};

const getPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: true,
    },
  });
};

const deleteReview = async (id: string) => {
  await prisma.review.delete({ where: { id } });
  return null;
};

export const adminService = {
  getUsers,
  updateUser,
  deleteUser,
  getCars,
  updateCar,
  deleteCar,
  getOrders,
  updateOrder,
  getPayments,
  deleteReview,
};

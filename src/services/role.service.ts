
import { PrismaClient, Role, Role_role } from '@prisma/client';
import { HttpException } from '../types/HttpException';

const prisma = new PrismaClient();

export const getAllRoles = async (): Promise<any[]> => {
  const roles = await prisma.role.findMany({
    include: {
      dashboard_user: {
        select: {
          email: true,
        },
      },
    },
  });

  return roles.map((role) => {
    const { dashboard_user, ...rest } = role;
    return {
      ...rest,
      user: {
        email: dashboard_user?.email,
      },
    };
  });
};

export const getRoleById = async (id: number): Promise<any | null> => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      dashboard_user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!role) {
    return null;
  }

  const { dashboard_user, ...rest } = role;

  return {
    ...rest,
    user: {
      email: dashboard_user?.email,
    },
  };
};

export const createRole = async (
  role: Role_role,
  userId: string,
  createdBy: string
): Promise<Role> => {
  const existingRole = await prisma.role.findFirst({
    where: { userId },
  });

  if (existingRole) {
    throw new HttpException(409, 'User already has a role');
  }

  return prisma.role.create({
    data: {
      role,
      userId,
      createdBy,
            updatedBy: createdBy,
      updatedAt: new Date(),
    },
  });
};

export const updateRole = async (
  id: number,
  role: Role_role,
  updatedBy: string
): Promise<Role> => {
  return prisma.role.update({
    where: { id },
    data: {
      role,
            updatedBy: updatedBy,
      updatedAt: new Date(),
    },
  });
};

export const deleteRole = async (id: number): Promise<Role> => {
  return prisma.role.delete({
    where: { id },
  });
};

import { db } from "../util/config/db";
import { generateId } from "../util/generateId";
import logger from "../util/logger";

export class RoleService {
  async createRole(role: { name: string }) {
    const roleExists = await db.role.findUnique({
      where: {
        name: role.name,
      },
    });
    if (roleExists) {
      throw new Error("Role already exists");
    }
    const newRole = await db.role.create({
      data: {
        name: role.name,
      },
    });
    return newRole;
  }

  async getRoles() {
    const roles = await db.role.findMany();
    return roles;
  }

  async getAllRoles() {
    const users = await db.dashboard_user.findMany({
      where: {
        Role: {
          isNot: null
        }
      },
      include: {
        Role: true,
      },
    });
    return users.map(user => ({
        id: user.Role?.id,
        userId: user.id,
        role: user.Role?.name,
        createdBy: user.createdBy,
        createdDate: user.createdAt,
        updatedBy: user.updatedBy,
        updatedAt: user.updatedAt,
    }));
  }

  async getRoleById(id: number) {
    const role = await db.role.findUnique({
      where: {
        id,
      },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  }

  async updateRole(id: number, name: string) {
    const role = await db.role.findUnique({
      where: {
        id,
      },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    const updatedRole = await db.role.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return updatedRole;
  }

  async updateUserRole(userId: string, role: string, updatedBy: string) {
    const user = await db.dashboard_user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const roleRecord = await db.role.findUnique({
      where: {
        name: role,
      },
    });

    if (!roleRecord) {
      throw new Error("Role not found");
    }

    const updatedUser = await db.dashboard_user.update({
      where: {
        id: userId,
      },
      data: {
        Role: {
          connect: {
            id: roleRecord.id,
          },
        },
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  }

  async deleteUserRole(userId: string) {
    const user = await db.dashboard_user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db.dashboard_user.update({
      where: {
        id: userId,
      },
      data: {
        Role: {
          disconnect: true,
        },
      },
    });
  }

  async deleteRole(id: number) {
    const role = await db.role.findUnique({
      where: {
        id,
      },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    await db.role.delete({
      where: {
        id,
      },
    });
  }
}
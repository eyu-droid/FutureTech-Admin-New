import { db } from "../util/config/db";
import { generateId } from "../util/generateId";
import logger from "../util/logger";

export class RoleService {
  async createRole(role: { name: string, createdBy:string | undefined}) {
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
        name: role.name.trim(),
        createdBy: role.createdBy,
      },
    });
    console.log(newRole, role.createdBy);
    return newRole;
  }

  async getRoles() {
    const roles = await db.role.findMany();
    return roles;
  }

  async getUsersWithoutRoles() {
    const users = await db.dashboard_user.findMany({
      where: {
        roleId: {
          notIn: null
        }
      },
      include: {
        Role: true,
      },
    });
    console.log(users)
    return users
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
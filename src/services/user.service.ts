import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "../types/user";
import { db } from "../util/config/db";
import { generateId } from "../util/generateId";
import logger from "../util/logger";
import { hashSync, genSaltSync } from "bcrypt";

export class UserService {
    constructor() { }

    async getUserById(userId: string): Promise<any> {
        if (!userId) {
            throw new Error("User id missing");
        }
        const user = await db.dashboard_user.findUnique({
            where: {
                id: userId
            },
            select: {
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
                isLocked: true,
                isNew: true
            }
        });
        if (!user) {
            throw new Error("user not found");
        }
        return user;
    }

    async getAllUsers(filter: string): Promise<User[]> {

        const users = await db.dashboard_user.findMany({
            where: {
                email: {
                    contains: filter
                }
            },
            include: {
                Role: true
            }
        });
        return users;
    }

    async getUserByEmail(email: string) {
        if (!email) {
            throw new Error("Email required");
        }
        const user = await db.dashboard_user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isLocked) {
            throw new Error("User is locked");
        }

        return user;


    }

    async createUser(user: User, creatorId: string): Promise<User> {
        const userExists = await db.dashboard_user.findUnique({
            where: {
                email: user.email
            }
        });
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = hashSync(user.password, genSaltSync(10));
        const newUser = await db.dashboard_user.create({
            data: {
                id: await generateId(),
                email: user.email,
                password: hashedPassword,
                isLocked: user.isLocked ? 1 : 0,
                isNew: 1,
                roleId: user.roleId,
                createdBy: creatorId
            }
        });
        return newUser;
    }

    async deleteUser(userId: string): Promise<User> {
        logger.info('Deleting user with id', userId);
        if (!userId) {
            throw new Error("User id is missing");
        }
        try {
            const deletedUser = await db.dashboard_user.delete({
                where: {
                    id: userId
                }
            });
            logger.info('User deleted successfully', deletedUser);
            return deletedUser;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                logger.error(e);
                throw new Error("Something went wrong. Please try again");
            }
            throw e;
        }
    }

    async editUser(userId: string, data: Partial<User>, editorId: string): Promise<User> {
        logger.info('Editing user with id', userId);
        if (!userId) {
            throw new Error("User id is missing")
        }
        try {
            const updateData: any = {};
            if (data.isLocked !== undefined) {
                updateData.isLocked = data.isLocked ? 1 : 0;
            }
            if (data.roleId !== undefined) {
                updateData.roleId = data.roleId;
            }

            updateData.updatedBy = editorId;
            updateData.updatedAt = new Date();

            const updatedUser = await db.dashboard_user.update({
                where: {
                    id: userId
                },
                data: updateData
            });
            logger.info('User edited successfully', updatedUser);
            return updatedUser;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                logger.error(e);
                throw new Error("Something went wrong. Please try again");
            }
            throw e;
        }
    }

}


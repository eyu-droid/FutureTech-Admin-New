import { dashboard_user } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import forgotEmailTemplate from "../mail/templates/forgotpassword";
import { User } from "../types/user";
import { db } from "../util/config/db";
import { generateId } from "../util/generateId";
import logger from "../util/logger";
import { JwtService } from "./jwt.service";
import { MailService } from "./mail.service";
import { genSalt, genSaltSync, hashSync } from "bcrypt";

export class UserService{
    private mailService;
    private jwtService;
    constructor(){
        this.mailService = new MailService()
        this.jwtService = new JwtService()
    }

    async getUserById(userId:string): Promise<any>{
        if(!userId){
            throw new Error("User id missing");
        }
        const user = await db.dashboard_user.findUnique({
            where:{
                id: userId
            },
            select:{
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
                isLocked: true,
                isNew: true,
                id: true
            }
        });
        if(!user){
            throw new Error("user not found");
        }
        return user;
    }

    async getAllUsers(filter: string): Promise<dashboard_user[]> {

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

    async getUserByEmail(email:string){
        if(!email){
            throw new Error("Email required");
        }
        const user = await db.dashboard_user.findUnique({
            where:{
                email: email
            }
        });
        if(!user){
            throw new Error("User not found");
        }
        if(user.isLocked){
            throw new Error("User is locked");
        }

        return user;


    }

                async createUser(user: User, createdBy: string): Promise<dashboard_user> {

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

                        createdBy: createdBy,

                        updatedBy: createdBy

                    }

                });

                return newUser;

            }

    async deleteUser(userId: string): Promise<dashboard_user> {
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

    async editUser(userId: string, data: User, updatedBy: string): Promise<dashboard_user> {
      logger.info('Editing user with id', userId);
      if (!userId) {
        throw new Error("User id is missing")
      }
      try {
          const updatedUser = await db.dashboard_user.update({
            where: {
              id: userId
            },
            data: {
              isLocked: data.isLocked ? 1 : 0,
              updatedBy: updatedBy
            }
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

    async sendResetEmail(email:string){
        try{
            const resetToken = this.jwtService.sign({userId: await generateId(), email}, 86400)
            const htmlContent = forgotEmailTemplate(email,`${process.env.FRONTEND_URL}/reset-password/${resetToken}`);
            await this.mailService.sendMail(email,"Forgot password", '',htmlContent);
            return 'success';
        }catch(error){
            return error;
        }
    }
    async verifyResetToken(token:string){
        if(!token){
            logger.error('token missing in verify reset');
            throw new Error('Token missing');
        }
        try{
            const verify =  this.jwtService.verify(token);
            return 'success';


        }catch(error){
            logger.error(error);
            return 'error';
        }
    }
    async tokenPayload(token:string){
        try{
            const payload = this.jwtService.verify(token);
            return payload;
        }catch(error){
            logger.error(error)
            return;
        }
    }
    async updatePasswordByEmail(email:string, password:string){
        if(!email)
        {
            throw new Error('Email Missing');
        }
        if(!password) throw new Error('Password Missing')
        const user = await this.getUserByEmail(email);
        if(!user) throw new Error('User not Found');

        const hashedPassword = hashSync(password, genSaltSync(10));
        user.password = hashedPassword;
        user.updatedAt = new Date();

        try{
            await db.dashboard_user.update({
                where:{
                    id: user.id,
                },
                data: user
            });
            return 'success';

        }catch(error){
            logger.error(error);
            return 'error';
        }

    }
}

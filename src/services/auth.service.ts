import { SignupDto } from "../types/signupdto";
import logger from "../util/logger";
import { JwtService } from "./jwt.service";
import { db } from "../util/config/db";
import type { dashboard_user } from "@prisma/client";
import { generateId } from "../util/generateId";
import {hashSync, compareSync, genSaltSync} from 'bcrypt'
import { AuthTokens } from "../types/authtokens";
import { LoginDto } from "../types/logindto";
import { Payload } from "../types/payload";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class AuthService{
    private jwtService: JwtService;
    constructor(){
        this.jwtService = new JwtService();
    }

    async signup(signupDto: SignupDto): Promise<AuthTokens>{
        logger.info('Started signup process for email:' + signupDto.email);
        if(!signupDto.email || !signupDto.password){
            logger.error('Email and password are required');
            throw new Error('Email and password are required');
        }
        const newUser: dashboard_user = {
            id: await generateId(),
            email: signupDto.email,
            password: hashSync(signupDto.password, genSaltSync(10)),
            createdAt: new Date(),
            updatedAt: new Date(),
            isLocked: 0,
                        isNew: 1,
            roleId: null
        }
        try{

            const userCreated = await db.dashboard_user.create({data: newUser});
            logger.info('New user created with email' + signupDto.email);
            const accessToken =  this.jwtService.sign({userId: userCreated.id, email: userCreated.email});
            const refreshToken =  this.jwtService.sign({userId: userCreated.id, email: userCreated.email});
            return {accessToken, refreshToken};

        }catch(err){
            if(err instanceof PrismaClientKnownRequestError){
                if(err.code === 'P2002'){
                    throw new Error('Email already exists');
                }
            }
            logger.error('Error creating user: '+ err +' with email: '+ signupDto.email);
            throw new Error('Error creating user');
        }

    }
    async login(loginDto: LoginDto): Promise<AuthTokens>{
        logger.info('Started login process for email:' + loginDto.email);

        if(!loginDto.email || !loginDto.password){
            logger.error('Email and password are required');
            throw new Error('Email and password are required');
        }
        try{
            const user = await db.dashboard_user.findUnique({
                where:{
                    email: loginDto.email,
                }
            });
            if(!user){
                logger.error('User not found with email: '+ loginDto.email);
                throw new Error('Invalid email or password');
            }
            if(user.isLocked){
                logger.error('User account is locked for email: '+ loginDto.email);
                throw new Error('User account is locked');
            }
            const passwordMatch = compareSync(loginDto.password, user.password);
            if(!passwordMatch){
                logger.error('Invalid password for email: '+ loginDto.email);
                throw new Error('Invalid email or password');
            }
            logger.info('user login with email ' + loginDto.email);
            const accessToken = this.jwtService.sign({userId: user.id, email: user.email});
            const refreshToken = this.jwtService.sign({userId: user.id, email: user.email});
            return {accessToken, refreshToken};

        } catch(err:any){
            if(err instanceof PrismaClientKnownRequestError || err instanceof PrismaClientInitializationError){
                logger.error('Error finding user: '+ err +' with email: '+ loginDto.email);
                throw new Error('Something went wrong. Please try again!');
            }

            throw new Error(err)
        }
    }

    async refreshToken(refreshToken: string): Promise<string>{
        try{
            const payload:Payload = this.jwtService.verify(refreshToken);
            const user = await db.dashboard_user.findUnique({
                where:{
                    id: payload.userId,
                }
            });
            if(user && !user.isLocked){
                return this.jwtService.sign({userId: user.id, email: user.email});
            }
            throw new Error('Unauthorize');

        }catch(err){
            logger.error('Error validating refresh token '+err);
            throw new Error('invalid token');
        }
    }
}

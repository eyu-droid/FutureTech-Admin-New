import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import logger from "../util/logger";

export class UserController {
    private userService;
    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response) {
        const { query } = req.query;

        const filter = query as string;
        const users = await this.userService.getAllUsers(filter);
        res.status(200).json({ message: 'fetched successful', data: users });
    }

    async createUser(req: Request, res: Response) {
        try {
            const newUser = await this.userService.createUser(req.body, req.user?.userId as string);
            res.status(201).json({ message: 'user created successfully', data: newUser });
        } catch (error) {
            logger.error(error);
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.editUser(id, req.body, req.user?.userId as string);
            res.status(200).json({ message: 'user updated successfully', data: updatedUser });
        } catch (error) {
            logger.error(error);
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        logger.info('Delete user request received', req.params.id);
        try {
            const { id } = req.params;
            const deletedUser = await this.userService.deleteUser(id);
            res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
        } catch (error) {
            logger.error(error);
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                logger.error('user data not found');
                res.status(401).json({ message: 'unauthorized' });
                return;
            }
            // const userData = await this.userService.getUserById(user.userId);
            // if(!userData){
            //     res.status(404).json({message: 'user not found'});
            //     return;
            // }
            res.status(200).json({ data: user, message: 'fetched Successfully' });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ message: 'something went wrong' });
        }
    }

}

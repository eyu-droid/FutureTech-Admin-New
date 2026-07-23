import { Request, Response, Router } from "express";
import { UserController } from "../../controllers/user.controller";
import AuthAPIKey from "../../middlewares/authAPIKey";
import AuthGuard from "../../middlewares/authGuard";

const userController = new UserController();

const userRoutes = Router();


userRoutes.get('/me', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.me(req, res));

userRoutes.get('/getAllUsers', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.getAllUsers(req, res));
userRoutes.post('/createUser', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.createUser(req, res));
userRoutes.delete('/delete/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.deleteUser(req, res));
userRoutes.patch('/update/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.editUser(req, res));

// userRoutes.get('/getAllUsers', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => userController.getAllUsers(req, res));


export default userRoutes;

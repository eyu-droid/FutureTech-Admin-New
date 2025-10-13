import { Request, Response, Router } from "express";
import { RoleController } from "../../controllers/role.controller";
import AuthAPIKey from "../../middlewares/authAPIKey";
import AuthGuard from "../../middlewares/authGuard";

const roleController = new RoleController();

const roleRoutes = Router();

roleRoutes.post('/create', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.createRole(req, res));
roleRoutes.get('/getAllRoles', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.getAllRoles(req, res));
roleRoutes.get('/getRoles', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.getRoles(req, res));
roleRoutes.put('/updateUserRole/:userId', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.updateUserRole(req, res));
roleRoutes.delete('/deleteUserRole/:userId', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.deleteUserRole(req, res));
roleRoutes.delete('/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.deleteRole(req, res));

export default roleRoutes;

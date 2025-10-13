
import { Request, Response, Router } from "express";
import { RoleController } from "../../controllers/role.controller";
import AuthAPIKey from "../../middlewares/authAPIKey";
import AuthGuard from "../../middlewares/authGuard";

const roleController = new RoleController();

const router = Router();

router.get('/getRoles', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.getRoles(req, res));
router.get('/', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.getAllRoles(req, res));
router.post('/', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.createRole(req, res));
router.get('/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.getRoleById(req, res));
router.put('/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.updateRole(req, res));
router.delete('/:id', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.deleteRole(req, res));
router.put('/updateUserRole/:userId', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.updateUserRole(req, res));
router.delete('/deleteUserRole/:userId', [AuthAPIKey, AuthGuard], (req: Request, res: Response) => roleController.deleteUserRole(req, res));

export default router;

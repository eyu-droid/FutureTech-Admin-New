
import { Router } from 'express';
import * as roleController from '../../controllers/role.controller';
import AuthAPIKey from '../../middlewares/authAPIKey';
import AuthGuard from '../../middlewares/authGuard';

const router = Router();

router.get('/', [AuthAPIKey, AuthGuard], roleController.getAllRoles);
router.get('/:id', [AuthAPIKey, AuthGuard], roleController.getRoleById);
router.post('/', [AuthAPIKey, AuthGuard], roleController.createRole);
router.put('/:id', [AuthAPIKey, AuthGuard], roleController.updateRole);
router.delete('/:id', [AuthAPIKey, AuthGuard], roleController.deleteRole);

export default router;

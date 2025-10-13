import { Request, Response } from "express";
import { RoleService } from "../services/role.service";
import logger from "../util/logger";

export class RoleController {
  private roleService;
  constructor() {
    this.roleService = new RoleService();
  }

  async createRole(req: Request, res: Response) {
    const role = {
      name: req.body.name,
      createdBy: req.user?.userId
    }
    try {
      const newRole = await this.roleService.createRole(role);
      res.status(201).json({ message: "role created successfully", data: newRole });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getRoles(req: Request, res: Response) {
    try {
      const roles = await this.roleService.getRoles();
      res.status(200).json({ message: "fetched successful", data: roles || [] });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getUsersWithoutRoles(req: Request, res: Response) {

    try {

      const roles = await this.roleService.getUsersWithoutRoles();

      res.status(200).json({ message: "fetched successful", data: roles });

    } catch (error) {

      logger.error(error);

      res.status(400).json({ message: (error as Error).message });

    }

  }

  async getRoleById(req: Request, res: Response) {

    try {

      const role = await this.roleService.getRoleById(parseInt(req.params.id, 10));

      res.status(200).json({ message: "fetched successful", data: role });

    } catch (error) {

      logger.error(error);

      res.status(400).json({ message: (error as Error).message });

    }

  }



  async updateRole(req: Request, res: Response) {

    try {

      const role = await this.roleService.updateRole(

        parseInt(req.params.id, 10),

        req.body.name

      );

      res.status(200).json({ message: "updated successful", data: role });

    } catch (error) {

      logger.error(error);

      res.status(400).json({ message: (error as Error).message });

    }

  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role, updatedBy } = req.body;
      const updatedRole = await this.roleService.updateUserRole(userId, role, updatedBy);
      res.status(200).json({ message: "user role updated successfully", data: updatedRole });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      await this.roleService.deleteUserRole(userId);
      res.status(200).json({ message: "user role deleted successfully" });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: (error as Error).message });
    }
  }


  async deleteRole(req: Request, res: Response) {

    try {

      await this.roleService.deleteRole(parseInt(req.params.id, 10));

      res.status(200).json({ message: "deleted successful" });

    } catch (error) {

      logger.error(error);

      res.status(400).json({ message: (error as Error).message });

    }

  }

}

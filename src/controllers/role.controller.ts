
import { Request, Response, NextFunction } from 'express';
import * as roleService from '../services/role.service';
import { HttpException } from '../types/HttpException';

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(Number(id));
    if (!role) {
      throw new HttpException(404, 'Role not found');
    }
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, userId, createdBy } = req.body;
        if (!role || !userId || !createdBy) {
      throw new HttpException(400, 'Missing required fields');
    }
    const newRole = await roleService.createRole(role, userId, createdBy);
    res.status(201).json(newRole);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role, updatedBy } = req.body;
    const updatedRole = await roleService.updateRole(Number(id), role, updatedBy);
    res.json(updatedRole);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

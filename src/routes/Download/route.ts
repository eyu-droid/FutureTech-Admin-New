import { Request, Response, Router } from "express";

const exportRoute = Router();

import { ExportController } from "../../controllers/export.controller";

const exportController = new ExportController();

exportRoute.get('/localcompanies', (req: Request, res: Response) => exportController.exportLocalCompanies(req, res));
exportRoute.get('/internationalcompanies', (req: Request, res: Response) => exportController.exportInternationalCompanies(req, res));
exportRoute.get('/ngo', (req: Request, res: Response) => exportController.exportngo(req, res));
exportRoute.get('/startup', (req: Request, res: Response) => exportController.exportstartup(req, res));
exportRoute.get('/embassiess', (req: Request, res: Response) => exportController.exportembassy(req, res));
exportRoute.get('/checkin', (req: Request, res: Response) => exportController.exportCheckin(req, res));




export default exportRoute;
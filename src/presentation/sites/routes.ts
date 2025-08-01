import { Router } from "express";

import { SiteService } from "../services/site.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { SiteController } from "./controller";

const router = Router();
const siteController = new SiteController(new SiteService());

// Solo protege el POST
router.post('/', AuthMiddleware.validateJwt, siteController.createSite);


router.get('/', siteController.getSites);

export default router;
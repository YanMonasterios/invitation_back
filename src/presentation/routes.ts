import { Router } from "express";
import { SiteController } from "./sites/controller";
import SitesRoutes from "./sites/routes";  
import InvitationsRoutes  from "./invitations/routes";  
import { AuthRoutes } from "./auth/routes";
import { SiteService } from "./services/site.service";

export class AppRoutes {

    static get routes(): Router {
        
        const router = Router();
        const siteService = new SiteService();
        const siteController = new SiteController(siteService);

        
        router.use('/api/allsites', SitesRoutes);

        router.use('/api/auth', AuthRoutes.routes); 

        router.use('/api/invitations', InvitationsRoutes); 
        
        return router;
    }
}
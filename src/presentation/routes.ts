import { Router } from "express";
import { TodosController } from "./sites/controller";
import { SitesRoutes } from "./sites/routes";

export class AppRoutes {

    static get routes(): Router {
        
        const router = Router();
        const SitesController = new TodosController();

        // middleware que se ejecutara al solicitar la ruta /api/allsites
        router.use('/api/allsites', SitesRoutes.routes);
        

        return router;

    }


}
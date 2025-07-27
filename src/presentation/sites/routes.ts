import { Router } from "express";
import { TodosController } from "./controller";




export class SitesRoutes {

    static get routes(): Router {
        
        const router = Router();
        const SitesController = new TodosController();

        router.get('/', SitesController.getSites);
        router.get('/:id', SitesController.getSiteById);

        
        router.post('/', SitesController.createSite);
        router.put('/:id', SitesController.updateSite );
        router.delete('/:id', SitesController.deleteSite );
        

        return router;

    }


}
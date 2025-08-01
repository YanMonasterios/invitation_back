import { Request, Response } from "express";
import { CustomError, CreateSiteDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";
import { SiteService } from "../services/site.service";

export class SiteController {

    constructor(
        private readonly siteService: SiteService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`Error: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    createSite = async (req: Request, res: Response) => {
        const user = req.body.user as UserEntity;
        const [error, siteDto] = CreateSiteDto.create(req.body);

        if (error || !siteDto) {
            return res.status(400).json({ error: error ?? 'Invalid payload' });
        }

        this.siteService.createSite(user.id, siteDto)
            .then(site => res.json(site))
            .catch(error => this.handleError(error, res));
    }


getSites = async (req: Request, res: Response) => {

    this.siteService.getSitesByUser()
     .then(sites => res.json(sites))
     .catch(error => this.handleError(error,res));

};

}
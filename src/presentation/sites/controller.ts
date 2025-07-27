import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { v4 as uuid } from 'uuid'; 


export class TodosController{

    constructor() {}

    // Method to get all todos
    // request tipo request, response tipo response
    public getSites = async(req:Request, res: Response) => {
        //  return res.json(todos)
        const sites = await prisma.site.findMany();
            return res.json(sites);
        
    }

        public getSiteById = async(req:Request, res: Response) => {
            const id = req.params.id; // ✅ Usar string directamente

            if (!id) {
                return res.status(400).json({error: 'ID is required'});
            }

            const site = await prisma.site.findFirst({
                where: { id }  
            });

            return (site) 
                ? res.json(site) 
                : res.status(404).json({error:`Site with id ${id} not found`});
        };

        // Post
        public createSite = async (req: Request, res: Response) => {
        const { name, address, ownerId, description } = req.body;

        if (!name || !address || !ownerId) {
            return res.status(400).json({ error: 'name, address, and ownerId are required' });
        }

        try {
            const newSite = await prisma.site.create({
            data: {
                id: uuid(), // genera un UUID automáticamente
                name,
                address,
                ownerId,
                description,
                updatedAt: new Date()
            }
            });

            return res.status(201).json(newSite);
            } catch (error: any) {
            console.error('Error al crear el sitio:', error);
            return res.status(500).json({ error: error.message || 'Failed to create site' });
            }
        };

public updateSite = async (req: Request, res: Response) => {
    const id = req.params.id; // ✅ UUID debe ser string

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    // Verifica si el sitio existe
    const existingSite = await prisma.site.findUnique({
        where: { id }
    });

    if (!existingSite) {
        return res.status(404).json({ error: `Site with id ${id} not found` });
    }

    const { name, address, description, ownerId } = req.body;

    // Validaciones opcionales: puedes exigir ciertos campos si lo deseas
    if (!name && !address && !description && !ownerId) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    try {
        const updatedSite = await prisma.site.update({
            where: { id },
            data: {
                name,
                address,
                description,
                ownerId,
                updatedAt: new Date() // actualiza la fecha
            }
        });

        return res.json(updatedSite);
    } catch (error: any) {
        console.error('Error updating site:', error);
        return res.status(500).json({ error: 'Failed to update site' });
    }
};

    public deleteSite = async (req: Request, res: Response) => {
        const id = req.params.id; 

        const site = await prisma.site.delete({
            where: { id }
        });
        
        // Verifica si el sitio existe
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        if (!site) {
            return res.status(404).json({ error: `Site with id ${id} not found` });
        }

        try {
            await prisma.site.delete({
                where: { id }
            });

            return res.status(204).send(); // No content
        } catch (error: any) {
            console.error('Error deleting site:', error);
            return res.status(500).json({ error: 'Failed to delete site' });
        }
    } 



}
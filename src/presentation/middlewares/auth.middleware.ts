import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { UserEntity } from "../../domain";

export class AuthMiddleware {

    static async validateJwt(req: Request,res:Response,next:NextFunction) {

        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({error: 'no token provided'});
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({error:'Invalid Bearer Token'});

        const token = authorization.split(' ')[1] || '';

        try {

            const payload = await JwtAdapter.validateToken<{id:string}>(token);
            if(!payload) return res.status(401).json({error: 'Invalid token'})
            
             const user = await prisma.user.findUnique({
                     where: { id: payload.id },
                });
            
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }

            req.body.user = UserEntity.fromObject(user);

            next();

        } catch (error) {

            console.log(error);
            res.status(500).json({error: 'Internal Server Error'})
        }




    }

}
import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { CustomError, LoginUserDto } from "../../domain";

export class AuthController {

    
    constructor(
        public readonly authService: AuthService
    ) {}

    private handleError = (error: unknown, res: Response) => {

        // si el error es una instancia de CustomError (error personalizado)
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`Error: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });


    }

    registerUser = (req: Request, res:Response ) => {

        const [error, registerDto] = RegisterUserDto.create(req.body);

        if(error) return res.status(400).json({error})


        this.authService.registerUser(registerDto!)
        .then((user) => res.json(user))
        .catch((error) => this.handleError(error, res));
        // res.json(registerDto);

    }



    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        
        if (error || !loginUserDto) {
            return res.status(400).json({ error: error ?? 'Invalid payload' });
        }
    
        this.authService.loginUser(loginUserDto)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    };



    // al usuario crearse y haya dado click al correo con su validacion me va a direccionar aqui
    validateEmail = (req: Request, res: Response) => {
    // recibo token
    const { token } = req.params;

     // res.json(token);
    this.authService.validateEmail(token)
        .then(() => {
        // Redirige al login del frontend con un query param
        return res.redirect(`${process.env.CLIENT_URL}/auth/login?validated=true`);
        
        // res.json('validate email');

        })
        .catch(() => {
        // redirige también al login pero indicando fallo
        return res.redirect(`${process.env.CLIENT_URL}/auth/login?validated=false`);
        });
    }
    
    

    
   
}
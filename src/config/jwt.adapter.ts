import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs';
// import dotenv from 'dotenv';
// dotenv.config();

const JWT_SEED = envs.JWT_SEED

const JWT_SECRET = process.env.JWT_SECRET || JWT_SEED;



export class JwtAdapter {
  static async generateToken(payload: string | object | Buffer, duration: string = '2h'): Promise<string | null> {
    const options = { expiresIn: duration } as SignOptions;

    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SECRET, options, (err, token) => {
        if (err || !token) return resolve(null);
        resolve(token);
      });
    });
  }

  static validateToken<T>(token:string): Promise<T|null> {

    return new Promise((resolve) => {

      jwt.verify(token, JWT_SEED, (err, decoded) =>{

        if(err) return resolve(null);

        resolve(decoded as T);

      })

    })

  }
}

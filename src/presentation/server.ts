import express, { Router } from 'express';
import path from 'path';
import cors from 'cors'; 

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares
    // va a extraer 
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    // CORS
    this.app.use(cors({
      origin: 'http://localhost:5173',  // URL frontend
      credentials: true,                 
    }));

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );


    //* Routes
    this.app.use( this.routes );

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

}
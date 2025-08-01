
// dependo de mi entitad propia 

import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public emailValidated: boolean,
    public name: string,
    public password: string,
    public sites: string[], 
    public createdAt: Date,
    public updatedAt: Date,
  ) {}


  static fromObject(object: {[key:string]:any} ) {

    const {id, email, emailValidated, name, password, sites, createdAt, updatedAt } = object;

    if (!name) throw CustomError.badRequest('Name is required');
    if (!email) throw CustomError.badRequest('Email is required');
    if (emailValidated === undefined) throw CustomError.badRequest('emailValidated is required');
    if (!password) throw CustomError.badRequest('password is required');

      return new UserEntity(
            id,
            email,
            emailValidated,
            name,
            password,
            Array.isArray(sites) ? sites : [], 
            new Date(createdAt),
            new Date(updatedAt)
     );

  }

}


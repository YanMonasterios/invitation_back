// data transfer object para user registration and validation

import { regularExps } from "../../../config";

export class RegisterUserDto {

    private constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly password: string,
     ){}

     static create(object: {[key:string]:any}): [string?, RegisterUserDto?] {

        const { email, name, password } = object;

        if (!name) return ['name is required'];
        if (!email) return ['email is required'];
        if (!regularExps.email.test(email) ) return ['email is not valid'];
        if (!password) return ['password is required'];

        return [undefined, new RegisterUserDto(email, name, password)];
     }

}
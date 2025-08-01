// data transfer object para user login and validation

import { regularExps } from "../../../config";

export class LoginUserDto {

    private constructor(
        public readonly email: string,
        public readonly password: string,
     ){}

      static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
      if (!object || typeof object !== 'object') {
         return ['Payload is missing or invalid'];
      }

      const { email, password } = object;

      if (!email) return ['email is required'];
      if (!regularExps.email.test(email)) return ['email is not valid'];
      if (!password) return ['password is required'];

      return [undefined, new LoginUserDto(email, password)];
      }
}
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';


export const bcryptAdapter = {
  // Hashear el password
  hash: (password: string): string => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  },

  compare: (password: string, hashed: string) => {

     return compareSync(password, hashed);

  }
};
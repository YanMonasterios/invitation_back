import 'dotenv/config';
import { get } from 'env-var';


// dependencias del proyecto .env 
export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
  POSTGRES_URL: get('POSTGRES_URL').default('public').asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  CLIENT_URL: get('CLIENT_URL').required().asString(),




}
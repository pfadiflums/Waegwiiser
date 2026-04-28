import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  version: '1.0.0-dev',
  oauth2RedirectUrl: 'http://localhost:4200/oauth2/redirect',
  midataAuthUrl: 'http://localhost:8080/oauth2/authorization/midata'
};

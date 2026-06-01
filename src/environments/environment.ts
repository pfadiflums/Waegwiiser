import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.pfadiflums.ch/api/v1',
  version: '1.0.0',
  oauth2RedirectUrl: 'https://pfadiflums.ch/auth/callback',
  midataAuthUrl: 'https://api.pfadiflums.ch/api/v1/oauth2/authorization/hitobito'
};

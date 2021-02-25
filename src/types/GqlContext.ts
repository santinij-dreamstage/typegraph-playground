import {Request} from "express";

export interface GqlContext {
  req: Request;
  user?: UserClaims;
}

export interface UserClaims {
  sub: string;  //uuid
  iss: string;
  aud: string,
  token_use: string;  //id or access
  auth_time: number;
  iat: number,
  exp: number,
  'cognito:username': string; //e.g. google_numbers for social or uuid matching sub
  name?: string;
  event_id?: string; //uuid
  email?: string;
  email_verifed?: boolean;
  phone_number?: string; //e.g. '+15551239876',
  phone_number_verified?: boolean;
  //custom properties
  'custom:Country'?: string;
  'custom:CountryDialCode'?: string;
  'custom:DisplayName'?: string;
  'custom:IsRegistered'?: string;
  'custom:MarketingEmailOpt'?: string;
  'custom:State'?: string;
  'custom:TimeZone'?: string;
  'custom:TransactionTextOpt'?: string;
}


import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export interface GqlContext {
  req: Request;
  prisma: PrismaClient;
  authorizer: UserPermission;
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

export interface IAuthorization {
  isWriteAuthorized(claims: UserClaims): boolean;
}

export class UserPermission implements IAuthorization {
  isWriteAuthorized(claims: UserClaims): boolean {
    const groups = claims['cognito:groups'];
    if (groups && groups.includes('admin')) {
      return true;
    }
    return false;
  }
}


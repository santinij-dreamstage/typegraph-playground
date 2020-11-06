import {ds_user as DbUser, PrismaClient} from "@prisma/client";
import { throwIfNotFound } from "./DatabaseRespository";

export class UserRepo {
    static async findOneByIdOrFail(prisma: PrismaClient, id: string): Promise<DbUser> {
        return throwIfNotFound(await this.findOneById(prisma, id));
    }

    static async findOneById(prisma: PrismaClient, id: string): Promise<DbUser|null> {
        return await prisma.ds_user.findOne({
            where: {
                id: id
            }
        })
    }
}

import { event_ticket_info as DbEventTicket, PrismaClient } from "@prisma/client";
import { throwIfNotFound } from "./EventRepo";

export class EventTicketInfoRepo {
    static async findOneByIdOrFail(prisma: PrismaClient, id: string): Promise<DbEventTicket> {
        return throwIfNotFound(await this.findOneById(prisma, id));
    }

    static async findOneById(prisma: PrismaClient, id: string): Promise<DbEventTicket | null> {
        return await prisma.event_ticket_info.findOne({
            where: {
                id: id
            }
        })
    }
}

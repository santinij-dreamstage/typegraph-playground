import { event as DbEvent, PrismaClient } from "@prisma/client";

export class EventRepo {
    static async findOneByIdOrFail(prisma: PrismaClient, id: string): Promise<DbEvent> {
        const user = await this.findOneById(prisma, id);
        return throwIfNotFound(user);
    }

    static async findOneById(prisma: PrismaClient, id: string): Promise<DbEvent | null> {
        return await prisma.event.findOne({
            where: {
                id: id
            }
        })
    }

    static async findEventFromEventTicketInfoId(prisma: PrismaClient, etiId: string): Promise<DbEvent> {
        const event = await prisma.event_ticket_info.findOne({
            where:
                { id: etiId }
        }).event();

        return throwIfNotFound(event);
    }
}

export function throwIfNotFound<T>(value: T | null | undefined): T {
    if (!value) {
        throw new Error("This must be something!");
    }
    return value;
}
import { registerEnumType } from "type-graphql";
import { Column, Entity, Index, OneToMany, ValueTransformer } from "typeorm";
import { Event } from "./Event";

@Index("event_status_pkey", ["eventStatusId"], { unique: true })
@Index("event_status_name_key", ["name"], { unique: true })
@Entity("event_status", { schema: "public" })
export class DbEventStatus {
  @Column("integer", { primary: true, name: "event_status_id" })
  eventStatusId: number;

  @Column("text", { name: "name", unique: true })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description?: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(() => Event, (event) => event.eventStatus)
  events: Event[];
}

export enum EventStatus {
  Draft = "Draft",
  Published = "Published",
  Started = "Started",
  Ended = "Ended",
  Completed = "Completed",
  Canceled = "Canceled",
}

registerEnumType(EventStatus, {
  name: "EventStatus",
})

export class EventStatusTransformer implements ValueTransformer {

  to(value: EventStatus): number {
    switch (value) {
      case EventStatus.Draft:
        return 1;
      case EventStatus.Published:
        return 2;
      case EventStatus.Started:
        return 3;
      case EventStatus.Ended:
        return 4;
      case EventStatus.Completed:
        return 5;
      case EventStatus.Canceled:
        return 6;
      default:
        throw new Error(`Unknown value for to EventStatus: ${value}`);
    }
  }

  from(value: number): EventStatus {
    switch (value) {
      case 1:
        return EventStatus.Draft;
      case 2:
        return EventStatus.Published;
      case 3:
        return EventStatus.Started;
      case 4:
        return EventStatus.Ended;
      case 5:
        return EventStatus.Completed;
      case 6:
        return EventStatus.Canceled;
      default:
        throw new Error(`Unknown value for from EventStatus: ${value}`);
    }
  }
}
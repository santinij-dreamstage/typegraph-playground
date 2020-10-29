import { Column, Entity, Index } from "typeorm";

@Index("notification_list_pkey", ["email"], { unique: true })
@Entity("notification_list", { schema: "public" })
export class NotificationList {
  @Column("text", { primary: true, name: "email" })
  email: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;
}

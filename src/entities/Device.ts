import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DsUser } from "./DsUser";

@Index("device_akey1", ["deviceIdentifier", "ownerId"], { unique: true })
@Index("device_pkey", ["id"], { unique: true })
@Entity("device", { schema: "public" })
export class Device {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "owner_id", unique: true })
  ownerId: string;

  @Column("uuid", { name: "device_identifier", nullable: true, unique: true })
  deviceIdentifier?: string;

  @Column("text", { name: "device_model", nullable: true })
  deviceModel?: string;

  @Column("text", { name: "auth_token", nullable: true })
  authToken?: string;

  @Column("timestamp with time zone", {
    name: "activated_at_utc",
    nullable: true,
  })
  activatedAtUtc?: Date;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Column("timestamp with time zone", {
    name: "last_updated_time_utc",
    default: () => "timezone('utc', now())",
  })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.devices)
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: DsUser;
}

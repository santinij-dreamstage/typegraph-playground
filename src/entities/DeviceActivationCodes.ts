import { Column, Entity, Index } from "typeorm";

@Index(
  "device_activation_codes_device_identifier_activation_codes_idx",
  ["activationCode", "deviceIdentifier"],
  {}
)
@Index("device_activation_codes_pkey", ["id"], { unique: true })
@Entity("device_activation_codes", { schema: "public" })
export class DeviceActivationCodes {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "device_identifier" })
  deviceIdentifier: string;

  @Column("text", { name: "activation_code" })
  activationCode: string;

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
}

import { Column, Entity, Index, OneToMany, ValueTransformer } from "typeorm";
import { registerEnumType } from "type-graphql";
import {  Event } from "./Event";

@Index("genre_pkey", ["id"], { unique: true })
@Index("genre_name_key", ["name"], { unique: true })
@Entity("genre", { schema: "public" })
export class DbGenre {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("text", { name: "name", unique: true })
  name: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(() => Event, (event) => event.genre)
  events: Event[];
}

export enum Genre {
  Classical = "Classical", //= 1,
  PopRock = "PopRock", //2,
  RAndBHipHop = "RAndBHipHop", //3,
  Latin = "Latin", //4,
  Country = "Country", //5,
  Jazz = "Jazz", //6,
  Other = "Other", //7,
}

registerEnumType(Genre, {
  name: "Genre",
})

export class GenreTransformer implements ValueTransformer {

  to(value: Genre): number {
    switch (value) {
      case Genre.Classical:
        return 1;
      case Genre.PopRock:
        return 2;
      case Genre.RAndBHipHop:
        return 3;
      case Genre.Latin:
        return 4;
      case Genre.Country:
        return 5;
      case Genre.Jazz:
        return 6;
      case Genre.Other:
        return 7;
      default:
        throw new Error(`Unknown value for genre: ${value}`);
    }
  }

  from(value: number): Genre {
    switch (value) {
      case 1:
        return Genre.Classical;
      case 2:
        return Genre.PopRock;
      case 3:
        return Genre.RAndBHipHop;
      case 4:
        return Genre.Latin;
      case 5:
        return Genre.Country;
      case 6:
        return Genre.Jazz;
      case 7:
        return Genre.Other
      default:
        throw new Error(`Unknown value for genre: ${value}`);
    }
  }
}

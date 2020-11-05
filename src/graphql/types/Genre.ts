import { registerEnumType } from "type-graphql";

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

export class GenreTransformer {

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

import { IsUrl } from "class-validator"
import { GraphQLURL } from "graphql-custom-types"
import { Field, Int, ObjectType , registerEnumType } from "type-graphql";

function parsePlaybackId(playbackId: string): [string, number?] {
    if (playbackId.includes('@')) {
        const parsed = playbackId.split('@');
        return [parsed[0], +parsed[1]]  //the time should be an integer 
    }
    else {
        return [playbackId, undefined];
    }
}

function buildStreamUrl(playbackId: string) {
    return `https://stream.mux.com/${playbackId}.m3u8`;
}

function buildThumbnailUrl(playbackId: string, thumbnailTime?: number) {
    const time = thumbnailTime || 35;  //was hardcoded in the front end previously
    return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`;
}


export function buildVideoStreams(playbackIds: string[], type: StreamType): VideoStream[] {
    const videos: VideoStream[] = [];
    for (const promo of playbackIds) {
        videos.push(new VideoStream(promo, type));
    }
    return videos;
}

@ObjectType()
export class VideoStream {
    /**
     playbackId may contain @int to represent a thumbnail time at the end currently
     */
    constructor(playbackId: string, streamType: StreamType) {
        const [playback, thumbnailTime] = parsePlaybackId(playbackId);

        this.thumbnailTime = thumbnailTime;
        this.playbackId = playback;
        this.streamType = streamType;
        this.thumbnailUrl = buildThumbnailUrl(playback, thumbnailTime)
        this.streamUrl = buildStreamUrl(playback)
    }

    @Field(() => Int, { nullable: true, deprecationReason: "Use thumbnailUrl property instead" })
    thumbnailTime?: number;

    @Field(() => String, { nullable: true, deprecationReason: "Do not build a video from the playbackId, instead use streamUrl which may be signed by jwt" })
    playbackId: string

    @Field(() => GraphQLURL)
    @IsUrl()
    streamUrl: string

    @Field(() => GraphQLURL)
    @IsUrl()
    thumbnailUrl: string

    @Field(() => String, {nullable: true})
    title?: string

    @Field(() => StreamType)
    streamType: StreamType

}

export enum StreamType {
    Primary = "Primary",
    Additional = "Additional",
    Promotional = "Promotional",
}

registerEnumType(StreamType, {
    name: "StreamType",
})

export class StreamTypeTransformer {

    to(value: StreamType): number {
        switch (value) {
            case StreamType.Primary:
                return 1;
            case StreamType.Additional:
                return 2;
            case StreamType.Promotional:
                return 3;
            default:
                throw new Error(`Unknown value for to StreamType: ${value}`);
        }
    }

    from(value: number): StreamType {
        switch (value) {
            case 1:
                return StreamType.Primary;
            case 2:
                return StreamType.Additional;
            case 3:
                return StreamType.Promotional;
            default:
                throw new Error(`Unknown value for from StreamType: ${value}`);
        }
    }
}
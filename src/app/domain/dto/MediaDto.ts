import MediaItem from "@/app/domain/dto/MediaItem";

type MediaDto = {
    id: number;
    name: string;
    altText?: string;
    title?: string;
    description?: string;
    downloadUrl?: string;
    mimeType?: string;
    size?: number;
    uploadDate?: string;
    uploadedBy?: string;
    uploadedTo?: string;
    dimensions?: string;
}

export const mediaDtoToMediaItem = (mediaDto: MediaDto): MediaItem => {
    return {
        ...mediaDto,
        uploadDate: new Date(Date.parse(mediaDto.uploadDate!))
    }
}

export default MediaDto;
type MediaItem = {
    id: number;
    name: string;
    altText?: string;
    title?: string;
    description?: string;
    downloadUrl?: string;
    mimeType?: string;
    size?: number;
    uploadDate?: Date;
    uploadedBy?: string;
    uploadedTo?: string;
    dimensions?: string;
}


export const mediaItemDiffered = (a: MediaItem, b: MediaItem): boolean => {
    console.log("OnMediaItemDiffered", a, b);
    return (a.name ?? '') !== (b.name ?? '') ||
        (a.altText ?? '') !== (b.altText ?? '') ||
        (a.title ?? '') !== (b.title ?? '') ||
        (a.description ?? '') !== (b.description ?? '')
};

export default MediaItem;
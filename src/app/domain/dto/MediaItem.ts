import {isNullUndefinedOrBlank} from "@/app/domain/utils/functions";


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
    const isChanged = (key: keyof MediaItem): boolean => {
        const valueA = a[key];
        const valueB = b[key];
        console.log("isChanged", key, String(valueA), String(valueB), isNullUndefinedOrBlank(valueA), isNullUndefinedOrBlank(valueB))

        if (valueA instanceof Date && valueB instanceof Date) {
            return valueA.getTime() !== valueB.getTime();
        }

        if (isNullUndefinedOrBlank(valueA) && isNullUndefinedOrBlank(valueB)) {
            console.log("Returning false")
            return false;
        }

        // General comparison for other types
        return valueA !== valueB;
    };

    return (
        isChanged("name") ||
        isChanged("altText") ||
        isChanged("title") ||
        isChanged("description") ||
        isChanged("downloadUrl") ||
        isChanged("mimeType") ||
        isChanged("size") ||
        isChanged("uploadDate") ||
        isChanged("uploadedBy") ||
        isChanged("uploadedTo") ||
        isChanged("dimensions")
    );
};

export default MediaItem;
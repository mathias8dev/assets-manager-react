import MediaItem from "@/app/domain/dto/MediaItem";

export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function isNullOrUndefined(value: unknown): boolean {
    return value === undefined || value === null;
}

export function isNullOrEmpty(value: string | undefined): boolean {
    return value === undefined || value === "";
}


export const isNullUndefinedOrBlank = (value: unknown): boolean => {
    return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
};


export const readableSize = (bytes: number): string => {
    const kbLimit = 1024
    const moLimit = 1024 * 1024
    const goLimit = 1024 * 1024 * 1024
    if (bytes > goLimit) return `${bytes / goLimit}Go`
    if (bytes > moLimit) return `${bytes / moLimit}Mo`
    if (bytes > kbLimit) return `${bytes / kbLimit}Kb`
    return `${bytes} Octets`
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date.valueOf());
    result.setDate(result.getDate() + days);
    return result;
}

export const getDistinctDatesByDay = (mediaList: MediaItem[]) => {
    const uniqueDates = new Set<string>();

    return mediaList
        .map(it => {
            const uploadDate = it.uploadDate!;
            const dateKey = uploadDate.toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)
            return {dateKey, label: uploadDate.toDateString(), value: uploadDate.getTime()};
        })
        .filter(({dateKey}) => {
            if (uniqueDates.has(dateKey)) {
                return false; // Skip if this date already exists
            }
            uniqueDates.add(dateKey);
            return true; // Include this date
        })
        .map(({label, value}) => ({label, value})); // Map back to the desired structure
};
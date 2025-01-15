import React, {useEffect, useState} from 'react';

interface MediaItem {
    id?: number;
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

interface MediaGridProps {
    inSelectionMode?: boolean;
    items: MediaItem[];
    selectedItemIds?: number[];
    onSelectedItemsIdsChanged?: (ids: number[]) => void;
    onItemClick?: (item: MediaItem, index: number) => void;
}


const renderMediaItem = (item: MediaItem) => {
    const isImage = item.mimeType?.startsWith('image/');
    const isVideo = item.mimeType?.startsWith('video/') || item.mimeType?.endsWith("x-matroska");
    const isPdf = item.mimeType?.startsWith('application/pdf');

    if (isImage) {
        return (
            <img
                src={item.downloadUrl}
                alt={item.altText || item.name}
                style={styles.image}
            />
        );
    }

    if (isVideo) {
        return (
            <video
                src={item.downloadUrl}
                controls
                style={styles.video}
            />
        );
    }
    return (
        <div style={styles.filePreview}>
            <span style={styles.fileName}>{item.name}</span>
        </div>
    )
}

const MediaGridComponent: React.FC<MediaGridProps> = ({inSelectionMode, items, selectedItemIds = [], onSelectedItemsIdsChanged, onItemClick}) => {

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const toggleSelection = (id: number) => {
        let updated: number[] = [];
        if (selectedItems.includes(id)) {
            updated = selectedItems.filter((item) => item !== id);
        } else {
            updated = [...selectedItems, id];
        }
        setSelectedItems(updated);
        onSelectedItemsIdsChanged?.(updated);
    };

    // Sync with external selectedItemIds changes
    useEffect(() => {
        const newSet = new Set(selectedItemIds);

        const areEqual = selectedItems.length === selectedItemIds.length &&
            selectedItems.every(id => newSet.has(id));

        if (!areEqual) {
            setSelectedItems(selectedItemIds);
        }
    }, [selectedItemIds]);

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {items.map((item, index) => (
                    <div
                        key={item.id || index}
                        style={{...styles.gridItem, position: "relative"}}
                        onClick={() => onItemClick?.(item, index)}
                    >
                        {renderMediaItem(item)}
                        <div style={styles.itemInfo}>
                            <div style={styles.itemTitle}>{item.title || item.name}</div>
                        </div>
                        {inSelectionMode && (
                            <div
                                onClick={() => toggleSelection(item.id!)}
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    zIndex: 1000,
                                    top: 0,
                                    left: 0,
                                    borderRadius: 8,
                                    border: selectedItems.includes(item.id!) ? "3px solid var(--rs-blue-500)" : "none",
                                    backgroundColor: "rgba(255, 255, 255, 0.42)",
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        width: '100%',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        width: '100%',
    },
    gridItem: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
    },
    image: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        backgroundColor: '#f5f5f5',
    },
    video: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        backgroundColor: '#f5f5f5',
    },
    filePreview: {
        width: '100%',
        height: '150px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
    },
    fileName: {
        fontSize: '14px',
        color: '#666666',
        textAlign: 'center',
        wordBreak: 'break-word',
    },
    itemInfo: {
        padding: '12px',
    },
    itemTitle: {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '4px',
        color: '#333333',
    },
    itemDescription: {
        fontSize: '12px',
        color: '#666666',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
} as const;

// Example usage
const mediaItems: MediaItem[] = [
    {
        id: 1,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) (Z-Library)",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "application/pdf",
        downloadUrl: "https://example.com/file1.pdf",
    },
    {
        id: 2,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) (Z-Library)",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "application/pdf",
        downloadUrl: "https://example.com/file1.pdf",
    },
    {
        id: 3,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) 3",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "application/pdf",
        downloadUrl: "https://example.com/file1.pdf",
    },
    {
        id: 4,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) 4",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "application/pdf",
        downloadUrl: "https://example.com/file1.pdf",
    },
    {
        id: 5,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) 4",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "application/pdf",
        downloadUrl: "https://example.com/file1.pdf",
    },
    {
        id: 6,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) 4",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "video/mp4",
        downloadUrl: "https://cdn.pixabay.com/video/2016/05/01/2946-164933125_tiny.mp4",
    },
    {
        id: 7,
        name: "La saga des calendriers ou Le frisson millénariste (Jean Lefort) 4",
        altText: "La-saga-des-calendriers-Jean-Lefort-Z-Library.pdf",
        uploadedBy: "mdiavocat",
        uploadDate: new Date("2025-01-08"),
        mimeType: "image/png",
        downloadUrl: "https://cdn.pixabay.com/photo/2023/02/08/06/33/fashion-7775827_1280.jpg",
    },
    // ... Add more items here
];

export const MediaGridDemo = () => <MediaGridComponent items={mediaItems}/>;


export default MediaGridComponent;
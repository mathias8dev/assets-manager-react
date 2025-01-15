import React, {useEffect, useState} from "react";
import MediaItem from "@/app/domain/dto/MediaItem";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import SelectComponent from "@/app/components/selectComponent/SelectComponent";


type MediaListProps = {
    style?: React.CSSProperties;
    items: MediaItem[];
    selectedItemIds?: number[];
    onSelectedItemsIdsChanged?: (ids: number[]) => void;
    onCopyUrlToClipboard?: (item: MediaItem) => void;
    onUpdate?: (item: MediaItem) => void;
    onDeleteDefinitely?: (ids: number[]) => void;
    onItemClick?: (item: MediaItem) => void;
    itemsPerPage?: number;
};

const MediaListComponent: React.FC<MediaListProps> = ({
                                                          onCopyUrlToClipboard,
                                                          onUpdate,
                                                          onDeleteDefinitely,
                                                          onItemClick,
                                                          items,
                                                          selectedItemIds = [],
                                                          onSelectedItemsIdsChanged,
                                                          itemsPerPage = 5,
                                                          style = {}
                                                      }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedOptionValue, setSelectedOptionValue] = useState<string>("0");

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const paginatedItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const toggleSelectAll = () => {
        let updated: number[] = [];
        if (selectedItems.length === paginatedItems.length) {
            updated = []
        } else {
            updated = paginatedItems.map((item) => item.id);
        }
        setSelectedItems(updated)
        onSelectedItemsIdsChanged?.(updated);
    };

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

    useEffect(() => {
        console.log("Selected option value:", selectedOptionValue);
    }, [selectedOptionValue]);

    return (
        <div style={{overflowX: "auto", ...style}}>
            <div style={{marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                    <SelectComponent
                        defaultValue={"0"}
                        onSelect={(value) => setSelectedOptionValue(value)}
                        options={[
                            {value: "0", label: "Actions groupées"},
                            {value: "1", label: "Supprimer définitivement"},
                        ]}/>

                    <button disabled={selectedItems.length === 0 || selectedOptionValue === "0"}
                            onClick={() => onDeleteDefinitely?.(selectedItems)}
                            style={{
                                marginLeft: "8px",
                                padding: "9px 16px",
                                borderRadius: 2,
                                color: selectedItems.length == 0 ? "#9c9a9a" : "#8a1200",
                                backgroundColor: selectedItems.length == 0 ? "#f4f4f4" : "#FFEDED"
                            }}>Appliquer
                    </button>
                </div>

                <div style={paginationStyle}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={paginationButtonStyle}
                    >
                        «
                    </button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                ...paginationButtonStyle,
                                fontWeight: currentPage === page ? "bold" : "normal",
                            }}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={paginationButtonStyle}
                    >
                        »
                    </button>
                </div>
            </div>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
                <thead>
                <tr>
                    <th style={headerStyle}>
                        <input
                            type="checkbox"
                            checked={selectedItems.length === paginatedItems.length}
                            onChange={toggleSelectAll}
                        />
                    </th>
                    <th style={headerStyle}>Fichier</th>
                    <th style={headerStyle}>Auteur/autrice</th>
                    <th style={headerStyle}>Téléversé sur</th>
                    <th style={headerStyle}>Date</th>
                </tr>
                </thead>
                <tbody>
                {paginatedItems.map((item, index) => (
                    <tr
                        key={index}
                        style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <td style={cellStyle}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelection(item.id)}
                            />
                        </td>
                        <td style={cellStyle}>
                            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                                    <div style={iconStyle(item.mimeType)}/>
                                    <div>
                                        <div style={{fontWeight: "bold"}}>
                                            <button
                                                onClick={() => onItemClick?.(item)}
                                                style={actionLinkStyle}
                                            >
                                                {item.name}
                                            </button>
                                        </div>
                                        {item.altText && (
                                            <div style={{color: "#6c757d"}}>{item.altText}</div>
                                        )}
                                    </div>
                                </div>
                                {hoveredItem === item.id && (
                                    <div style={actionsStyle}>
                                        <button
                                            onClick={() => onUpdate?.(item)}
                                            style={actionLinkStyle}>
                                            Modifier
                                        </button>
                                        <button onClick={() => onDeleteDefinitely?.([item.id])} style={{...actionLinkStyle, color: "#d12f1d"}}>
                                            Supprimer définitivement
                                        </button>
                                        <a style={{...actionLinkStyle}} rel="noopener noreferrer"
                                           href={ApiRoutes.getUrl(ApiRoutes.upload.view((item.uploadedTo || item.downloadUrl)!))} target={"_blank"}>
                                            Voir
                                        </a>
                                        <button onClick={() => onCopyUrlToClipboard?.(item)} style={actionLinkStyle}>
                                            Copier l'URL
                                        </button>
                                        <a href={item.downloadUrl} style={actionLinkStyle}>
                                            Télécharger le fichier
                                        </a>
                                    </div>
                                )}
                            </div>
                        </td>
                        <td style={cellStyle}>{item.uploadedBy || "—"}</td>
                        <td style={cellStyle}>
                            {item.uploadedTo ? (
                                <a href="#" style={linkStyle}>
                                    {item.uploadedTo}
                                </a>
                            ) : (
                                "Non attaché"
                            )}
                        </td>
                        <td style={cellStyle}>
                            {item.uploadDate
                                ? new Date(item.uploadDate).toLocaleDateString("fr-FR")
                                : "—"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

// Styles
const selectStyle: React.CSSProperties = {
    width: "auto",
    padding: "5px",
    borderRadius: "3px",
    border: '1px solid #e0e0e0',
}
const headerStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
};

const cellStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
};

const rowStyleEven: React.CSSProperties = {
    backgroundColor: "#f9f9f9",
};

const rowStyleOdd: React.CSSProperties = {
    backgroundColor: "#fff",
};

const linkStyle: React.CSSProperties = {
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer",
};

const actionLinkStyle: React.CSSProperties = {
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer",
    marginRight: "8px",
    backgroundColor: "unset",
    textAlign: "left"
};

const actionsStyle: React.CSSProperties = {
    marginTop: "8px",
    fontSize: "14px",
    display: "flex",
    gap: "2px",
};

const iconStyle = (mimeType?: string): React.CSSProperties => ({
    width: "32px",
    height: "32px",
    backgroundColor: mimeType?.startsWith("image/") ? "#d4edda" : "#d1ecf1",
    display: "inline-block",
    borderRadius: "4px",
});

const paginationStyle: React.CSSProperties = {
    textAlign: "center",
};

const paginationButtonStyle: React.CSSProperties = {
    margin: "0 4px",
    padding: "4px 8px",
    border: "1px solid #ddd",
    background: "#f8f9fa",
    cursor: "pointer",
    borderRadius: "4px",
};

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
    // ... Add more items here
];


export default MediaListComponent
// Types.ts
import useUpload from "@/app/domain/hooks/apiRequests/upload/useUpload";
// hooks/useMediaList.ts
import React, {useEffect, useState} from 'react';
import {Input, InputGroup, SelectPicker, Text} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import MediaItem from "@/app/domain/dto/MediaItem";


export interface AssetPickerProps {
    open?: boolean;
    title?: string;
    ctaLabel?: string;
    accept?: string;
    multiple?: boolean;
    mimeSelectionList?: { name: string; mimeType: string }[];
    onAssetsSelected?: (assets: MediaItem[]) => void;
    onClose?: () => void;
}

export const useMediaList = (initialMediaType: string) => {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [filteredMediaList, setFilteredMediaList] = useState<MediaItem[]>([]);
    const [selectedMediaType, setSelectedMediaType] = useState(initialMediaType);
    const [showErrors, setShowErrors] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const MediaRequests = useUpload();

    const handleMediaSearch = (keyword: string) => {
        const filtered = mediaList.filter((item) => item.name.includes(keyword));
        setFilteredMediaList(filtered);
    };

    const handleMediaTypeSelected = () => {
        if (!mediaList?.length) {
            setFilteredMediaList([]);
            return;
        }

        const filtered =
            selectedMediaType === "*/*"
                ? mediaList
                : mediaList.filter((item) => {
                    const [type, subtype] = selectedMediaType.split("/");
                    const [itemType, itemSubtype] = item.mimeType?.split("/") ?? "";
                    return type === itemType && (subtype === "*" || subtype === itemSubtype);
                });

        setFilteredMediaList(filtered);
    };

    const fetchMedia = async () => {
        setShowLoader(true);
        setShowErrors(false);
        try {
            const data = await MediaRequests.findAll();
            if (data) setMediaList(data);
        } catch (e) {
            console.error(e);
            setShowErrors(true);
        }
        setShowLoader(false);
    };

    useEffect(() => {
        handleMediaTypeSelected();
    }, [mediaList, selectedMediaType]);

    useEffect(() => {
        fetchMedia();
    }, []);

    return {
        mediaList,
        setMediaList,
        filteredMediaList,
        selectedMediaType,
        setSelectedMediaType,
        showErrors,
        showLoader,
        setShowLoader,
        handleMediaSearch,
        fetchMedia
    };
};

// components/MediaHeader.tsx
interface MediaHeaderProps {
    selectedMediaType: string;
    setSelectedMediaType: (type: string) => void;
    uploadDates: Array<{ label: string; value: number }>;
    selectedUploadDate: number;
    setSelectedUploadDate: (date: number) => void;
    onSearch: (keyword: string) => void;
    mimeSelectionList: { name: string; mimeType: string }[];
}


export const MediaHeader: React.FC<MediaHeaderProps> = ({
                                                            selectedMediaType,
                                                            setSelectedMediaType,
                                                            uploadDates,
                                                            selectedUploadDate,
                                                            setSelectedUploadDate,
                                                            onSearch,
                                                            mimeSelectionList
                                                        }) => (
    <div style={{padding: "16px 22px 0px", display: "flex", gap: 8, marginBottom: 16}}>
        <SelectPicker
            data={mimeSelectionList}
            labelKey="name"
            valueKey="mimeType"
            value={selectedMediaType}
            onSelect={(value) => setSelectedMediaType(String(value))}
            style={{width: 180}}
        />
        <SelectPicker
            data={uploadDates}
            value={selectedUploadDate}
            onSelect={(value) => setSelectedUploadDate(value)}
            style={{width: 180}}
        />
        <div style={{flexGrow: 1}}/>
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
            <Text>Rechercher des médias</Text>
            <InputGroup inside style={{width: 240}}>
                <Input onChange={(value) => onSearch(value)}/>
                <InputGroup.Button>
                    <SearchIcon/>
                </InputGroup.Button>
            </InputGroup>
        </div>
    </div>
);



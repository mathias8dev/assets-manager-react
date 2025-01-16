"use client";

import {Button, IconButton, Input, InputGroup, Loader, Message, SelectPicker, Text, Uploader, useToaster} from "rsuite";
import ListIcon from "@rsuite/icons/List";
import GridIcon from "@rsuite/icons/Grid";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";
import {useEffect, useMemo, useState} from "react";
import ActionConfirmationModal from "@/app/components/ActionConfirmationModal";
import MediaDetailsModal from "@/app/components/MediaDetailsModal";
import {createRipples} from "@/app/components/createRipples";
import MediaItemRenderer from "@/app/components/MediaItemRenderer";
import MediaItem from "@/app/domain/dto/MediaItem";
import useUpload from "@/app/domain/hooks/apiRequests/upload/useUpload";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import MediaDto, {mediaDtoToMediaItem} from "@/app/domain/dto/MediaDto";

const Ripples = createRipples({
    color: "rgba(0, 0, 0, 0.22)",
    during: 300,
});

enum ViewMode {
    LIST,
    GRID,
}


const AssetsManagerComponent = () => {
    const [selectedViewMode, setSelectedViewMode] = useState(ViewMode.GRID);
    const [selectedMediaType, setSelectedMediaType] = useState("*/*");
    const [selectedUploadDate, setSelectedUploadDate] = useState(-1);
    const [activateMultipleSelection, setActivateMultipleSelection] = useState(false);
    const [showAskConfirmDeleteModal, setShowAskConfirmDeleteModal] = useState(false);
    const [showMediaUploader, setShowMediaUploader] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [selectedMediaItemIndex, setSelectedMediaItemIndex] = useState<number | undefined>(undefined);
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [filteredMediaList, setFilteredMediaList] = useState<MediaItem[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<number[]>([]);

    const MediaRequests = useUpload()

    const toaster = useToaster()

    const supportedMedia = [
        {name: "Tous les médias", mimeType: "*/*"},
        {name: "Images", mimeType: "image/*"},
        {name: "Sons", mimeType: "audio/*"},
        {name: "Vidéos", mimeType: "video/*"},
        {name: "Documents", mimeType: "application/pdf"},
        {name: "Feuilles de calcul", mimeType: "application/vnd.ms-excel"},
        {name: "Archives", mimeType: "application/zip"},
        {name: "Textes", mimeType: "text/*"},
        {name: "Non attachés", mimeType: "none"},
        {name: "Les miens", mimeType: "personal"},
    ];

    const uploadDates = useMemo(() => {
        return filteredMediaList.map(it => {
            return {label: it.uploadDate!.toDateString(), value: it.uploadDate!.getTime()}
        })
    }, [filteredMediaList]);

    const handleDeleteMediaDefinitely = () => {
        setActivateMultipleSelection(false);
        setShowAskConfirmDeleteModal(true);
    };

    const handleMediaSelected = (index: number) => {
        setSelectedMedia((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };


    const handleConfirmDeleteMedia = async () => {
        setActivateMultipleSelection(false);
        setShowAskConfirmDeleteModal(false);
        await MediaRequests.deleteAllByIds({
            ids: [...selectedMedia],
            configParams: {
                throwOnError: () => false,
                onError: (e) => {
                    toaster.push(
                        <Message type={"error"}>
                            Une erreur est survenue.
                        </Message>,
                        {placement: "topCenter", duration: 5000}
                    )
                },
                onResponse: () => {
                    toaster.push(
                        <Message type={"success"} closable>
                            Opération éffectuée avec succès.
                        </Message>,
                        {placement: "topCenter", duration: 5000}
                    )
                    setSelectedMedia([])
                    setMediaList((prev) => prev.filter((item, _) => !selectedMedia.includes(item.id!)));
                }
            }
        })
    };

    const handleMediaSearch = async (keyword: string) => {
        const filtered = mediaList.filter((item) => item.name.includes(keyword));
        setFilteredMediaList(filtered);
    };

    const handleMediaTypeSelected = async (mimeType: string) => {
        if (!mediaList || mediaList.length === 0) {
            console.warn("Media list is empty or undefined.");
            setFilteredMediaList([]);
            return;
        }

        const filtered =
            mimeType === "*/*"
                ? mediaList
                : mediaList.filter((item) => {
                    const [type, subtype] = mimeType.split("/");
                    const [itemType, itemSubtype] = item.mimeType?.split("/") ?? "";

                    return (
                        type === itemType &&
                        (subtype === "*" || subtype === itemSubtype)
                    );
                });

        setFilteredMediaList(filtered);
        setSelectedMediaType(mimeType);
    };


    const fetchMedia = async () => {
        setShowLoader(true)
        try {
            const data = await MediaRequests.findAll()
            if (data) {
                console.log("The data is ", data)
                setMediaList(data)
            }
        } catch (e) {
            console.error(e)

        }

        setShowLoader(false)
    }

    useEffect(() => {
        if (uploadDates.length > 0) {
            setSelectedUploadDate(uploadDates[0].value);
        }
    }, [uploadDates]);

    useEffect(() => {
        setFilteredMediaList(mediaList);
    }, [mediaList]);

    useEffect(() => {
        fetchMedia()
    }, []);

    return (
        <div style={{padding: 16}}>
            <div style={{display: "flex", gap: 16, alignItems: "center"}}>
                <h3>Médiathèque</h3>
                <Button appearance="ghost" onClick={() => setShowMediaUploader(!showMediaUploader)}>
                    Ajouter un fichier média
                </Button>
            </div>

            {/* Uploader */}
            {showMediaUploader && (
                <div style={{marginTop: 32, position: "relative"}}>
                    <>
                        <Uploader
                            draggable
                            data={{uploadedBy: "mathias8dev"}}
                            action={ApiRoutes.getUrl(ApiRoutes.upload.uploadFile())}
                            onSuccess={(response: MediaDto) => {
                                setMediaList((prev) => [...prev, mediaDtoToMediaItem(response)])
                            }}>
                            <div style={{
                                height: 206,
                                display: 'flex',
                                flexDirection: "column",
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}>
                                <h5 style={{fontWeight: "normal"}}>Déposez vos fichiers pour les téléverser</h5>
                                <p>ou</p>
                                <Button appearance={"ghost"} style={{padding: "8px 32px"}}>Sélectionnez des fichiers</Button>
                                <p style={{marginTop: 16}}>Taille de fichier maximale pour le téléversement: 500 Mo</p>
                            </div>
                        </Uploader>
                        <IconButton
                            circle
                            icon={<CloseIcon/>}
                            onClick={() => setShowMediaUploader(false)}
                            style={{position: "absolute", right: 16, top: 16}}/>
                    </>
                </div>
            )}

            {/* Controls */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    border: "1px solid var(--rs-gray-400)",
                    borderRadius: 4,
                    padding: 8,
                    marginTop: 32
                }}
            >
                {!activateMultipleSelection && (
                    <>
                        {/* View Mode Switch */}
                        <div style={{display: "flex", gap: 8}}>
                            <IconButton
                                appearance={selectedViewMode === ViewMode.LIST ? "primary" : "default"}
                                onClick={() => setSelectedViewMode(ViewMode.LIST)}
                                icon={<ListIcon/>}
                            />
                            <IconButton
                                appearance={selectedViewMode === ViewMode.GRID ? "primary" : "default"}
                                onClick={() => setSelectedViewMode(ViewMode.GRID)}
                                icon={<GridIcon/>}
                            />
                        </div>

                        {/* Filters */}
                        <div style={{marginLeft: 32, display: "flex", gap: 8}}>
                            <SelectPicker
                                data={supportedMedia}
                                labelKey="name"
                                valueKey="mimeType"
                                value={selectedMediaType}
                                onSelect={(value) => handleMediaTypeSelected(String(value))}
                                style={{width: 180}}
                            />
                            <SelectPicker
                                data={uploadDates}
                                value={selectedUploadDate}
                                onSelect={(value) => setSelectedUploadDate(value)}
                                style={{width: 180}}
                            />
                            <Button onClick={() => setActivateMultipleSelection(!activateMultipleSelection)}>
                                Sélection groupée
                            </Button>
                        </div>

                        {/* Search */}
                        <div style={{flexGrow: 1}}/>
                        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                            <Text>Rechercher des médias</Text>
                            <InputGroup inside style={{width: 240}}>
                                <Input onChange={(it) => handleMediaSearch(it)}/>
                                <InputGroup.Button>
                                    <SearchIcon/>
                                </InputGroup.Button>
                            </InputGroup>
                        </div>
                    </>
                )}

                {/* Group Selection Controls */}
                {activateMultipleSelection && (
                    <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                        <Button
                            appearance="primary"
                            onClick={handleDeleteMediaDefinitely}
                            disabled={selectedMedia.length === 0}
                        >
                            Supprimer définitevement
                        </Button>
                        <Button onClick={() => setActivateMultipleSelection(false)}>Annuler</Button>
                    </div>
                )}
            </div>

            {/* Media Grid */}
            <div
                style={{
                    marginTop: 16,
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fit, ${filteredMediaList.length > 4 ? "minmax(260px, 1fr)" : "minmax(260px, 300px)"})`,
                    gap: 8,
                }}
            >
                {filteredMediaList.map((item, i) => (
                    <Ripples key={item.id ?? i}>
                        <div style={{position: "relative", cursor: "pointer",}}>
                            <MediaItemRenderer
                                item={item}
                                showDetails
                                onClick={() => setSelectedMediaItemIndex(i)}
                                style={{maxHeight: 222}}
                            />
                            {activateMultipleSelection && (
                                <div
                                    onClick={() => handleMediaSelected(item.id!)}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        zIndex: 1000,
                                        top: 0,
                                        left: 0,
                                        borderRadius: 5,
                                        border: selectedMedia.includes(item.id!) ? "3px solid var(--rs-blue-500)" : "none",
                                        backgroundColor: "rgba(255, 255, 255, 0.42)",
                                    }}
                                />
                            )}
                        </div>
                    </Ripples>
                ))}
            </div>

            {/* Footer */}
            <Text style={{marginTop: 15, fontSize: 12, textAlign: "center"}}>
                Affichage de {filteredMediaList.length} médias sur {mediaList.length}
            </Text>

            {/* Modals */}
            <MediaDetailsModal
                mediaItem={filteredMediaList[selectedMediaItemIndex || 0]}
                open={selectedMediaItemIndex !== undefined}
                onDeleteMediaItem={(mediaItem: MediaItem) => {
                    setSelectedMediaItemIndex(undefined)
                    setSelectedMedia((prev) => [...prev, mediaItem.id!])
                    handleDeleteMediaDefinitely()
                }}
                disablePreviousButton={selectedMediaItemIndex === 0}
                disableNextButton={selectedMediaItemIndex === filteredMediaList.length - 1}
                onPreviousMediaItem={() => setSelectedMediaItemIndex((prev) => prev! - 1 >= 0 ? prev! - 1 : prev)}
                onNextMediaItem={() => setSelectedMediaItemIndex((prev) => prev! + 1 < filteredMediaList.length ? prev! + 1 : prev)}
                onClose={() => setSelectedMediaItemIndex(undefined)}
            />
            <ActionConfirmationModal
                isOpen={showAskConfirmDeleteModal}
                onClose={() => setShowAskConfirmDeleteModal(false)}
                title="Supprimer définitivement ces médias ?"
                descriptionIntro="Pour confirmer la suppression, saisissez"
                ctaLabel="Supprimer"
                onConfirm={handleConfirmDeleteMedia}
            />

            {showLoader &&
                <Loader inverse backdrop content={"Chargement..."} vertical style={{zIndex: 1000}}/>}
        </div>
    );
};

export default AssetsManagerComponent;

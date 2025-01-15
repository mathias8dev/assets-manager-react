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
import MediaItem from "@/app/domain/dto/MediaItem";
import useUpload from "@/app/domain/hooks/apiRequests/upload/useUpload";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import MediaDto, {mediaDtoToMediaItem} from "@/app/domain/dto/MediaDto";
import MediaGridComponent from "@/app/components/MediaGridComponent";
import MediaListComponent from "@/app/components/MediaListComponent";

const Ripples = createRipples({
    color: "rgba(0, 0, 0, 0.22)",
    during: 300,
});

enum ViewMode {
    LIST,
    GRID,
}


const AssetsManagerComponent2 = () => {
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

    const [mediaToDeleteIds, setMediaToDeleteIds] = useState<number[]>([]);

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

    const handleDeleteMediaDefinitely = (ids = selectedMedia) => {
        setMediaToDeleteIds([...ids])
        setActivateMultipleSelection(false);
        setShowAskConfirmDeleteModal(true);
    };


    const handleConfirmDeleteMedia = async () => {
        setActivateMultipleSelection(false);
        setShowAskConfirmDeleteModal(false);
        await MediaRequests.deleteAllByIds({
            ids: [...mediaToDeleteIds],
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
                    setSelectedMedia((prev) => prev.filter((item, _) => !mediaToDeleteIds.includes(item)));
                    setMediaList((prev) => prev.filter((item, _) => !mediaToDeleteIds.includes(item.id!)));
                    setMediaToDeleteIds([])
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

    const handleCopyUrlToClipboard = (mediaItem: MediaItem) => {
        mediaItem.downloadUrl && navigator.clipboard.writeText(mediaItem.downloadUrl)
        toaster.push(
            <Message type={"success"} closable>
                L'URL du média a été copiée avec succès.
            </Message>,
            {placement: "topCenter", duration: 5000}
        )
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
                            {selectedViewMode === ViewMode.GRID && (
                                <Button onClick={() => setActivateMultipleSelection(!activateMultipleSelection)}>
                                    Sélection groupée
                                </Button>
                            )}
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
                            onClick={() => handleDeleteMediaDefinitely()}
                            disabled={selectedMedia.length === 0}
                        >
                            Supprimer définitevement
                        </Button>
                        <Button onClick={() => setActivateMultipleSelection(false)}>Annuler</Button>
                    </div>
                )}
            </div>

            {/* Media List */}
            {selectedViewMode === ViewMode.LIST && (
                <MediaListComponent style={{marginTop: 16}}
                                    items={filteredMediaList}
                                    selectedItemIds={selectedMedia}
                                    onSelectedItemsIdsChanged={setSelectedMedia}
                                    onCopyUrlToClipboard={handleCopyUrlToClipboard}
                                    onDeleteDefinitely={handleDeleteMediaDefinitely}
                                    onItemClick={(mediaItem) => {
                                        setSelectedMediaItemIndex(mediaList.findIndex(it => it.id === mediaItem.id))
                                    }}/>
            )}

            {/* Media Grid */}
            {selectedViewMode === ViewMode.GRID && (
                <MediaGridComponent inSelectionMode={activateMultipleSelection}
                                    items={filteredMediaList}
                                    selectedItemIds={selectedMedia}
                                    onSelectedItemsIdsChanged={setSelectedMedia}
                                    onItemClick={(mediaItem, _) => {
                                        if (!activateMultipleSelection) {
                                            setSelectedMediaItemIndex(mediaList.findIndex(it => it.id === mediaItem.id))
                                        }
                                    }}/>
            )}

            {/* Footer */}
            <Text style={{marginTop: 15, fontSize: 12, textAlign: "center"}}>
                Affichage de {filteredMediaList.length} médias sur {mediaList.length}
            </Text>

            {/* Modals */}
            <MediaDetailsModal
                mediaItem={mediaList[selectedMediaItemIndex || 0]}
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

export default AssetsManagerComponent2;

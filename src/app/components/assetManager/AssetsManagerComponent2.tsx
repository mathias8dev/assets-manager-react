"use client";

import {Button, IconButton, Input, InputGroup, Loader, Message, SelectPicker, Text, Uploader, useToaster} from "rsuite";
import ListIcon from "@rsuite/icons/List";
import GridIcon from "@rsuite/icons/Grid";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";
import {useEffect, useMemo, useState} from "react";
import ActionConfirmationModal from "@/app/components/ActionConfirmationModal";
import MediaDetailsModal from "@/app/components/MediaDetailsModal";
import MediaItem from "@/app/domain/dto/MediaItem";
import useUpload from "@/app/domain/hooks/apiRequests/upload/useUpload";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import MediaDto, {mediaDtoToMediaItem} from "@/app/domain/dto/MediaDto";
import MediaGridComponent from "@/app/components/MediaGridComponent";
import MediaListComponent from "@/app/components/MediaListComponent";
import {getDistinctDatesByDay} from "@/app/domain/utils/functions";
import ErrorComponent from "@/app/components/ErrorComponent";
import {useMediaList} from "@/app/components/assetPicker/components";
import UpdateMediaRequestDto from "@/app/domain/dto/UpdateMediaRequestDto";


enum ViewMode {
    LIST,
    GRID,
}

export enum MimeType {
    All = "*/*",
    Images = "image/*",
    Audio = "audio/*",
    Videos = "video/*",
    Documents = "application/pdf",
    Spreadsheets = "application/vnd.ms-excel",
    Archives = "application/zip",
    Text = "text/*",
    None = "none",
    Personal = "personal",
}

export const supportedMedia = [
    {name: "Tous les médias", mimeType: MimeType.All},
    {name: "Images", mimeType: MimeType.Images},
    {name: "Sons", mimeType: MimeType.Audio},
    {name: "Vidéos", mimeType: MimeType.Videos},
    {name: "Documents", mimeType: MimeType.Documents},
    {name: "Feuilles de calcul", mimeType: MimeType.Spreadsheets},
    {name: "Archives", mimeType: MimeType.Archives},
    {name: "Textes", mimeType: MimeType.Text},
    {name: "Non attachés", mimeType: MimeType.None},
    {name: "Les miens", mimeType: MimeType.Personal},
];

const AssetsManagerComponent2 = () => {
    const [selectedViewMode, setSelectedViewMode] = useState(ViewMode.GRID);
    const [selectedUploadDate, setSelectedUploadDate] = useState(-1);
    const [activateMultipleSelection, setActivateMultipleSelection] = useState(false);
    const [showAskConfirmDeleteModal, setShowAskConfirmDeleteModal] = useState(false);
    const [showMediaUploader, setShowMediaUploader] = useState(false);
    const [selectedMediaItemIndex, setSelectedMediaItemIndex] = useState<number | undefined>(undefined);
    const [selectedMedia, setSelectedMedia] = useState<number[]>([]);

    const {
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
    } = useMediaList(supportedMedia[0].mimeType);

    const [mediaToDeleteIds, setMediaToDeleteIds] = useState<number[]>([]);

    const MediaRequests = useUpload()

    const toaster = useToaster()

    const uploadDates = useMemo(() => {
        return getDistinctDatesByDay(filteredMediaList)
    }, [filteredMediaList]);

    const handleDeleteMediaDefinitely = (ids = selectedMedia) => {
        setMediaToDeleteIds([...ids])
        setActivateMultipleSelection(false);
        setShowAskConfirmDeleteModal(true);
    };


    const handleConfirmDeleteMedia = async () => {
        setShowLoader(true)
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


    const handleCopyUrlToClipboard = (mediaItem: MediaItem) => {
        console.log("Handle copy url to clipboard", mediaItem.downloadUrl)
        mediaItem.downloadUrl && navigator.clipboard.writeText(mediaItem.downloadUrl)
        console.log("Handle copy url to clipboard2", mediaItem.downloadUrl)
        toaster.push(
            <Message type={"success"} closable>
                L'URL du média a été copiée avec succès.
            </Message>,
            {placement: "topCenter", duration: 5000}
        )
    }

    const handleUpdateMediaItem = async (dto: UpdateMediaRequestDto) => {
        setShowLoader(true)
        let index = selectedMediaItemIndex!
        setSelectedMediaItemIndex(undefined)
        await MediaRequests.updateMedia({
            data: dto,
            configParams: {
                throwOnError: () => false,
                onError: (e) => {
                    console.log("An error occurred on update media item", e)
                    toaster.push(
                        <Message type={"error"} closable>
                            Une erreur est survenue en modifiant les métadonnées.
                        </Message>,
                        {placement: "topCenter", duration: 5000}
                    )
                },
                onTransform: (data) => mediaDtoToMediaItem(data),
                onResponse: (updatedMediaItem: MediaItem) => {
                    setMediaList((prev) => {
                        prev[index] = updatedMediaItem
                        return prev
                    })
                    toaster.push(
                        <Message type={"success"} closable>
                            Les métadonnées du média ont été mises à jour avec succès.
                        </Message>,
                        {placement: "topCenter", duration: 5000}
                    )
                }
            }
        })
        setSelectedMediaItemIndex(index)
        setShowLoader(false)
    }

    useEffect(() => {
        if (uploadDates.length > 0) {
            setSelectedUploadDate(uploadDates[0].value);
        }
    }, [uploadDates]);


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
                                onSelect={(value) => setSelectedMediaType(String(value))}
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
            {showErrors && (
                <ErrorComponent onReload={fetchMedia}/>
            )}

            {!showErrors && (
                <>
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
                </>
            )}


            {/* Modals */}
            <MediaDetailsModal
                mediaItem={mediaList[selectedMediaItemIndex || 0]}
                open={selectedMediaItemIndex !== undefined}
                onDeleteMediaItem={(mediaItem: MediaItem) => {
                    setSelectedMediaItemIndex(undefined)
                    setSelectedMedia((prev) => [...prev, mediaItem.id!])
                    handleDeleteMediaDefinitely([mediaItem.id!])
                }}
                onCopyUrlToClipboard={handleCopyUrlToClipboard}
                onSaveMetadataChanges={handleUpdateMediaItem}
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

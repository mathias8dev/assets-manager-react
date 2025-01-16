import * as React from "react"
import {useEffect} from "react"
import {Button, Divider, IconButton, Input, Text} from "rsuite";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import CloseIcon from "@rsuite/icons/Close";
import MediaItem, {mediaItemDiffered} from "@/app/domain/dto/MediaItem";
import MetadataField from "@/app/components/MetadataField";
import {readableSize} from "@/app/domain/utils/functions";
import Textarea from "@/app/components/Textarea";
import MediaItemRenderer from "@/app/components/MediaItemRenderer";
import UpdateMediaRequestDto from "@/app/domain/dto/UpdateMediaRequestDto";


export type MediaDetailsModalProps = {
    mediaItem: MediaItem;
    open?: boolean;
    disablePreviousButton?: boolean;
    disableNextButton?: boolean;
    onDeleteMediaItem?: (mediaItem: MediaItem) => void;
    onCopyUrlToClipboard?: (mediaItem: MediaItem) => void;
    onSaveMetadataChanges?: (updatedData: UpdateMediaRequestDto) => void;
    onNextMediaItem?: () => void;
    onPreviousMediaItem?: () => void
    onClose?: () => void;
}

const MediaDetailsModal: React.FC<MediaDetailsModalProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 onDeleteMediaItem,
                                                                 onNextMediaItem,
                                                                 onPreviousMediaItem,
                                                                 disablePreviousButton,
                                                                 disableNextButton,
                                                                 onCopyUrlToClipboard,
                                                                 onSaveMetadataChanges,
                                                                 mediaItem
                                                             }) => {

    const [updatedMetadata, setUpdatedMetadata] = React.useState<MediaItem>(mediaItem)
    const [metadataChanged, setMetadataChanged] = React.useState(false)

    const onUpdateMetadata = (key: keyof MediaItem, value: string | number | undefined) => {
        console.log("onUpdate mediaItem", key, value)
        if (updatedMetadata) {
            setUpdatedMetadata({
                ...updatedMetadata,
                [key]: value
            })
        }
    }

    useEffect(() => {
        console.log("The mediaItem is ", mediaItem)
        setUpdatedMetadata(mediaItem)
    }, [mediaItem]);


    useEffect(() => {
        setMetadataChanged(mediaItemDiffered(mediaItem ?? {}, updatedMetadata ?? {}))
    }, [updatedMetadata])

    const handleSaveMetadataChanges = () => {
        onSaveMetadataChanges?.({
            id: mediaItem.id,
            name: updatedMetadata.name ?? mediaItem.name,
            altText: updatedMetadata.altText,
            title: updatedMetadata.title,
            description: updatedMetadata.description
        })
    }


    return (
        <>
            {open == true && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 5,
                        height: "100vh",
                        width: "100vw",
                        backgroundColor: "rgba(0, 0, 0, 0.42)",
                    }}>
                    <div
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            backgroundColor: "white",
                            width: "calc(100vw - 64px)",
                            height: "calc(100vh - 64px)",
                            margin: 32,
                            boxShadow: "0 0 10px rgba(0, 0, 0, 21)",
                            borderRadius: 8,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}>

                        {/*TitleBar*/}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "white",
                            padding: 16,
                            zIndex: 5,
                            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.21)"
                        }}>
                            <Text size={"xxl"} weight={"semibold"}>Détails du fichier joint</Text>
                            <div style={{flex: 1, display: "flex", justifyContent: "flex-end", gap: 8}}>
                                <IconButton disabled={disablePreviousButton} appearance={"default"} circle icon={<ArrowLeftLineIcon/>}
                                            onClick={onPreviousMediaItem}/>
                                <IconButton disabled={disableNextButton} appearance={"default"} circle icon={<ArrowRightLineIcon/>}
                                            onClick={onNextMediaItem}/>
                                <IconButton
                                    appearance={"primary"}
                                    circle
                                    icon={<CloseIcon/>}
                                    onClick={onClose}
                                />
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexGrow: 1,
                            flexShrink: 0,
                            height: "200px",
                            flexWrap: "wrap",
                            overflow: "hidden"
                        }}>
                            <main
                                style={{
                                    flex: 1,
                                    margin: 16,
                                    height: "96%",
                                    overflow: "auto",
                                }}>
                                <MediaItemRenderer item={mediaItem} renderIfPdf={true} style={{height: "100%"}}/>
                            </main>
                            <aside
                                style={{
                                    flexGrow: 0,
                                    flexShrink: 0,
                                    width: "500px",
                                    height: "96%",
                                    borderRadius: 8,
                                    border: "1px solid var(--rs-gray-200)",
                                    margin: 16,
                                    padding: 16,
                                    overflow: "auto"
                                }}
                            >
                                <>
                                    {mediaItem.name && (
                                        <MetadataField label="Nom du fichier" value={mediaItem.name}/>
                                    )}
                                    {mediaItem.mimeType && (
                                        <MetadataField label="Type de fichier" value={mediaItem.mimeType}/>
                                    )}
                                    {mediaItem.size && (
                                        <MetadataField label="Taille du fichier" value={readableSize(mediaItem.size)}/>
                                    )}
                                    {mediaItem.uploadDate && (
                                        <MetadataField
                                            label="Téléversé le"
                                            value={new Date(mediaItem.uploadDate)?.toDateString()}
                                        />
                                    )}
                                    {mediaItem.uploadedBy && (
                                        <MetadataField
                                            label="Téléversé par"
                                            value={mediaItem.uploadedBy}/>
                                    )}
                                    {mediaItem.uploadedTo && (
                                        <MetadataField
                                            label="Téléversé vers"
                                            value={mediaItem.uploadedTo}/>
                                    )}
                                    {mediaItem.dimensions && (
                                        <MetadataField
                                            label="Dimensions"
                                            value={mediaItem.dimensions}/>
                                    )}
                                    {(mediaItem.name || mediaItem.mimeType || mediaItem.uploadedTo || mediaItem.uploadedBy || mediaItem.uploadDate || mediaItem.size || mediaItem.dimensions) && (
                                        <Divider/>
                                    )}
                                    <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                                        <div style={{display: "flex", gap: 32}}>
                                            <Text size={"sm"}
                                                  style={{textAlign: "right", flexShrink: 0, width: "24%", color: "var(--rs-gray-700)"}}>
                                                Texte alternatif
                                            </Text>
                                            <div style={{flexGrow: 1}}>
                                                <Textarea style={{height: 100}}
                                                          value={updatedMetadata.altText}
                                                          onChange={(it: string) => onUpdateMetadata("altText", it)}/>
                                                <Text size={"sm"} style={{marginTop: 5}}>{"Laissez vide si l'image est purement décorative"}</Text>
                                            </div>
                                        </div>

                                        <div style={{display: "flex", gap: 32}}>
                                            <Text size={"sm"} style={{textAlign: "right", flexShrink: 0, width: "24%", color: "var(--rs-gray-700)"}}>
                                                Titre
                                            </Text>
                                            <Input value={updatedMetadata.altText}
                                                   onChange={(it: string) => onUpdateMetadata("title", it)}/>
                                        </div>

                                        <div style={{display: "flex", gap: 32}}>
                                            <Text size={"sm"} style={{textAlign: "right", flexShrink: 0, width: "24%", color: "var(--rs-gray-700)"}}>
                                                Description
                                            </Text>
                                            <Textarea style={{height: 100}}
                                                      value={updatedMetadata.description}
                                                      onChange={(it: string) => onUpdateMetadata("description", it)}/>
                                        </div>

                                        <div style={{display: "flex", gap: 32}}>
                                            <Text size={"sm"} style={{textAlign: "right", flexShrink: 0, width: "24%", color: "var(--rs-gray-700)"}}>
                                                URL du fichier
                                            </Text>
                                            <div style={{flexGrow: 1}}>
                                                <Input disabled value={mediaItem.downloadUrl ?? ""}/>
                                                <Button style={{fontSize: 10, padding: "2px 8px", marginTop: 8}}
                                                        appearance={"ghost"}
                                                        onClick={() => onCopyUrlToClipboard?.(mediaItem)}>
                                                    Copier l'URL dans le presse-papier
                                                </Button>
                                            </div>
                                        </div>

                                        <div style={{display: "flex", gap: 32}}>
                                            <div style={{flexShrink: 0, width: "24%"}}></div>
                                            <div style={{flexGrow: 1}}>
                                                <Button
                                                    style={{fontSize: 12, padding: "2px 8px", marginTop: 8}}
                                                    appearance={"primary"}
                                                    disabled={!metadataChanged}
                                                    onClick={handleSaveMetadataChanges}
                                                >
                                                    Enregistrer les modifications
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider/>
                                    <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                                        <Button
                                            appearance={"link"}
                                            style={{padding: 0, fontSize: 13}}
                                            onClick={() => window.open(mediaItem.downloadUrl, "_blank")}>
                                            Télécharger
                                        </Button>
                                        <Divider vertical style={{backgroundColor: "var(--rs-gray-500)"}}/>
                                        <Button
                                            appearance={"link"}
                                            color={"red"}
                                            style={{padding: 0, fontSize: 13}}
                                            onClick={() => onDeleteMediaItem?.(mediaItem)}
                                        >
                                            Supprimer définitivement
                                        </Button>
                                    </div>
                                </>

                            </aside>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MediaDetailsModal
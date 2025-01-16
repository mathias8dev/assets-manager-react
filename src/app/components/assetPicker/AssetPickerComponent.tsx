import {Button, Divider, IconButton, Input, Loader, Text, Uploader, useToaster} from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import MediaItem from "@/app/domain/dto/MediaItem";
import Tabs from "@/app/components/tabs/TabsComponent";
import DefaultButton from "@/app/components/button/DefaultButton";
import MediaGridComponent from "@/app/components/MediaGridComponent";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import MediaDto, {mediaDtoToMediaItem} from "@/app/domain/dto/MediaDto";
import {getDistinctDatesByDay, readableSize} from "@/app/domain/utils/functions";
import MetadataField from "@/app/components/MetadataField";
import Textarea from "@/app/components/Textarea";
import {MimeType} from "@/app/components/assetManager/AssetsManagerComponent2";
import ErrorComponent from "@/app/components/ErrorComponent";
import {MediaHeader, useMediaList} from "@/app/components/assetPicker/components";


export type AssetPickerProps = {
    open?: boolean;
    title?: string;
    ctaLabel?: string;
    accept?: string;
    multiple?: boolean;
    mimeSelectionList?: { name: string, mimeType: string }[];
    onAssetsSelected?: (assets: MediaItem[]) => void;
    onClose?: () => void;
}

const AssetPickerComponent: React.FC<AssetPickerProps> = ({
                                                              open = true,
                                                              multiple = false,
                                                              title = "Sélectionner un média",
                                                              accept = "image/*",
                                                              mimeSelectionList = [{name: "Images", mimeType: MimeType.Images}],
                                                              ctaLabel = "Sélectionner ce média",
                                                              onAssetsSelected,
                                                              onClose
                                                          }) => {

    const {
        mediaList,
        setMediaList,
        filteredMediaList,
        selectedMediaType,
        setSelectedMediaType,
        showErrors,
        showLoader,
        handleMediaSearch,
        fetchMedia
    } = useMediaList(accept ?? mimeSelectionList[0].mimeType);
    const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
    const [selectedUploadDate, setSelectedUploadDate] = useState(-1);

    const uploadDates = useMemo(() => getDistinctDatesByDay(filteredMediaList), [filteredMediaList]);

    useEffect(() => {
        if (uploadDates.length > 0) {
            setSelectedUploadDate(uploadDates[0].value);
        }
    }, [uploadDates]);

    const toaster = useToaster()


    useEffect(() => {
        if (uploadDates.length > 0) {
            setSelectedUploadDate(uploadDates[0].value);
        }
    }, [uploadDates]);


    return (
        <>
            {open && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 1,
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


                        <div style={{
                            paddingTop: "16px",
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0 16px"
                            }}>
                                <Text size={"xxl"} weight={"semibold"} style={{lineHeight: 1}}>{title}</Text>
                                <div style={{flex: 1, display: "flex", justifyContent: "flex-end", gap: 8}}>
                                    <IconButton
                                        appearance={"default"}
                                        circle
                                        icon={<CloseIcon/>}
                                        onClick={onClose}
                                    />
                                </div>
                            </div>

                            <div style={{position: "relative", flexGrow: 1, margin: "0 8px"}}>
                                <Tabs defaultActiveKey={"select"} appearance={"default"}>
                                    <Tabs.Tab eventKey={"upload"} title={"Téléverser"}>
                                        <div style={{
                                            position: "absolute",
                                            width: "100%",
                                            padding: 16,
                                            overflow: "auto",
                                            height: "calc(100% - 47px)",
                                        }}>
                                            <Uploader
                                                draggable
                                                multiple={multiple}
                                                accept={accept}
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
                                                    <DefaultButton variant={"secondary"} size={"small"} style={{padding: "8px 32px"}}>Sélectionnez
                                                        des
                                                        fichiers</DefaultButton>
                                                    <p style={{marginTop: 16}}>Taille de fichier maximale pour le téléversement: 500 Mo</p>
                                                </div>
                                            </Uploader>
                                        </div>
                                    </Tabs.Tab>
                                    <Tabs.Tab eventKey={"select"} title={"Médiathèque"}>
                                        <div style={{
                                            position: "absolute",
                                            width: "100%",
                                            display: "flex",
                                            height: "calc(100% - 47px)",
                                            flexWrap: "wrap",
                                            overflow: "hidden"
                                        }}>
                                            <main style={{
                                                backgroundColor: "white",
                                                flex: 1,
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column"
                                            }}>
                                                <MediaHeader
                                                    selectedMediaType={selectedMediaType}
                                                    setSelectedMediaType={setSelectedMediaType}
                                                    uploadDates={uploadDates}
                                                    selectedUploadDate={selectedUploadDate}
                                                    setSelectedUploadDate={setSelectedUploadDate}
                                                    onSearch={handleMediaSearch}
                                                    mimeSelectionList={mimeSelectionList}/>
                                                {showErrors && (
                                                    <ErrorComponent onReload={fetchMedia}/>
                                                )}
                                                {!showErrors && (
                                                    <div style={{overflow: "auto",}}>
                                                        <MediaGridComponent
                                                            inSelectionMode={true}
                                                            multipleSelection={false}
                                                            items={filteredMediaList}
                                                            selectedItemIds={selectedMedia}
                                                            onSelectedItemsIdsChanged={setSelectedMedia}
                                                        />
                                                    </div>
                                                )}
                                            </main>

                                            <aside style={{width: 400, height: "100%", flexShrink: 0, backgroundColor: "#faf9f9", overflow: "auto"}}>
                                                <div>
                                                    {selectedMedia.length > 0 && (
                                                        <div style={{
                                                            padding: 16,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: 8
                                                        }}>
                                                            <Text size={"lg"} weight={"semibold"}>Détails du média</Text>
                                                            {mediaList.filter(it => selectedMedia.includes(it.id)).map((mediaItem) => (
                                                                <div key={mediaItem.id}>
                                                                    <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                                        {mediaItem.name && (
                                                                            <MetadataField label="Nom du fichier" value={mediaItem.name}/>
                                                                        )}
                                                                        {mediaItem.mimeType && (
                                                                            <MetadataField label="Type de fichier" value={mediaItem.mimeType}/>
                                                                        )}
                                                                        {mediaItem.size && (
                                                                            <MetadataField label="Taille du fichier"
                                                                                           value={readableSize(mediaItem.size)}/>
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
                                                                    </div>
                                                                    <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                                                                        <div style={{display: "flex", gap: 32}}>
                                                                            <Text size={"sm"} style={{
                                                                                textAlign: "right",
                                                                                flexShrink: 0,
                                                                                width: "24%",
                                                                                color: "var(--rs-gray-700)"
                                                                            }}>
                                                                                Texte alternatif
                                                                            </Text>
                                                                            <div style={{flexGrow: 1}}>
                                                                                <Textarea style={{height: 100}} disabled/>
                                                                                <Text size={"sm"}
                                                                                      style={{marginTop: 5}}>{"Laissez vide si l'image est purement décorative"}</Text>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{display: "flex", gap: 32}}>
                                                                            <Text size={"sm"} style={{
                                                                                textAlign: "right",
                                                                                flexShrink: 0,
                                                                                width: "24%",
                                                                                color: "var(--rs-gray-700)"
                                                                            }}>
                                                                                Titre
                                                                            </Text>
                                                                            <Input disabled/>
                                                                        </div>

                                                                        <div style={{display: "flex", gap: 32}}>
                                                                            <Text size={"sm"} style={{
                                                                                textAlign: "right",
                                                                                flexShrink: 0,
                                                                                width: "24%",
                                                                                color: "var(--rs-gray-700)"
                                                                            }}>
                                                                                Description
                                                                            </Text>
                                                                            <Textarea style={{height: 100}} disabled/>
                                                                        </div>

                                                                        <div style={{display: "flex", gap: 32}}>
                                                                            <Text size={"sm"} style={{
                                                                                textAlign: "right",
                                                                                flexShrink: 0,
                                                                                width: "24%",
                                                                                color: "var(--rs-gray-700)"
                                                                            }}>
                                                                                URL du fichier
                                                                            </Text>
                                                                            <div style={{flexGrow: 1}}>
                                                                                <Input disabled value={mediaItem.downloadUrl ?? ""}/>
                                                                                <Button style={{fontSize: 10, padding: "2px 8px", marginTop: 8}}
                                                                                        appearance={"ghost"}>
                                                                                    Copier l'URL dans le presse-papier
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </aside>
                                        </div>
                                    </Tabs.Tab>
                                </Tabs>
                            </div>

                        </div>


                        <div style={{
                            borderTop: "1px solid #cacaca",
                            flexShrink: 0,
                            padding: 12,
                            display: "flex",
                            justifyContent: "flex-end",
                            margin: "0 8px"
                        }}>
                            <Button appearance={"primary"} disabled={selectedMedia.length === 0}
                                    onClick={() => {
                                        onAssetsSelected?.(mediaList.filter(it => selectedMedia.includes(it.id)))
                                    }}>
                                {ctaLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showLoader &&
                <Loader inverse backdrop content={"Chargement..."} vertical style={{zIndex: 1000}}/>}
        </>
    )
}


export default AssetPickerComponent;
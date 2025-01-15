import MediaItem from "@/app/domain/dto/MediaItem";
import * as React from "react";
import FileTextIcon from "@rsuite/icons/Page";

export type MediaItemRendererProps = {
    item: MediaItem;
    showDetails?: boolean;
    renderIfPdf?: boolean;
    [key: string]: any;
}

const MediaItemRenderer: React.FC<MediaItemRendererProps> = ({item, showDetails = false, renderIfPdf = false, ...props}) => {
    const isImage = item.mimeType?.startsWith('image/');
    const isVideo = item.mimeType?.startsWith('video/') || item.mimeType?.endsWith("x-matroska");
    const isPdf = item.mimeType?.startsWith('application/pdf');


    const renderMediaContent = () => {
        if (isImage) {
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    paddingTop: "56.25%",
                    background: '#f5f5f5',
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: "relative"
                }}>
                    <img
                        src={item.downloadUrl || '/api/placeholder/400/300'}
                        alt={item.altText || item.name}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            );
        }

        if (isVideo) {
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    paddingTop: "56.25%",
                    background: '#f5f5f5',
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: "relative"
                }}>
                    <video
                        controls
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }}
                        title={item.title || item.name}
                    >
                        <source src={item.downloadUrl}/>
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }
        if (isPdf && renderIfPdf) {
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: "100%",
                    paddingTop: "56.25%",
                    background: '#f5f5f5',
                    borderRadius: 5,
                    overflow: 'hidden'
                }}>
                    <iframe
                        src={item.downloadUrl}
                        title={item.title || item.name}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </div>
            )
        }

        return (
            <div style={{
                width: '100%',
                height: "100%",
                paddingTop: "56.25%",
                background: '#f5f5f5',
                borderRadius: 5,
                position: "relative"
            }}>
                <FileTextIcon style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: 'translate(-50%, -50%)',
                    width: 64,
                    height: 64,
                    color: '#999'
                }}/>

                {showDetails && (
                    <div style={{
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
                        left: 0,
                        background: "var(--rs-blue-100)",
                        padding: 8,
                        paddingBottom: 8,
                        textAlign: "center",
                        fontWeight: 520,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        wordBreak: "break-word",
                    }}> {item?.name}</div>
                )}
            </div>
        );
    };

    return <div {...props}>{renderMediaContent()}</div>
}

export default MediaItemRenderer
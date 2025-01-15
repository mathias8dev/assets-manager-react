import * as React from 'react';

import MediaItem from "@/app/domain/dto/MediaItem";
import {Stack} from "rsuite"
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import FileTextIcon from '@rsuite/icons/Page';
import ImageIcon from '@rsuite/icons/Image';
import PlayVideoIcon from '@rsuite/icons/PlayOutline';
import {readableSize} from "@/app/domain/utils/functions";
import MediaItemRenderer from "@/app/components/MediaItemRenderer";

type MediaItemProps = {
    item: MediaItem;
    className?: string;
};


const MediaItemComponent = ({item,}: MediaItemProps) => {
    const isImage = item.mimeType?.startsWith('image/');
    const isVideo = item.mimeType?.startsWith('video/');


    return (
        <div style={{
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.21)",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8
            }}>
                {isImage && <ImageIcon/>}
                {isVideo && <PlayVideoIcon/>}
                {!isImage && !isVideo && <FileTextIcon/>}
                <h3 style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {item.name}
                </h3>
            </div>

            <div style={{margin: '16px 0'}}>
                <MediaItemRenderer item={item} renderIfPdf={true}/>

                {item.description && (
                    <p style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: '#666'
                    }}>
                        {item.description}
                    </p>
                )}
            </div>

            <Stack justifyContent="space-between" style={{
                padding: '12px 0',
                borderTop: '1px solid #e5e5e5',
                fontSize: 14,
                color: '#666'
            }}>
                <Stack spacing={16}>
                    {item.uploadDate && (
                        <span>{item.uploadDate.toLocaleDateString()}</span>
                    )}
                    {item.size && (
                        <span>{readableSize(item.size)}</span>
                    )}
                    {item.dimensions && (
                        <span>{item.dimensions}</span>
                    )}
                </Stack>

                {item.downloadUrl && (
                    <a
                        href={item.downloadUrl}
                        download
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: '#3498ff',
                            textDecoration: 'none'
                        }}
                    >
                        <FileDownloadIcon/>
                        Download
                    </a>
                )}
            </Stack>
        </div>
    );
};

export default MediaItemComponent;
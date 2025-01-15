import Utils from "@/app/domain/utils/Utils";
import FetchParams from "@/app/domain/http/client/FetchParams";
import ApiRoutes from "@/app/domain/http/ApiRoutes";
import {makeHttpRequest} from "@/app/domain/http/client/client";
import FetchConfigParams from "@/app/domain/http/client/FetchConfigParams";
import UpdateMediaRequestDto from "@/app/domain/dto/UpdateMediaRequestDto";
import MediaDto, {mediaDtoToMediaItem} from "@/app/domain/dto/MediaDto";

export type UploadFileRequestParams = {
    uploadedBy: string
    name?: string,
    title?: string,
    description?: string,
    altText?: string,
    file: File,
    configParams?: FetchConfigParams
}

export type FindAllRequestParams = {
    configParams?: FetchConfigParams
}

export type DeleteAllByIdsRequestParams = {
    ids: number[],
    configParams?: FetchConfigParams
}

export type UpdateMediaRequestParams = {
    data: UpdateMediaRequestDto,
    configParams?: FetchConfigParams
}

const useUpload = () => {

    const uploadFile = async (params: UploadFileRequestParams) => {

        const formData = new FormData()
        formData.append('file', Utils.newJSONBlob(params.file))
        formData.append('uploadedBy', Utils.newJSONBlob(params.uploadedBy))
        formData.append('name', Utils.newJSONBlob(params.name))
        formData.append('title', Utils.newJSONBlob(params.title))
        formData.append('description', Utils.newJSONBlob(params.description))
        formData.append('altText', Utils.newJSONBlob(params.altText))

        const fetchParams: FetchParams = {
            url: ApiRoutes.upload.uploadFile(),
            method: 'POST',
            payload: formData
        }

        const response = await makeHttpRequest<MediaDto>({fetchParams, configParams: params.configParams ?? {}})
        return response && mediaDtoToMediaItem(response)
    }

    const findAll = async (params?: FindAllRequestParams) => {
        const fetchParams: FetchParams = {
            url: ApiRoutes.upload.findAll(),
            method: 'GET'
        }
        const data = await makeHttpRequest<MediaDto[]>({fetchParams, configParams: params?.configParams ?? {}})
        return data?.map(mediaDtoToMediaItem)
    }

    const deleteAllByIds = (params: DeleteAllByIdsRequestParams) => {
        const {ids, configParams = {}} = params
        const fetchParams: FetchParams = {
            url: ApiRoutes.upload.deleteFilesByIds(),
            method: 'POST',
            payload: ids
        }
        return makeHttpRequest<void>({fetchParams, configParams})
    }

    const updateMedia = async (params: UpdateMediaRequestParams) => {
        const {data, configParams = {}} = params
        const fetchParams: FetchParams = {
            url: ApiRoutes.upload.updateMedia(),
            method: 'POST',
            payload: data
        }
        const response = await makeHttpRequest<MediaDto>({fetchParams, configParams})
        return response && mediaDtoToMediaItem(response)
    }

    return {
        uploadFile,
        findAll,
        updateMedia,
        deleteAllByIds
    }
}

export default useUpload
import axios, {AxiosResponse} from "axios";
import FetchParams from "@/app/domain/http/client/FetchParams";
import HttpRequestParams from "@/app/domain/http/client/HttpRequestParams";
import FetchConfigParams from "@/app/domain/http/client/FetchConfigParams";
import ApiError from "@/app/domain/http/client/ApiError";

const fetcher = async ({url, method, payload, params, headers}: FetchParams) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    let response: AxiosResponse;
    console.log("The endpoint is ", endpoint);
    console.log("The headers is", headers);
    try {
        response = await axios.request({
            method: method ?? "get",
            url: endpoint,
            data: payload,
            params: params,
            headers: headers || {}
        });
    } catch (e: any) {
        console.log("Fetcher: The error is ", e)
        if (e.response) {
            const error = new ApiError(
                "Une erreur est survenue en effectuant la reqûete"
            );
            error.info = e.response.data;
            error.status = e.response.status;
            error.response = e.response
            error.headers = e.headers
            throw error;
        }
        throw e
    }


    return response.data;
};


export const makeHttpRequest = async <Data = any, Error = any>(params: HttpRequestParams): Promise<Data | undefined | null> => {

    const {fetchParams, configParams = {}} = params
    const {onError, onTransform, onResponse, onLoading, throwOnError} = configParams as FetchConfigParams<Data, Error>;

    try {
        onLoading?.();
        const response = await fetcher(fetchParams);
        onResponse?.(onTransform?.(response) ?? response);
        return response as Data;
    } catch (error) {
        const converted = error as Error;
        onError?.(converted)
        if (throwOnError?.(converted) ?? true) throw converted;
    }
};


export default fetcher;
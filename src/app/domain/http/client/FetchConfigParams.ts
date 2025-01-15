export default interface FetchConfigParams<Data = any, Error = any, V = Data, > {
    onError?: (error: Error) => void;
    onTransform?: (data: Data) => V,
    onResponse?: (response: Data) => void;
    onLoading?: () => void;
    throwOnError?: (error: Error) => boolean;
}
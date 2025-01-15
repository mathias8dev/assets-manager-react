export default interface FetchParams {
    url: string;
    method?: string;
    headers?: object;
    params?: URLSearchParams | { [key: string]: any };
    payload?: FormData | URLSearchParams | { [key: string]: any };
}
import FetchParams from "@/app/domain/http/client/FetchParams";
import FetchConfigParams from "@/app/domain/http/client/FetchConfigParams";


export default interface HttpRequestParams {
    fetchParams: FetchParams;
    configParams: FetchConfigParams;
}
import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_CONSTRUCTION_MODEL } from "./const";

class ConstructionApiRequest extends BaseModelAPI {
    constructor() {
        super(API_CONSTRUCTION_MODEL.url);
    }

    async constructionStage<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.get, {id: id, method: `${idConstruction}/${API_CONSTRUCTION_MODEL.methods.stage.url}`, body});
    }
    async constructionStagePatch<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.put, {method: `${idConstruction}/${API_CONSTRUCTION_MODEL.methods.stage.url}${id}/`, body});
    }
    async constructionStageList<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.get, {method: `${idConstruction}/${API_CONSTRUCTION_MODEL.methods.stage.url}${id}/`, body});
    }
    async constructionStageOption<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.options, {method: `${idConstruction}/${API_CONSTRUCTION_MODEL.methods.stage.url}${id}/`, body});
    }
    async constructionStageStatus<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: `${idConstruction}/stage/${id}/${API_CONSTRUCTION_MODEL.methods.setStatus.url}`, body});
    }
    async constructionStageReady<T>(idConstruction: string | number,id: string | undefined, body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: `${idConstruction}/${API_CONSTRUCTION_MODEL.methods.stage.url}${id}/ready/`, body});
    }
    async constructionUpload<T>(body: any) {
        return this.makeRequest<T>(axiosClient.post, {method: `${API_CONSTRUCTION_MODEL.methods.uploadFile.url}`, body});
    }
}

export default ConstructionApiRequest;

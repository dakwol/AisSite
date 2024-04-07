import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_UPLOADFILE_MODEL } from "./const";

class UploadImageApiRequest extends BaseModelAPI {
    constructor() {
        super(API_UPLOADFILE_MODEL.url);
    }

    async uploadImage(data:any) {
        return this.makeRequest(axiosClient.post, {body: data });
    }
}

export default UploadImageApiRequest;

import BaseModelAPI from "../BaseModelAPI";
import axiosClient from "../axiosClient";
import { API_EMPOYERS_MODEL } from "./const";

class EmployersApiRequest extends BaseModelAPI {
    constructor() {
        super(API_EMPOYERS_MODEL.url);
    }

    async sendToModeration<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_EMPOYERS_MODEL.methods.sendToModeration.url, body});
    }
    async getByUser<T>() {
        return this.makeRequest<T>(axiosClient.get, {method: API_EMPOYERS_MODEL.methods.getByUser.url});
    }
    async login<T>({body}:any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_EMPOYERS_MODEL.methods.login.url, body});
    }
    async getUser<T>(id:number | string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_EMPOYERS_MODEL.methods.login.url + id});
    }
}

export default EmployersApiRequest
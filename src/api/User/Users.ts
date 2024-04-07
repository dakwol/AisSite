import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_USER_MODEL } from "./const";

class UserApiRequest extends BaseModelAPI {
    constructor() {
        super(API_USER_MODEL.url);
    }

    async authCode<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.sendCode.url, body});
    }

    async verifyCode<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.verifyCode.url, body});
    }
    async login<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.authorize.url, body});
    }
}

export default UserApiRequest;

import BaseModelAPI from "../BaseModelAPI";
import axiosClient from "../axiosClient";
import { API_ACTS_MODEL } from "./const";

class ActsApiRequest extends BaseModelAPI {
    constructor() {
        super(API_ACTS_MODEL.url);
    }

    async getMunicipalities() {
        return this.makeRequest(axiosClient.get, {method: API_ACTS_MODEL.methods.municipalities.url});
    }

    async getBuildingTypes() {
        return this.makeRequest(axiosClient.get, {method: API_ACTS_MODEL.methods.buildingTypes.url});
    }

    async getDamageTypes() {
        return this.makeRequest(axiosClient.get, {method: API_ACTS_MODEL.methods.damageTypes.url});
    }
    async getNames() {
        return this.makeRequest(axiosClient.get, {method: API_ACTS_MODEL.methods.damageNames.url});
    }
    async getPdf(id:string) {
        return this.makeRequest(axiosClient.get, {id:id, method: API_ACTS_MODEL.methods.pdf.url});
    }
    async actsSigning(id: string,body?: any) {
        return this.makeRequest(axiosClient.post, {id:id, method: API_ACTS_MODEL.methods.signing.url, body:body});
    }
    async getAddress(urlParams: string) {
        return this.makeRequest(axiosClient.get, {method: API_ACTS_MODEL.methods.getAddress.url, urlParams: `?query=${urlParams}`});
    }
}

export default ActsApiRequest
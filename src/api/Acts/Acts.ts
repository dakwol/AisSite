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
}

export default ActsApiRequest
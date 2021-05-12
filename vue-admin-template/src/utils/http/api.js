//获取数据的方法
import base from "./base";
import axios from "./axios";

export default {
    async addCase(params = {}){
        let res = await axios.post(base.addCase,params)
        return res;
    },
    async getCase(params = {}){
        let res = await axios.post(base.getCase,params)
        return res;
    },
    async updateCase(params = {}){
        let res = await axios.post(base.updateCase,params)
        return res;
    },
    async deleteCase(params = {}){
        let res = await axios.post(base.deleteCase,params)
        return res;
    },
    
}
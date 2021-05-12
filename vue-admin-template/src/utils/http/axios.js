//封装axios
import axios from 'axios'
import qs from 'qs'; // 根据需求是否导入qs模块
import store from '../../store/index'
import { Message } from 'element-ui';

// 创建axios实例
const service = axios.create({});
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// request拦截器
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
// response拦截器
service.interceptors.response.use(
    response => {
        if (response) {
            // if (!response.data.success) {
            //     Message({
            //         message: response.data.message,
            //         center: true
            //     })
            // }
            return response.data;
        } else {
            Promise.reject(new Error("error"));
        }
    },
    error => {
        Message({
            message: error,
            center: true
        })
        return Promise.reject(error);
    }
);

export default {
    get(url, params) {
        let token = store.state.token;
        return new Promise((resolve, reject) => {
            service.get(url, { params: { ...params, token } }).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    post(url, params, header, isQs = false) { //接口地址，参数，请求头，是否qs序列化
        let token = store.state.token;
        let headers = header ? { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } : {}
        params = isQs ? qs.stringify({ ...params, token }) : { ...params, token }
        return new Promise((resolve, reject) => {
            service.post(url, params, headers).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }
};
import axios from "axios"
const service = axios.create({
    baseURL: 'http://127.0.0.1:8080/'
    // baseURL: 'http://miniprogram.labggh.club/'
});
// 请求拦截
service.interceptors.request.use(config => {
    config.headers['common']['Content-Type'] = 'application/x-www-form-urlencoded';
    // config.headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxNTQxNDEyNDQ4LCJuYmYiOjE5MDE0MTI0NDgsInVpZCI6MSwiYXV0aGlkIjoiNzEifQ.V2qpfVcSPMQjA68urTH6q9SaFSrhngGHTePou1p8BYU';
    let token = wx.getStorageSync('token');
    if (token) {
        config.headers['token'] = token;
    }
    return config
});
// 响应拦截
service.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
export default service

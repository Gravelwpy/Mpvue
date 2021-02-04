import service from './service.js'
const qs = require('qs');
const get = function (url) {
    return service.get(url)
};
const post = function (url, data) {
    return service.post(url, qs.stringify(data))
};
export default {
    get,
    post
}
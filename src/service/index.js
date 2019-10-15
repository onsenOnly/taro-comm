import Taro from '@tarojs/taro'
import api from './api'

// const APP_PREFIX = 'http://127.0.0.1:3001'
const APP_ID = '5d4d1fe664247636209ed2be';
// const STATIC_URL = '';
const gen = params => {
    let url = `${APP_PREFIX}${params}`
    let method = 'GET'
    const paramsArray = params.split(' ')
    if (paramsArray.length === 2) {
        method = paramsArray[0]
        url = APP_PREFIX + paramsArray[1]
    }
    return async function (data) {
        if (!data) {
            data = {};
        }
        data.appId = APP_ID;
        return Taro.request({
            url,
            data,
            method,
            header: {
                'content-type': 'application/json'
            }
        });
    }
}

const APIFunction = {}

for (const key in api) {
    APIFunction[key] = gen(api[key])
}

APIFunction.queryPic = (params) => {
    return `${APP_PREFIX}${params}`;
}

export default APIFunction;
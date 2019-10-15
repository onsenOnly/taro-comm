import Taro from '@tarojs/taro'
import { set as setGlobalData, get as getGlobalData } from './global'
import apiService from './index';

export async function loadUserData(userRes, type) {
    try {
        const loginRes = await Taro.login();
        if (loginRes.code) {
            const recordRes = await apiService['postWxConsumer']({
                code: loginRes.code,
                encryptedData: userRes.detail.encryptedData,
                iv: userRes.detail.iv,
            });
            if (recordRes.data.code == 200) {
                console.info(recordRes);
                Taro.setStorage({ key: 'local-user', data: recordRes.data.data });
                setGlobalData('local-user', recordRes.data.data._id);
                console.info(getGlobalData('local-user'));
                if (type) {
                    return recordRes.data.data;
                } else {
                    Taro.showModal({
                        title: '温馨提示',
                        content: '授权成功',
                        showCancel: false,
                    })
                }
            } else {
                Taro.showModal({
                    title: '温馨提示',
                    content: '授权失败01',
                    showCancel: false,
                })
            }
        } else {
            Taro.showModal({
                title: '温馨提示',
                content: '授权失败02',
                showCancel: false,
            })
        }
        Taro.hideLoading();
        return;
    } catch (e) {
        console.info(e);
        Taro.showModal({
            title: '温馨提示',
            content: '授权失败03',
            showCancel: false,
        })
        Taro.hideLoading();
        return;
    }
}

export async function inspectAuth() {
    Taro.showLoading({
        title: '检查授权中...'
    });
    Taro.getStorage({ key: 'local-user' })
        .then(userRes => {
            Taro.getUserInfo({
                success: function (res) {
                    console.info(res);
                    const tmpToken = userRes.data.token;
                    const _id = userRes.data._id;
                    userRes.data = res.userInfo;
                    userRes.data.token = tmpToken;
                    userRes.data._id = _id;
                    Taro.setStorage({ key: 'local-user', data: userRes.data });
                    setGlobalData('local-user', _id);
                    return;
                },
                fail: function () {
                    Taro.removeStorage({ key: 'local-user' })
                    setGlobalData('local-user', null);
                    return;
                }
            })
        }).catch(function (err) {
            console.info(err);
            Taro.removeStorage({ key: 'local-user' })
            setGlobalData('local-user', null);
            Taro.hideLoading();
            return;
        });
}

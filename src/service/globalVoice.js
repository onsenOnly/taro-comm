import Taro from '@tarojs/taro';

const backgroundAudioContext = Taro.getBackgroundAudioManager();

export function get() {
    return backgroundAudioContext;
}

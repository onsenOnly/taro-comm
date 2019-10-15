
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Slider, Image } from '@tarojs/components'
import playPng from '../../asset/images/play.png';
import pausePng from '../../asset/images/pause.png';
import { get as getBackgroundAudioManager } from '../../service/globalVoice';
import { set as setGlobalVoiceState, get as getGlobalVoiceState } from '../../service/globalVoiceState';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

// const systemInfo = Taro.getSystemInfoSync();
// const screenWidth = systemInfo.screenWidth;
// const offsetX = parseInt(screenWidth * 0.9 * 0.2 + screenWidth * 0.05);
// const sliderWidth = parseInt(screenWidth * 0.9 * 0.8 * 0.9);
// const innerAudioContext = Taro.getBackgroundAudioManager();
// let isPause = true;

export default class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      progress: 0,
      duration: 0,
      isPlay: false,
      secondCount: 0,
      sliderAble: true,
      // innerAudioContext: null,
    }
  }

  componentWillMount() { }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  formatSecond(count) {
    let min = '', second = '';
    if (count < 10) {
      return `00:0${count}`;
    }
    if (count < 60) {
      return `00:${count}`;
    }
    min = parseInt(count / 60);
    second = parseInt(count - min * 60);
    if (min < 10) {
      if (second < 10) {
        return `0${min}:0${second}`;
      } else {
        return `0${min}:${second}`;
      }
    }
    if (second < 10) {
      return `0${min}:0${second}`;
    } else {
      return `0${min}:${second}`;
    }
  }

  limitTitle(title) {
    let num = 15;
    if (!title) {
      return title;
    }
    return String(title).length < num ? String(title) : String(title).substring(0, num) + '...';
  }


  onChange(eventHandle) {
    if (!eventHandle || !eventHandle.detail) {
      return;
    }
    const value = eventHandle.detail.value;
    setGlobalVoiceState('isSeek', true);
    getBackgroundAudioManager().seek(value);
    setGlobalVoiceState('currentTime', value);
    this.setState({ progress: value, secondCount: value });
  }

  onChanging(eventHandle) {
    setGlobalVoiceState('isSeek', true);
    if (!eventHandle || !eventHandle.detail) {
      return;
    }
    const value = eventHandle.detail.value;
    this.setState({ progress: value, secondCount: value });
  }

  changeStatus() {
    const { isPlay } = this.state;
    const { voiceSrc } = this.props;
    if (!getBackgroundAudioManager().src || voiceSrc !== getBackgroundAudioManager().src || getGlobalVoiceState('isStop')) {
      const { title, postId } = this.props;
      const { duration } = this.state;
      getBackgroundAudioManager().src = voiceSrc;
      getBackgroundAudioManager().play();
      getBackgroundAudioManager().title = title;
      setGlobalVoiceState('duration', duration);
      setGlobalVoiceState('isStop', false);
      setGlobalVoiceState('title', title);
      setGlobalVoiceState('postId', postId);
    } else {
      !isPlay ? getBackgroundAudioManager().play() : getBackgroundAudioManager().pause();
    }
    setGlobalVoiceState('isPlay', !isPlay);
  }

  render() {
    const { progress, isPlay, duration, sliderAble } = this.state;
    const { voiceSrc, title } = this.props;
    const _that = this;
    if (voiceSrc) {
      if (getBackgroundAudioManager().src && getBackgroundAudioManager().src == voiceSrc) {
        if (!duration) {
          this.setState({ duration: getGlobalVoiceState('duration'), secondCount: getGlobalVoiceState('currentTime'), progress: getGlobalVoiceState('currentTime'), isPlay: getGlobalVoiceState('isPlay'), sliderAble: false });
        }
      } else {
        if (getBackgroundAudioManager().src) {
          getBackgroundAudioManager().pause();
        }
        if (!duration) {
          const innerAudioContext = Taro.createInnerAudioContext();
          innerAudioContext.src = voiceSrc;
          innerAudioContext.volume = 0;
          innerAudioContext.autoplay = true;
          innerAudioContext.onCanplay(function () {
            innerAudioContext.stop();
            if (!innerAudioContext.duration) {
              setTimeout(function () {
                _that.setState({ duration: parseInt(innerAudioContext.duration) });
              }, 100);
            }
          });
        }
      }
      getBackgroundAudioManager().onTimeUpdate(function () {
        if (getGlobalVoiceState('duration') && !getGlobalVoiceState('isSeek')) {
          const { secondCount } = _that.state;
          if (secondCount != parseInt(getBackgroundAudioManager().currentTime)) {
            if (parseInt(getBackgroundAudioManager().currentTime) >= getGlobalVoiceState('duration')) {
              setGlobalVoiceState('currentTime', getGlobalVoiceState('duration'));
              _that.setState({ progress: getGlobalVoiceState('duration'), secondCount: getGlobalVoiceState('duration') });
            } else {
              const currentTime = parseInt(getBackgroundAudioManager().currentTime);
              setGlobalVoiceState('currentTime', currentTime);
              _that.setState({ progress: currentTime, secondCount: currentTime });
            }
          }
        }
      })
      getBackgroundAudioManager().onPlay(function () {
        console.info('启动了播放')
        _that.setState({ isPlay: true, sliderAble: false });
      });
      getBackgroundAudioManager().onPause(function () {
        console.info('暂停了播放')
        _that.setState({ isPlay: false, sliderAble: false });
      });
      getBackgroundAudioManager().onSeeked(function (obj) {
        setGlobalVoiceState('isSeek', false);
        console.info('onSeeked')
      })
      getBackgroundAudioManager().onEnded(function () {
        console.info('结尾')
        setGlobalVoiceState('currentTime', 0);
        setGlobalVoiceState('isPlay', false);
        setGlobalVoiceState('isStop', true);
        _that.setState({ progress: 0, secondCount: 0, isPlay: false, sliderAble: true });
      });
      // getBackgroundAudioManager().onSeeking(function (obj) {
      //   console.info('onSeeking')
      // })
      // getBackgroundAudioManager().onWaiting(function (obj) {
      //   console.info('onWaiting')
      // })
    }
    return (
      <View className='detail-voice-page' >
        <View className='detail-voice-icon-view'>
          <Image src={!isPlay ? playPng : pausePng} className='detail-voice-icon' onClick={this.changeStatus.bind(this)} />
        </View>
        <View className='detail-voice-content-view'>
          <View className='detail-voice-title-view'>
            <Text className='detail-voice-title'>{this.limitTitle(title)}</Text>
          </View>
          <View className='detail-voice-slider-view'>
            <Slider
              className='detail-voice-slider'
              blockSize={12}
              max={!this.state.duration ? 0 : this.state.duration}
              value={progress}
              onChange={this.onChange.bind(this)}
              onChanging={this.onChanging.bind(this)}
              disabled={sliderAble}
            />
          </View>
          <View className='detail-voice-time-view'>
            <Text className='detail-voice-time-start'>{this.formatSecond(this.state.secondCount)}</Text>
            {
              !this.state.duration ? null :
                <Text className='detail-voice-time-end'>{this.formatSecond(this.state.duration)}</Text>
            }
          </View>
        </View>
      </View>
    )
  }
}

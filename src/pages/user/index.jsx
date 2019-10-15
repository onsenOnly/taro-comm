import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"

import defaultPng from '../../asset/images/default.png';
import commentPng from '../../asset/user/user_comment.png';
import msgPng from '../../asset/user/user_msg.png';
import myMsgPng from '../../asset/user/user_my_msg.png';
import collectionPng from '../../asset/user/user_collection.png';
import settingPng from '../../asset/user/user_setting.png';
// import { get as getGlobalData } from '../../service/global';
import { loadUserData } from '../../service/comm';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      userData: '',
    }
  }

  componentWillMount() {
    console.info('componentWillMount')
  }

  componentDidMount() {
    Taro.showLoading({
      title: '初始化...'
    });
    const _that = this;
    Taro.getStorage({ key: 'local-user' })
      .then(userRes => {
        _that.setState({
          userData: userRes.data
        });
        Taro.hideLoading();
      }).catch(function (err) {
        console.error('获取用户信息失败：');
        console.error(err);
        Taro.hideLoading();
      });
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    const { userData } = this.state;
    if (!userData) {
      const _that = this;
      Taro.getStorage({ key: 'local-user' })
        .then(userRes => {
          _that.setState({
            userData: userRes.data
          });
          Taro.hideLoading();
        }).catch(function (err) {
          console.error('获取用户信息失败：');
          console.error(err);
          Taro.hideLoading();
        });
    }
  }

  componentDidHide() {
  }

  async onGotUserInfo(res) {
    if (!res.detail.encryptedData) {
      Taro.showModal({
        title: '温馨提示',
        content: '您拒绝了授权',
        showCancel: false,
      });
      return;
    }
    Taro.showLoading({
      title: '授权中...'
    });
    try {
      const userRes = await loadUserData(res, 1);
      this.setState({ userData: userRes });
      Taro.hideLoading();
    } catch (err) {
      console.error('关于授权');
      console.error(err);
    }
  }

  config = {
    navigationBarTitleText: '关于'
  }

  onToComment(id) {
    const { userData } = this.state;
    if (!userData) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没登录',
        showCancel: false,
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/comment/index?userId=${id}`
    });
  }

  onToCollection(id) {
    const { userData } = this.state;
    if (!userData) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没登录',
        showCancel: false,
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/my_collection/index?userId=${id}`
    });
  }

  onToMyMsg(id) {
    const { userData } = this.state;
    if (!userData) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没登录',
        showCancel: false,
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/my_msg/index?userId=${id}`
    });
  }

  onToMsg() {
    const { userData } = this.state;
    if (!userData) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没登录',
        showCancel: false,
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/msg/index?type=反馈`
    });
  }

  onToSetting() {
    Taro.showModal({
      title: '温馨提示',
      content: '设置选项还没开放',
      showCancel: false,
    });
  }

  render() {
    const { userData } = this.state;
    return (
      <View className='user-page'>
        <View className='user-page-header'>
          {
            process.env.TARO_ENV === 'weapp' ?
              !userData ?
                <View className='user-page-header-btn-view'>
                  <Button className='user-page-header-btn' open-type='getUserInfo' onGetUserInfo={this.onGotUserInfo.bind(this)}>
                    <Image className='user-page-header-img' src={defaultPng} />
                    <Text className='user-page-header-text' >去登录</Text>
                  </Button>
                </View> :
                <View className='user-page-header-btn-view'>
                  <Image className='user-page-header-img' src={userData.avatarUrl} />
                  <Text className='user-page-header-text' >{userData.nickName}</Text>
                </View>
              :
              <View className='user-page-header-btn' onClick={this.onToLogin.bind(this)}>
                <Image className='user-page-header-img' src={defaultPng} />
                <Text className='user-page-header-text' >{nickName}</Text>
              </View>
          }
        </View>
        <View className='user-page-dynamic'>
          <View className='user-page-dynamic-dec'>
            <Text className='user-page-dynamic-text'>我的动态</Text>
          </View>
          <AtList>
            <AtListItem
              title='我的留言'
              arrow='right'
              thumb={commentPng}
              onClick={this.onToComment.bind(this, userData._id)}
            />
            <AtListItem
              title='我的收藏'
              arrow='right'
              thumb={collectionPng}
              onClick={this.onToCollection.bind(this, userData._id)}
            />
            <AtListItem
              title='我的反馈'
              arrow='right'
              thumb={myMsgPng}
              onClick={this.onToMyMsg.bind(this, userData._id)}
            />
          </AtList>
        </View>
        <View className='user-page-dynamic'>
          <View className='user-page-dynamic-dec'>
            <Text className='user-page-dynamic-text'>其它</Text>
          </View>
          <AtList>
            <AtListItem
              title='反馈'
              arrow='right'
              thumb={msgPng}
              onClick={this.onToMsg.bind(this, userData._id)}
            />
            <AtListItem
              title='设置'
              arrow='right'
              thumb={settingPng}
              onClick={this.onToSetting.bind(this)}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

import { AtTextarea, AtNavBar, AtButton } from 'taro-ui'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import apiService from '../../service';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      postId: '',
      title: '',
      value: '',
      userId: '',
    }
  }

  componentWillMount() {
    if (process.env.TARO_ENV === 'weapp') {
      const type = this.$router.params.type;
      if (type) {
        Taro.setNavigationBarTitle({ title: type });
      } else {
        Taro.setNavigationBarTitle({ title: '留言板' });
      }
    }
  }

  componentDidMount() {
    const postId = this.$router.params.id;
    const title = this.$router.params.title;
    Taro.getStorage({ key: 'local-user' })
      .then(userRes => {
        if (!userRes.data) {
          return;
        }
        if (!postId || !title) {
          this.setState({ userId: userRes.data._id });
        } else {
          this.setState({ postId, title, userId: userRes.data._id });
        }
      }).catch(function (err) {
        console.error('获取用户信息失败：');
        console.error(err);
      });

  }

  componentWillUnmount() {
  }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: ''
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }

  handleClick() {
    window.history.go(-1);
  }

  submitMsg() {
    const { postId, value, userId } = this.state;
    if (!value) {
      Taro.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!value.trim()) {
      Taro.showToast({
        title: '内容都是空格',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    Taro.showLoading({
      title: 'loading'
    });
    apiService['postComment']({ value: value, postId: postId, userId: userId })
      .then(postRes => {
        Taro.hideLoading();
        if (postRes.statusCode == 200 && postRes.data.code == 200) {
          Taro.showModal({
            title: '温馨提示',
            content: '提交成功，请等待管理员审核留言！',
            showCancel: false,
          }).then(res => {
            if (res.confirm) {
              Taro.navigateBack({ delta: 1 })
            }
          });
          return;
        }
        Taro.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        });
      }).catch(e => {
        Taro.hideLoading();
        Taro.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        });
      });
  }

  render() {
    const { title, postId, userId, value } = this.state;
    return (
      <View className='msg-page'>
        {
          process.env.TARO_ENV === 'weapp' ?
            <View></View>
            :
            <AtNavBar
              onClickRgIconSt={this.handleClick}
              onClickRgIconNd={this.handleClick}
              onClickLeftIcon={this.handleClick}
              color='#a5a5a5'
              leftText='返回'
              leftIconType='chevron-left'
            >
              <View>Taro UI</View>
            </AtNavBar>
        }
        {
          !postId || !title ? null :

            <View className='msg-page-header-title'>
              <Text className='msg-page-header-title-txt'>{title}</Text>
            </View>
        }
        <AtTextarea
          className='msg-page-text'
          value={value}
          onChange={this.handleChange.bind(this)}
          maxLength={200}
          placeholder='您的留言...'
        />
        <AtButton className='msg-page-btn' type='primary' onClick={this.submitMsg.bind(this)}>提交</AtButton>
      </View>
    )
  }
}

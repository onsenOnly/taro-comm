
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import defaultHeadPng from '../../asset/images/default_head.png';
import praiseNotPng from '../../asset/images/praise_not.png';
import praisePng from '../../asset/images/praise.png';
import { get as getGlobalData } from '../../service/global';
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
      // listData: [],
    }
  }

  componentWillMount() { }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onToDetail(id) {

  }

  onPraise(id) {
    Taro.showLoading({
      title: 'loading...'
    });
    const userId = getGlobalData('local-user');
    if (!userId) {
      if (!this.props.onSetOpen) {
        Taro.showModal({
          title: '温馨提示',
          content: '操作失败，请返回再尝试',
          showCancel: false,
        });
        return;
      }
      this.props.onSetOpen();
      return;
    }
    apiService['commentPraise']({
      commentId: id,
      userId: userId,
      type: 2,
    })
    let { listData } = this.props;
    for (let i = 0; i < listData.length; i++) {
      if (listData[i]._id == id) {
        listData[i].praise += 1;
        listData[i].praiseArr.push(userId);
        break;
      }
    }

    this.setState(listData);
    Taro.hideLoading();
  }

  onCancelOraise(id) {
    Taro.showLoading({
      title: 'loading...'
    });
    const userId = getGlobalData('local-user');
    if (!userId) {
      this.setState({ isOpened: true });
      Taro.hideLoading();
      return;
    }
    apiService['commentPraise']({
      commentId: id,
      userId: userId,
      type: 1,
    })
    let { listData } = this.props;
    for (let i = 0; i < listData.length; i++) {
      if (listData[i]._id == id) {
        listData[i].praise -= 1;
        listData[i].praiseArr = listData[i].praiseArr.filter(item => item !== userId);
        break;
      }
    }
    this.setState(listData);
    Taro.hideLoading();
  }

  render() {
    const { listData = [] } = this.props;
    const userId = getGlobalData('local-user');
    return (
      <View className='detail-comment-list-page' >
        {listData.map(item => (
          <View className='detail-comment-list-item' key={item._id} >
            <Image src={!item.commentUser.avatarUrl ? defaultHeadPng : item.commentUser.avatarUrl} className='detail-comment-list-img' />
            <View className='detail-comment-list-praise-view'>
              {
                !item.praiseArr || item.praiseArr.length == 0 || item.praiseArr.indexOf(userId) == -1 ?
                  <Image onClick={this.onPraise.bind(this, item._id)} src={praiseNotPng} className='detail-comment-list-praise-img' /> :
                  <Image onClick={this.onCancelOraise.bind(this, item._id)} src={praisePng} className='detail-comment-list-praise-img' />
              }
              {
                !item.praise ? null :
                  <Text className='detail-comment-list-praise-text'>{item.praise}</Text>
              }
            </View>
            <View className='detail-comment-list-word-view'>
              <Text className='detail-comment-list-name'>{item.commentUser.nickName}</Text>
              <View className='detail-comment-list-content-view'>
                <Text className='detail-comment-list-content'>{item.content}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}

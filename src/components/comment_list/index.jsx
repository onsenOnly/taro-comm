
import Taro, { Component } from '@tarojs/taro'
import { AtCard } from "taro-ui"
// import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { View, Image, Text, Button } from '@tarojs/components'

import huasheng from '../../asset/images/huasheng.png';
import rightArrowPng from '../../asset/images/right_arrow.png';

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
      isOpened: false,
      postId: '',
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onToDetail(id) {
    if (!id) {
      Taro.showModal({
        title: '温馨提示',
        content: '改文章可能已经被删除，若有需求和疑问，请联系管理员',
        showCancel: false,
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  }

  render() {
    const { listData = [] } = this.props;
    return (
      <View className='comment-list-page' >
        {listData.map(item => (
          <View className='comment-list-page-item' key={item._id} onClick={this.onToDetail.bind(this, item.commentBold._id)}>
            {/* <View className='comment-list-page-item-view' key={item._id}>
              <Image src={rightArrowPng} className='comment-list-page-item-img' />
              <View className='-commentlist-page-item-title-view'>
                <Text className='comment-list-page-item-title'>{this.limitTitle(item.title)}</Text>
              </View>
              <View className='commentlist-page-item-title-view'>
                <Text className='comment-list-page-item-time'>留言信息：{this.limitContent(item.content)}</Text>
              </View>
              <View className='commentlist-page-item-title-view'>
                <Text className='comment-list-page-item-time'>留言时间：{this.limitTitle(item.createTime)}</Text>
              </View>
            </View>
            <View className='comment-list-page-item-line' /> */}
            <AtCard
              className='comment-list-page-item-card'
              title={item.commentBold.title}
              note={item.createTime}
            >
              {item.content}
            </AtCard>
          </View>
        ))}
      </View>
    )
  }
}

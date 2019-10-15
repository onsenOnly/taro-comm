
import Taro, { Component } from '@tarojs/taro'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { View, Image, Text, Button } from '@tarojs/components'

import banner4 from '../../asset/banner/banner1.png';

import apiService from '../../service';

import { get as getGlobalData } from '../../service/global';
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
      isOpened: false,
      postId: '',
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  limitTitle(title) {
    let num = 25;
    if (!title) {
      return title;
    }
    return String(title).length < num ? String(title) : String(title).substring(0, num) + '...';
  }

  onToDetail(id) {
    Taro.showLoading({
      title: '跳转中...'
    });
    // if (!getGlobalData('local-user')) {
    //   this.setState({ isOpened: true });
    //   Taro.hideLoading();
    //   return;
    // }
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  }

  // async onGotUserInfo(res) {
  //   if (!res.detail.encryptedData) {
  //     Taro.showModal({
  //       title: '温馨提示',
  //       content: '您拒绝了授权',
  //       showCancel: false,
  //     });
  //     return;
  //   }
  //   Taro.showLoading({
  //     title: '授权中...'
  //   });
  //   await loadUserData(res);
  // }

  // onCloseOpen(res) {
  //   console.info('onCloseOpen')
  //   this.setState({ isOpened: false })
  // }

  render() {
    const { isOpened } = this.state;
    const { listData = [] } = this.props;

    // const atMoal = (<AtModal isOpened={isOpened} closeOnClickOverlay={false}>
    //   <AtModalHeader>温馨提示</AtModalHeader>
    //   <AtModalContent>
    //     您还有授权登录，请点击确认键，进行微信授权登录。
    //    </AtModalContent>
    //   <AtModalAction> <Button onClick={this.onCloseOpen.bind(this)}>取消</Button><Button open-type='getUserInfo' onClick={this.onCloseOpen.bind(this)} onGetUserInfo={this.onGotUserInfo.bind(this)}>确定</Button> </AtModalAction>
    // </AtModal>)
    // console.info(listData)
    return (
      <View className='list-page' >
        {atMoal}
        {listData.map(item => (
          <View className='list-page-item' key={item._id} onClick={this.onToDetail.bind(this, item._id)}>
            <View className='list-page-item-view' key={item._id}>
              <Image src={!item.bannerSrc ? banner4 : item.bannerSrc} className='list-page-item-img' />
              <View className='list-page-item-title-view'>
                <Text className='list-page-item-title'>{this.limitTitle(item.title)}</Text>
              </View>
              <View className='list-page-item-flag-view'>
                {console.info(!item.category || item.category.length == 0)}
                {
                  !item.category || item.category.length == 0 ? null :
                    item.category.map(categoryItem => (
                      <Text key={categoryItem} className='list-page-item-flag'>{categoryItem}</Text>
                      // <AtTag key={categoryItem.categoryName} type='primary' circle size='small' className='recommend-page-item-flag'>{categoryItem.categoryName}</AtTag>
                    ))
                }
              </View>
            </View>
            <View className='list-page-item-line' />
          </View>
        ))}
      </View>
    )
  }
}

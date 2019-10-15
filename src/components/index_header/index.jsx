
import Taro, { Component } from '@tarojs/taro'
import { AtGrid } from "taro-ui"
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import searchPng from '../../asset/images/icon_search.png';
import searchBtnPng from '../../asset/images/icon_search_btn.png';

import banner1 from '../../asset/banner/banner1.png';
import banner2 from '../../asset/banner/banner2.png';
import banner3 from '../../asset/banner/banner3.png';
// import banner4 from '../../asset/banner/banner4.png';
// import banner5 from '../../asset/banner/banner5.png';

const bannerList = [banner1, banner2, banner3];

import apiService from '../../service';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}


export default class Index extends Component {
  constructor() {
    super(...arguments)
  }

  state = {
    // userImage: '',
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    // Taro.getStorage({ key: 'local-user' })
    //   .then(userRes => {

    //   }).catch(function (err) {
    //     console.error(err);
    //   });
  }

  componentDidHide() { }

  render() {
    const { bannerArr = [], gridArr = [], searchText = '搜索', onToSearch, gridClick } = this.props;
    const swiperView = (
      <Swiper
        className='index-header-swiper-container'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical={false}
        circular
        indicatorDots
        autoplay
      >
        {
          !bannerArr || bannerArr.length == 0 ?
            bannerList.map(item => {
              return (
                <SwiperItem key={item}>
                  <Image className='index-header-swiper-img' src={item} />
                </SwiperItem>
              )
            }) :
            bannerArr.map((item, index) => {
              return (
                <SwiperItem key={item._id}>
                  <Image className='index-header-swiper-img' src={item.status == '1' ?
                    (!item.imgSrc ? bannerList[index] : item.imgSrc) :
                    (!item.fileName ? bannerList[index] : apiService.queryPic(item.fileName))} />
                </SwiperItem>
              );
            })}
      </Swiper>);

    return (
      <View className='index-header-page' >
        <View className='index-header-bg'>
          <View className='index-header-search'>
            <Image src={searchPng} className='index-header-search-icon' />
            <View className='index-header-search-btn' onClick={onToSearch.bind(this)}>
              <Image src={searchBtnPng} className='index-header-btn-search-icon' />
              <Text className='index-header-search-btn-text'>{searchText}</Text>
            </View>
          </View>
          <View className='index-header-swiper'>
            {swiperView}
          </View>
        </View>
        <View className='index-header-atGrid-view'>
          <AtGrid className='index-header-atGrid' mode='square' hasBorder={false} data={gridArr} onClick={gridClick.bind(this)} />
        </View>
      </View>
    )
  }
}

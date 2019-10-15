import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Header from '../../components/index_header'
import RecommendList from '../../components/index_recommend'
import IndexList from '../../components/index_list'
import championPng from '../../asset/images/icon_champion.png';
import blogPng from '../../asset/images/icon_blog.png';
import rewardPng from '../../asset/images/icon_reward.png';
import { AtTag, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import { get as getGlobalVoiceState } from '../../service/globalVoiceState';
import { inspectAuth, loadUserData } from '../../service/comm';
import { get as getGlobalData } from '../../service/global';
import apiService from '../../service';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

const gridArr = [
  {
    image: championPng,
    value: '排行磅'
  },
  {
    image: blogPng,
    value: '精彩留言'
  },
  {
    image: rewardPng,
    value: '打赏'
  },
];

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      isOpened: false,
      page: 1,
      count: 0,
      bannerArr: null,
      recommendArr: null,
      pageArr: null,
    }
  }

  componentWillMount() { }

  async componentDidMount() {
    await inspectAuth();
    await this.loadPageData(1);
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPullDownRefresh() {
    this.onPageLoad(1);
  }

  onReachBottom() {
    const { page } = this.state;
    this.onPageLoad(page + 1);
  }

  onPageLoad(page) {
    const { count } = this.state;
    if ((page - 1) * 10 > count) {
      return;
    }
    this.loadPageData(page);
  }

  onToSearch() {
    // Taro.navigateTo({
    //   url: `/pages/file/index?type=index`
    // });
  }

  onToChampion() {
    Taro.navigateTo({
      url: `/pages/champion/index?type=index`
    });
  }

  gridClick(item, index) {
    if (index == 0) {
      Taro.showLoading({
        title: '跳转中...'
      });
      // if (!getGlobalData('local-user')) {
      //   this.setState({ isOpened: true });
      //   Taro.hideLoading();
      //   return;
      // }
      Taro.navigateTo({
        url: `/pages/champion/index?type=index`
      });
    } else if (index == 1) {
      Taro.showLoading({
        title: '跳转中...'
      });
      // if (!getGlobalData('local-user')) {
      //   this.setState({ isOpened: true });
      //   Taro.hideLoading();
      //   return;
      // }
      Taro.navigateTo({
        url: `/pages/praise/index?type=index`
      });
    } else if (index == 2) {
      wx.navigateToMiniProgram({
        appId: 'wx18a2ac992306a5a4',
        path: 'pages/apps/largess/detail?id=uC9qRiemnxqgPc1CLmE7uw%3D%3D',
        envVersion: '体验版',
        success(res) {
          console.info(res);
        }
      })
    } else {
      return;
    }
  }

  onToDetail(id) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  }

  async loadPageData(page) {
    try {
      Taro.showLoading({
        title: 'loading'
      });
      let bannerList = [], recommendList = [], pageList = [];
      let listRes;
      if (page - 1 == 0) {
        const bannerRes = await apiService['bannerList']();
        if (bannerRes.statusCode == 200 && bannerRes.data.code == 200) {
          bannerList = bannerRes.data.data;
        }
        listRes = await apiService['postList']({ isRecommend: true });
      } else {
        listRes = await apiService['postList']({ isRecommend: false, page: page });
      }
      Taro.hideLoading();
      if (listRes.statusCode == 200 && listRes.data.code == 200) {
        if (listRes.data.recommendData) {
          recommendList = listRes.data.recommendData;
        }
        if (listRes.data.data) {
          pageList = listRes.data.data;
        }
        const count = listRes.data.count;
        if (page - 1 == 0) {
          this.setState({
            count: count,
            page: page,
            bannerArr: bannerList,
            recommendArr: recommendList,
            pageArr: pageList,
          });
          Taro.stopPullDownRefresh();
          return;
        }
        const { pageArr } = this.state;
        const newPageArr = pageArr.concat(pageList);
        this.setState({
          count: count,
          page: page,
          pageArr: newPageArr,
        });
      } else {
        if (page - 1 == 0) {
          return;
        }
        Taro.showToast({
          title: '加载失败,请刷新后加载',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (e) {
      console.error('loadPageData error:')
      console.error(e);
      if (page - 1 == 0) {
        return;
      }
      Taro.hideLoading();
    }
  }

  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    onReachBottomDistance: 80,
  }

  limitTitle(title) {
    let num = 10;
    if (!title) {
      return title;
    }
    return String(title).length < num ? String(title) : String(title).substring(0, num) + '...';
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
    const { bannerArr, recommendArr, pageArr, isOpened, } = this.state;
    // const atMoal = (<AtModal isOpened={isOpened} closeOnClickOverlay={false}>
    //   <AtModalHeader>温馨提示</AtModalHeader>
    //   <AtModalContent>
    //     您还有授权登录，请点击确认键，进行微信授权登录。
    //    </AtModalContent>
    //   <AtModalAction> <Button onClick={this.onCloseOpen.bind(this)}>取消</Button><Button open-type='getUserInfo' onClick={this.onCloseOpen.bind(this)} onGetUserInfo={this.onGotUserInfo.bind(this)}>确定</Button> </AtModalAction>
    // </AtModal>)
    return (
      !bannerArr && !recommendArr && !pageArr ?
        <View></View> :
        pageArr.length == 0 ?
          <View>暂无数据</View> :
          <View className='index-page' >
            {atMoal}
            <Header className='index-header' gridClick={this.gridClick.bind(this)} onToSearch={this.onToSearch} bannerArr={bannerArr} gridArr={gridArr}></Header>
            {
              recommendArr.length !== 0 ?
                <View className='index-recommend'>
                  <View className='index-recommend-txt-view'>
                    <Text className='index-recommend-txt'>一周推荐</Text>
                  </View>
                  {/* <View className='index-recommend-line' /> */}
                  <RecommendList recommendArr={recommendArr} />
                </View> :
                <View></View>
            }
            <View className='index-tweets'>
              <View className='index-recommend-txt-view'>
                <Text className='index-recommend-txt'>推文列表</Text>
              </View>
              {/* <View className='index-recommend-line' /> */}
              <IndexList listData={pageArr} />
            </View>
            {
              // !getGlobalVoiceState('title') || !getGlobalVoiceState('currentTime') || !getGlobalVoiceState('postId')
              //   ? null :
              //   <View className='index-page-bottom' onClick={this.onToDetail.bind(this, getGlobalVoiceState('postId'))}>
              //     <Text className='index-page-bottom-text'>正在播放 [ {this.limitTitle(getGlobalVoiceState('title'))} ] </Text>
              //   </View>
            }
          </View >
    )
  }
}

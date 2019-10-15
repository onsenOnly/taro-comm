import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import MyCollectionList from '../../components/my_collection_list'
import huasheng from '../../asset/images/huasheng.png';
import apiService from '../../service';
import { get as getGlobalData } from '../../service/global';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      page: 1,
      postArr: [],
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.loadPageData(1);
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loadPageData(page) {
    const _that = this;
    Taro.showLoading({
      title: 'loading'
    });
    const userId = getGlobalData('local-user');
    apiService['collectionList']({
      type: 3,
      userId: userId,
    }).then(commentRes => {
      Taro.hideLoading();
      if (commentRes.statusCode == 200 && commentRes.data.code == 200) {
        if (page == 1) {
          _that.setState({
            examinePage: page,
            postArr: commentRes.data.data,
          });

        } else {
          let { postArr } = this.state;
          postArr = postArr.concat(commentRes.data.data);
          _that.setState({
            page: page,
            postArr: postArr,
          });
        }
        return;
      }
      Taro.showToast({
        title: '服务器错误',
        icon: 'none',
        duration: 2000
      });
    }).catch(err => {
      Taro.hideLoading();
      Taro.showToast({
        title: '服务器错误',
        icon: 'none',
        duration: 2000
      });
    });
  }

  onReachBottom() {
    const { page } = this.state;
    this.loadPageData(page + 1);
  }

  config = {
    navigationBarTitleText: '我的收藏',
    onReachBottomDistance: 80,
  }

  render() {
    const { postArr } = this.state;
    return (
      <View className='my-msg-page'>
        {
          postArr.length !== 0 ?
            <View className='comment-recommend'>
              <MyCollectionList listData={postArr} />
            </View>
            :
            <View  className='comment-recommend-not-data'>您尚未有收藏信息！</View>
        }
      </View>
    )
  }
}

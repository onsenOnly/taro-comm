import Taro, { Component } from '@tarojs/taro'
import { AtNavBar } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import IndexList from '../../components/index_list'
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
      postArr: [],
      value: '',
      page: 1,
      count: 0,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const value = this.$router.params.value;
    this.onPageLoad(value, 1);
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '搜索详情',
    enablePullDownRefresh: true,
    onReachBottomDistance: 80,
  }

  onPullDownRefresh() {
    const { value } = this.state;
    this.onPageLoad(value, 1);
  }

  onReachBottom() {
    const { page, value, count } = this.state;
    if ((page - 1) * 10 > count) {
      return;
    }
    this.onPageLoad(value, page + 1);
  }

  handleClick() {
    window.history.go(-1);
  }

  async onPageLoad(value, page) {
    try {
      Taro.showLoading({
        title: 'loading'
      });
      const postRes = await apiService['postSearch']({ searchValue: value, page: page });
      Taro.hideLoading();
      if (postRes.statusCode == 200 && postRes.data.code == 200) {
        if (postRes.data.data) {
          const count = postRes.data.count;
          let newPostArr = [];
          if (page - 1 == 0) {
            Taro.stopPullDownRefresh();
            newPostArr = postRes.data.data;
          } else {
            const { postArr } = this.state;
            newPostArr = postArr.concat(postRes.data.data);
          }
          console.info(newPostArr);
          this.setState({
            value: value,
            count: count,
            page: page,
            postArr: newPostArr,
          });
          return;
        }
      }
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      });
    } catch (e) {
      Taro.hideLoading();
      Taro.showLoading({
        title: '加载失败'
      });
    }
  }

  render() {
    const { postArr, value } = this.state;
    return (
      <View className='search-page'>
        {
          process.env.TARO_ENV === 'weapp' ?
            null
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
          postArr.length !== 0 ?
            <View className='search-recommend'>
              <IndexList listData={postArr} />
            </View>
            :
            <View className='search-recommend-not-value'>
              <Text className='search-recommend-txt'>— 没有找到和“{value}”相关的内容 —</Text>
            </View>
        }
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View } from '@tarojs/components'
import CommentList from '../../components/comment_list'
import huasheng from '../../asset/images/huasheng.png';
import apiService from '../../service';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

const tabList = [{ title: '待审核留言' }, { title: '通过的留言' }]

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      adoptPage: 1,
      examinePage: 1,
      current: 0,
      adoptArr: null,
      examineArr: null,
      postArr: [],
      userId: '',
    }
  }

  componentWillMount() {

  }

  loadPageData(page, current, userId) {
    const _that = this;
    Taro.showLoading({
      title: 'loading'
    });
    apiService['commentList']({
      type: current + 1,
      userId: userId,
    }).then(commentRes => {
      Taro.hideLoading();
      if (commentRes.statusCode == 200 && commentRes.data.code == 200) {
        if (page == 1) {
          if (current == 0) {
            _that.setState({
              examinePage: page,
              postArr: commentRes.data.data,
              examineArr: commentRes.data.data,
              userId
            });
          } else {
            _that.setState({
              adoptPage: page,
              postArr: commentRes.data.data,
              adoptArr: commentRes.data.data,
              userId
            });
          }
        } else {
          if (current == 0) {
            let { examineArr, current } = this.state;
            examineArr = examineArr.concat(commentRes.data.data);
            _that.setState({
              examinePage: page,
              postArr: examineArr,
              examineArr: examineArr,
              userId
            });
          } else {
            let { adoptArr } = this.state;
            adoptArr = adoptArr.concat(commentRes.data.data);
            _that.setState({
              adoptPage: page,
              postArr: adoptArr,
              adoptArr: adoptArr,
              userId
            });
          }
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

  componentDidMount() {
    const userId = this.$router.params.userId;
    const { current, examineArr } = this.state;
    if (!examineArr || examineArr.length == 0) {
      this.loadPageData(1, current, userId);
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '我的留言',
    onReachBottomDistance: 80,
  }

  onReachBottom() {
    const { adoptPage, examinePage, current, userId } = this.state;
    if (current == 0) {
      this.loadPageData(examinePage, current, userId);
    } else {
      this.loadPageData(adoptPage, current, userId);
    }
  }

  handleClick(value) {
    this.setState({
      current: value
    })
    const { adoptArr, examineArr, adoptPage, examinePage, userId } = this.state;
    if (value == 0) {
      if (!examineArr) {
        this.loadPageData(examinePage, value, userId);
      } else {
        this.setState({ postArr: examineArr });
      }
    } else if (value == 1) {
      if (!adoptArr) {
        this.loadPageData(adoptPage, value, userId);
      } else {
        this.setState({ postArr: adoptArr });
      }
    }
  }

  render() {
    const { postArr } = this.state;
    return (
      <View className='comment-page'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {
              postArr.length !== 0 ?
                <View className='comment-page-view'>
                  <CommentList listData={postArr} />
                </View>
                :
                <View  className='comment-recommend-not-data'>您尚未有待审核留言信息！</View>
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {
              postArr.length !== 0 ?
                <View className='comment-page-view'> 
                  <CommentList listData={postArr} />
                </View>
                :
                <View  className='comment-recommend-not-data'>您尚未有通过审核留言信息！</View>
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

import { AtTabs, AtTabsPane } from 'taro-ui'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import IndexList from '../../components/index_list'
import huasheng from '../../asset/images/huasheng.png';
import apiService from '../../service';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

const tabList = [{ title: '留言榜' }, { title: '查看榜' }]

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      adoptPage: 1,
      examinePage: 1,
      current: 0,
      adoptArr: null,
      examineArr: null,
      postArr: [],
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const { current, examineArr } = this.state;
    if (!examineArr || examineArr.length == 0) {
      this.loadPageData(1, current);
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '排行榜',
    onReachBottomDistance: 80,
  }

  loadPageData(page, current) {
    const _that = this;
    Taro.showLoading({
      title: 'loading'
    });
    apiService['postBy']({
      type: current,
      page: page,
    }).then(commentRes => {
      Taro.hideLoading();
      if (commentRes.statusCode == 200 && commentRes.data.code == 200) {
        if (page == 1) {
          if (current == 0) {
            _that.setState({
              examinePage: page,
              postArr: commentRes.data.data,
              examineArr: commentRes.data.data,
            });
          } else {
            _that.setState({
              adoptPage: page,
              postArr: commentRes.data.data,
              adoptArr: commentRes.data.data,
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
            });
          } else {
            let { adoptArr } = this.state;
            adoptArr = adoptArr.concat(commentRes.data.data);
            _that.setState({
              adoptPage: page,
              postArr: adoptArr,
              adoptArr: adoptArr,
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
    })
  };

  onReachBottom() {
    const { adoptPage, examinePage, current } = this.state;
    if (current == 0) {
      this.loadPageData(examinePage + 1, current);
    } else {
      this.loadPageData(adoptPage + 1, current);
    }
  }

  handleClick(value) {
    this.setState({
      current: value
    })
    const { adoptArr, examineArr, adoptPage, examinePage } = this.state;
    if (value == 0) {
      if (!examineArr) {
        this.loadPageData(examinePage, value);
      } else {
        this.setState({ postArr: examineArr });
      }
    } else if (value == 1) {
      if (!adoptArr) {
        this.loadPageData(adoptPage, value);
      } else {
        this.setState({ postArr: adoptArr });
      }
    }
  }

  render() {
    const { postArr } = this.state;
    return (
      <View className='champion-page'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)} >
          <AtTabsPane current={this.state.current} index={0} >
            {
              postArr.length !== 0 ?
                <View className='champion-recomment'>
                  <IndexList listData={postArr} />
                </View>
                :
                <View></View>
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {
              postArr.length !== 0 ?
                <View className='champion-recomment'>
                  <IndexList listData={postArr} />
                </View>
                :
                <View></View>
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

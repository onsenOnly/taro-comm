import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import IndexList from '../../components/index_list'
import huasheng from '../../asset/images/huasheng.png';

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}

export default class Index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      postArr: [
        {
          title: '今日吃啥今日吃啥今日吃啥今日吃啥今日吃啥今日吃啥今日吃啥',
          imgUrl: huasheng,
          flag: '吃货',
          _id: 1,
        },
        {
          title: '今日吃啥',
          imgUrl: huasheng,
          flag: '吃货',
          _id: 2,
        }
      ],
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const value = this.$router.params.value;
    console.info(value);
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '搜索详情'
  }

  render() {
    const { postArr } = this.state;
    return (
      <View className='champion-page'>
        {
          postArr.length !== 0 ?
            <View className='champion-recomment'>
              <IndexList listData={postArr} />
            </View>
            :
            <View></View>
        }
      </View>
    )
  }
}

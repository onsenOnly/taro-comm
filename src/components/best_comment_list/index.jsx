
import Taro, { Component } from '@tarojs/taro'
import { AtCard } from "taro-ui"
import { View, } from '@tarojs/components'

if (process.env.TARO_ENV === 'h5') {
  require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
  require('./index_weapp.css');
}


export default class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onToDetail(id) {
    console.info(id);
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
    listData.map(item => {
      !item.praise ?
        item.props = {
          title: item.commentBold.title,
          note: item.createTime,
        }
        :
        item.props = {
          title: item.commentBold.title,
          note: item.createTime,
          extra: `获赞：${item.praise}`,
        }
      return item;
    })
    console.info(listData,2222)
    return (
      <View className='feed-list-page' >
        {listData.map(item => (
          <View className='feed-list-page-item' key={item._id} onClick={this.onToDetail.bind(this, item.commentBold._id)}>
            <AtCard
              {...item.props}
            >
              {item.content}
            </AtCard>
          </View>
        ))}
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar, AtTag } from "taro-ui"



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
    type: '',
    value: '',
    searchArr: [],
  }

  componentWillMount() {

  }

  componentDidMount() {
    const comeType = this.$router.params.type;
    const _that = this;
    Taro.getStorage({ key: 'local-search' }).then(searchArr => {
      _that.setState({ type: comeType, searchArr: searchArr.data == 0 ? [] : searchArr.data });
    }).catch(function (err) {
      console.info(err);
      _that.setState({ type: comeType });
    });
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '搜索'
  }

  onChange(value) {
    this.setState({ value: value });
  }

  onActionClick() {
    if (!this.state.value) {
      return;
    }
    const _that = this;
    Taro.getStorage({ key: 'local-search' }).then(searchArr => {
      const num = searchArr.data.indexOf(_that.state.value);
      if (num !== -1) {
        searchArr.data.splice(num, 1);
      }
      searchArr.data.unshift(_that.state.value);
      Taro.setStorage({ key: 'local-search', data: searchArr.data });
      _that.setState({ searchArr: searchArr.data });
      Taro.navigateTo({
        url: `/pages/search/index?value=${_that.state.value}`
      });
    }).catch(function (err) {
      console.info(err);
      Taro.setStorage({ key: 'local-search', data: [_that.state.value] });
      _that.setState({ searchArr: [_that.state.value] });
      Taro.navigateTo({
        url: `/pages/search/index?value=${_that.state.value}`
      });
    });
  }

  clearData() {
    Taro.setStorage({ key: 'local-search', data: [] });
    this.setState({ searchArr: [] });
  }

  tagClick(tagObj) {
    Taro.navigateTo({
      url: `/pages/search/index?value=${tagObj.name}`
    });
  }

  render() {
    let { type, searchArr = [], value } = this.state;
    const _that = this;
    return (
      <View className='file-page'>
        {
          !type ?
            <AtSearchBar className='file-page-search-bar'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
            :
            <AtSearchBar className='file-page-search-bar'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
              focus
            />
        }
        {
          searchArr.length !== 0 && !value ?
            <View className='file-page-tip'>
              <View className='file-page-tip-bar'>
                <Text className='file-page-tip-bar-text'>搜索历史</Text>
                <Text className='file-page-tip-bar-clear' onClick={this.clearData.bind(this)}>清空</Text>
              </View>
              <View className='file-page-tip-bar-item-view'>
                {
                  searchArr.map(item => (
                    <AtTag name={item} className='file-page-tip-bar-item' key={item} circle active onClick={_that.tagClick.bind(this)}>{item}</AtTag>
                  ))
                }
              </View>
            </View>
            :
            <View></View>
        }
      </View>
    )
  }
}


import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTag, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

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
        let num = 22;
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
        const { recommendArr = [] } = this.props;

        // const atMoal = (<AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        //   <AtModalHeader>温馨提示</AtModalHeader>
        //   <AtModalContent>
        //     您还有授权登录，请点击确认键，进行微信授权登录。
        //    </AtModalContent>
        //   <AtModalAction> <Button onClick={this.onCloseOpen.bind(this)}>取消</Button><Button open-type='getUserInfo' onClick={this.onCloseOpen.bind(this)} onGetUserInfo={this.onGotUserInfo.bind(this)}>确定</Button> </AtModalAction>
        // </AtModal>)
        console.info(recommendArr);
        return (
            <View className='recommend-page' >
                {atMoal}
                {recommendArr.map(item => (
                    <View onClick={this.onToDetail.bind(this, item._id)} className='recommend-page-item' key={item._id}>

                        <View className='recommend-page-item-view' key={item._id}>
                            <Image src={!item.bannerSrc ? banner4 : item.bannerSrc} className='recommend-page-item-img' />
                            <View>
                                <Text className='recommend-page-item-title'>{this.limitTitle(item.title)}</Text>
                            </View>
                            {
                                !item.category || item.category.length == 0 ? null :
                                    item.category.map(categoryItem => (
                                        <View className='recommend-page-item-flag'>
                                            <Text>{categoryItem}</Text>
                                        </View>
                                    ))
                            }
                        </View>
                        <View className='recommend-page-item-line' />
                    </View>
                ))}
            </View>
        )
    }
}

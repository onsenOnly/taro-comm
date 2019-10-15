import Taro, { Component } from '@tarojs/taro'
import { AtDivider, AtNavBar, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { View, Text, Image, RichText, Button } from '@tarojs/components'

import everyDayPng from '../../asset/images/every_day.png';
import IndexList from '../../components/index_list'
import DetailCommentList from '../../components/detail_comment_list'
import apiService from '../../service';
import WxParse from '../../wxParse/wxParse'
// import showdown from '../../components/wxParse/showdown'
import { get as getGlobalData } from '../../service/global';

import banner4 from '../../asset/banner/banner1.png';
import homeBtnPng from '../../asset/images/home_btn.png';
import shareBtnPng from '../../asset/images/share_btn.png';

import { loadUserData } from '../../service/comm';

if (process.env.TARO_ENV === 'h5') {
    require('./index_h5.css');
} else if (process.env.TARO_ENV === 'weapp') {
    require('./index_weapp.css');
}

import DetailVoice from '../../components/detatl_voice'

// const innerAudioContext = Taro.createInnerAudioContext()

export default class Index extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            postDetail: '',
            recommendArr: '',
            commentArr: '',
            isOpened: false,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        const postId = this.$router.params.id;
        this.loadData(postId);
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    handleClick() {
        window.history.go(-1);
    }

    async loadData(id) {
        try {
            Taro.showLoading({
                title: 'loading'
            });
            const userId = getGlobalData('local-user');
            const postRes = await apiService['post']({ postId: id, userId: userId });

            Taro.hideLoading();

            if (postRes.statusCode == 200 && postRes.data.code == 200) {
                let postDetail = [], recommendArr = [], commentArr = [];
                if (postRes.data.data) {
                    postDetail = postRes.data.data;
                }
                if (postRes.data.recommendData) {
                    recommendArr = postRes.data.recommendData;
                }
                if (postRes.data.commentData) {
                    commentArr = postRes.data.commentData;
                }
                this.setState({
                    postDetail: postDetail,
                    recommendArr: recommendArr,
                    commentArr: commentArr,
                });
                return;
            }
            Taro.showToast({
                title: '加载失败,请尝试返回后再进入',
                icon: 'none',
                duration: 2000
            });
        } catch (e) {
            console.error(e);
            Taro.hideLoading();
            Taro.showLoading({
                title: '加载失败'
            });
        }
    }

    onToMsg() {
        const postId = this.$router.params.id;
        const { postDetail } = this.state;
        if (!postId || !postDetail) {
            return;
        }
        const userId = getGlobalData('local-user');
        if (!userId) {
            this.setState({ isOpened: true });
            Taro.hideLoading();
            return;
        }
        Taro.navigateTo({
            url: `/pages/msg/index?id=${postId}&title=${postDetail.title}`
        });
    }

    onToCollection(id, type) {
        Taro.showLoading({
            title: 'loading...'
        });
        const userId = getGlobalData('local-user');
        if (!userId) {
            this.setState({ isOpened: true });
            Taro.hideLoading();
            return;
        }
        const { postDetail } = this.state;
        if (type == 1) {
            postDetail.collectionArr = postDetail.collectionArr.filter(item => item != userId);
            postDetail.collectionArr.push(userId);
            apiService['postCollection']({
                commentId: id,
                userId: userId,
                type: type,
            })
        } else {
            postDetail.collectionArr = postDetail.collectionArr.filter(item => item != userId);
            apiService['postCollection']({
                commentId: id,
                userId: userId,
                type: type,
            })
        }
        this.setState(postDetail);
        Taro.hideLoading();
    }

    onToHome() {
        Taro.navigateBack({ delta: 100 })
    }

    async onGotUserInfo(res) {
        if (!res.detail.encryptedData) {
            Taro.showModal({
                title: '温馨提示',
                content: '您拒绝了授权',
                showCancel: false,
            });
            return;
        }
        Taro.showLoading({
            title: '授权中...'
        });
        await loadUserData(res);
        const { postDetail } = this.state;
        this.setState(postDetail);
    }

    onCloseOpen(res) {
        console.info('onCloseOpen')
        this.setState({ isOpened: false })
    }

    onSetOpen() {
        this.setState({ isOpened: true });
        Taro.hideLoading();
        return;
    }

    config = {
        navigationBarTitleText: '文章详情'
    }

    onShareAppMessage(res) {
        // console.info(res);
    }

    render() {
        const { postDetail, recommendArr, commentArr, isOpened } = this.state;
        const userId = getGlobalData('local-user');
        const postId = this.$router.params.id;
        if (postDetail) {
            if (process.env.TARO_ENV === 'weapp' && postDetail.htmlContent) {
                const text = '<h1>test测试</h1>';
                WxParse.wxParse('article', 'html', postDetail.htmlContent, this.$scope, 5)
            }
        }

        const atMoal = (<AtModal isOpened={isOpened} closeOnClickOverlay={false}>
            <AtModalHeader>温馨提示</AtModalHeader>
            <AtModalContent>
                您还没有授权登录，请点击确认键，进行微信授权登录。
       </AtModalContent>
            <AtModalAction> <Button onClick={this.onCloseOpen.bind(this)}>取消</Button><Button open-type='getUserInfo' onClick={this.onCloseOpen.bind(this)} onGetUserInfo={this.onGotUserInfo.bind(this)}>确定</Button> </AtModalAction>
        </AtModal>)

        const contentPage =
            !postDetail ?
                (
                    <View className='detail-content-page'>
                        <View className='detail-page-header'>
                            <View className='detail-page-header-tip'>
                                <View>
                                    <Image className='detail-page-header-itp-img' src={everyDayPng} />
                                </View>
                                <View>
                                    <Text className='detail-page-header-tip-txt'>每天准时</Text>
                                </View>
                                <View>
                                    <Text className='detail-page-header-tip-txt'>无论你再那里，请记得打开手机</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) :
                (
                    <View className='detail-content-page'>
                        <View className='detail-page-header'>
                            <View className='detail-page-header-title'>
                                <Text className='detail-page-header-title-txt'>{postDetail.title}</Text>
                            </View>
                            <View className='detail-page-header-time'>
                                <Text className='detail-page-header-time-txt'>{postDetail.source}</Text>
                                <Text className='detail-page-header-time-txt'>{postDetail.createTime}</Text>
                            </View>
                            <View className='detail-page-header-img-view'>
                                <Image className='detail-page-header-img' src={!postDetail.isBanner ? banner4 : postDetail.isBanner == 1 ? postDetail.bannerSrc : apiService.queryPic(postDetail.bannerSrc)} />
                            </View>
                            <View className='detail-page-header-tip'>
                                <View>
                                    <Image className='detail-page-header-itp-img' src={everyDayPng} />
                                </View>
                                <View>
                                    <Text className='detail-page-header-tip-txt'>每天准时</Text>
                                </View>
                                <View>
                                    <Text className='detail-page-header-tip-txt'>无论你再那里，请记得打开手机</Text>
                                </View>
                            </View>
                        </View>
                        {
                            !postDetail.voiceSrc ? <View></View> :
                                <View className='detail-page-audio'>
                                    <DetailVoice voiceSrc={postDetail.voiceSrc} title={postDetail.title} postId={postId}></DetailVoice>
                                </View>
                        }
                        <View className='detail-page-abstract'>
                            <Text className='detail-page-abstract-txt'>{postDetail.abstract}</Text>
                        </View>
                        <View className='detail-page-post'>
                            {process.env.TARO_ENV === 'weapp' ?
                                <View>
                                    <import src='../../wxParse/wxParse.wxml' />
                                    <View class="wxParse">
                                        <template is='wxParse' data='{{wxParseData:article.nodes}}' />
                                    </View>
                                </View>
                                :
                                <View dangerouslySetInnerHTML={{ __html: postDetail.htmlContent }}></View>
                            }
                        </View>
                        <View className='detail-page-statement'>
                            <View className='detail-page-statement-view'>
                                <Text className='detail-page-statement-txt'>{postDetail.statement}</Text>
                            </View>
                            <View className='detail-page-statement-line'></View>
                            {
                                !postDetail.sourceAddress ? null :
                                    <View className='detail-page-statement-view'>
                                        <Text className='detail-page-statement-txt'>本文来源：{postDetail.source}(如有冒犯，请联系删除)</Text>
                                    </View>

                            }
                            {
                                !postDetail.sourceAddress ? null :
                                    <View className='detail-page-statement-view'>
                                        <Text className='detail-page-statement-txt'>{postDetail.sourceAddress}</Text>
                                    </View>
                            }
                        </View>
                        <View className='detail-page-read'>
                            <Text className='detail-page-read-view'>阅读 {!postDetail.view ? '' : postDetail.view}</Text>
                        </View>
                    </View>
                )

        return (
            <View className='detail-page'>
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
                            <View></View>
                        </AtNavBar>
                }
                {atMoal}
                {contentPage}
                <View className='detail-page-msg'>
                    <Text className='detail-page-msg-txt'>精选留言</Text>
                    <Text className='detail-page-msg-leave' onClick={this.onToMsg.bind(this)}>写留言</Text>
                    {
                        !commentArr || commentArr.length == 0 ? null :
                            <DetailCommentList listData={commentArr} onSetOpen={this.onSetOpen.bind(this)}></DetailCommentList>
                    }
                </View>
                <View className='detail-page-recommend'>
                    <AtDivider className='detail-page-recommend-divider' content='更多精彩推荐'
                        fontColor='#a2a2a2'
                        height='80'
                    />
                    <View className='detail-page-recommend-line'></View>
                    {
                        !recommendArr ? null :
                            <IndexList listData={recommendArr} />
                    }
                </View>

                <View className='detail-page-bottom'>
                    <View className='detail-page-bottom-txt-view'>
                        <Text className='detail-page-bottom-txt'>{postDetail.communication}</Text>
                    </View>

                    <View className='detail-page-bottom-btn'>
                        <Button className='detail-page-bottom-home' onClick={this.onToHome.bind(this)}>
                            <Image className='detail-page-bottom-home-img' src={homeBtnPng} /><Text className='detail-page-bottom-home-text'>首页</Text>
                        </Button>
                        {/* <View className='detail-page-bottom-share'> */}
                        {/* <Image className='detail-page-bottom-home-img' src={shareBtnPng} /><Text className='detail-page-bottom-share-text'>分享</Text> */}
                        <Button openType='share' className='detail-page-bottom-share'><Image className='detail-page-bottom-home-img' src={shareBtnPng} /><Text className='detail-page-bottom-share-text'>分享</Text></Button>
                        {/* </View> */}
                        {
                            !postDetail ? null :
                                !postDetail.collectionArr || postDetail.collectionArr.length === 0 || postDetail.collectionArr.indexOf(userId) == -1 ?
                                    <Button className='detail-page-bottom-collection' onClick={this.onToCollection.bind(this, postId, 1)} >
                                        <Text className='detail-page-bottom-collection-text'>收藏</Text>
                                    </Button> :
                                    <Button className='detail-page-bottom-cancle-collection' onClick={this.onToCollection.bind(this, postId, 2)} >
                                        <Text className='detail-page-bottom-collection-text'>取消收藏</Text>
                                    </Button>
                        }
                    </View>
                </View>
            </View>
        )
    }
}

import 'taro-ui/dist/style/index.scss'
import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import './app.css'


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  config = {
    pages: [
      'pages/index/index',
      'pages/file/index',
      'pages/user/index',
      'pages/champion/index',
      'pages/search/index',
      'pages/login/index',
      'pages/comment/index',
      'pages/my_msg/index',
      'pages/msg/index',
      'pages/setting/index',
      'pages/detail/index',
      'pages/praise/index',
      'pages/my_collection/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      backgroundColor:'#f3f3f3'
    },
    tabBar: {
      color: "#1296db",
      selectedColor: "#d4237a",
      backgroundColor: "#FFFFFF",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./asset/images/home.png",
          selectedIconPath: "./asset/images/home_f.png"
        },
        {
          pagePath: "pages/file/index",
          text: "搜索",
          iconPath: "./asset/images/file.png",
          selectedIconPath: "./asset/images/file_f.png"
        },
        {
          pagePath: "pages/user/index",
          text: "关于",
          iconPath: "./asset/images/user.png",
          selectedIconPath: "./asset/images/user_f.png"
        }]
    },
    requiredBackgroundModes: ["audio"],
    navigateToMiniProgramAppIdList: [
      "wx18a2ac992306a5a4"
    ]
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

// index.ts
import { getUserByWeChatCode } from "../../data/user"

const app = getApp<IAppOption>()

Component({
  data: {
  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  methods: {
    async login() {
      try {
        const code = await this._login()
        await getUserByWeChatCode(code)
        const info = await this._getUserProfile()
        app.globalData.userInfo = info
        wx.navigateTo({
          url: '../pos/pos',
        })
      } catch (error) {
        console.error('登录失败！' + JSON.stringify(error, undefined, 2))
      }
    },
    _login() {
      return new Promise<string>((resolve, reject) => {
        wx.login({
          success(res) {
            if (res.code) {
              resolve(res.code)
            }
            else {
              reject(res.errMsg)
            }
          },
          fail(err) {
            reject(err)
          },
        })
      })
    },
    _getUserProfile() {
      return new Promise<WechatMiniprogram.UserInfo>((resolve, reject) => {
        wx.getUserProfile({
          desc: '您的个人信息将仅被用于确保有权使用此小程序，以及验证通过后的数据显示及操作，而并不会被收集。',
          success: (res) => {
            if (res.userInfo) {
              resolve(res.userInfo)
            } else {
              reject(res.errMsg)
            }
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }
  },
})

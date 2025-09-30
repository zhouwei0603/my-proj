import * as core from "./core"

export async function getWebChatCode2Session(code: string): Promise<WeChatcode2sessionResponse> {
  const response = await core.get<{
    session_key: string;
    unionid: string;
    openid: string;
  }>(`/users/wechatcode2session?code=${code}`, core.DataSource.User)
  const result: WeChatcode2sessionResponse = {
    sessionKey: response.session_key,
    unionId: response.unionid,
    openId: response.openid
  }
  return result
}

export function getUserByWeChatCode(code: string): Promise<User> {
  return core.get<User>(`/users/bywechatcode?code=${code}`, core.DataSource.User)
}

export interface WeChatcode2sessionResponse {
  sessionKey: string;
  unionId: string;
  openId: string;
}

export interface User {
  name: string;
  email?: string;
  avatarUrl?: string;
}

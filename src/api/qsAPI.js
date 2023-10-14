// 对obj对象进行序列化的
import Qs from 'qs'

/** 将url解析为对象的格式 */
export const qsUrlToObj = url => {
    let i = url.indexOf('?')

    if (i === -1) return {}

    url = url.substring(i + 1)

    return Qs.parse(url)
}

/** 对象序列化 */
export const qsStringfy = obj => {
    return Qs.stringify(obj) // 只要不是对象，全部都返回的是空字符串
}

export const qsParse = (string, delimiter = '&') => {
    return Qs.parse(string, delimiter)
}
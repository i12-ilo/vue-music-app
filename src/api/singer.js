import Axios from './base'

// 获取热门歌手
export function hotSinger() {
    return Axios.get('/artist/list', {
        params: {
            initial: -1,
            limit: 10
        }
    })
}

// 根据不同开头字母返回不同的歌手信息
export function letterSinger(letter) {
    return Axios.get('/artist/list', {
        params: {
            initial: letter,
            limit: 10
        }
    })
}

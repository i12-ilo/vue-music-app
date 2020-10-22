import Axios from './base'
// 推荐歌单
export function getRecommend(url, limit) {
  return Axios.get(url, {
    params: {
      limit
    }
  })
}

// 推荐mv
export function RecomMV(url) {
  return Axios.get(url)
}

// 推荐新音乐
export function RecomNewSong(url) {
  return Axios.get(url)
}
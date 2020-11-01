<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
//   import {playlistMixin} from 'common/js/mixin'
  import { onMounted, reactive, toRefs, watch, ref, computed } from 'vue'
  import {useRouter} from "vue-router"
  import {useStore} from "vuex"

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

   export default {
     props: {
       bgImages: {
        type: String,
        default: ''
       },
       songs: {
        type: Array
       },
       title: {
        type: String,
        default: ''
       },
       rank: {
        type: Boolean,
        default: false
       }
     },
     setup(props,context){
         const router = useRouter()
         const store = useStore();
         const state = reactive({
             scrollY:0,
             probeType:3,
             listenScroll: true,
             imageHeight:0,
             minTransalteY:0
         })
         let bgImage = ref(null)
         let list = ref(null)
         let playBtn = ref(null)
         let layer = ref(null)
         let filter = ref(null)
         onMounted(()=>{
             list.value.$el.style.top = `${state.imageHeight}px`
             state.imageHeight = bgImage.value.clientHeight
             state.minTransalteY = -state.imageHeight + RESERVED_HEIGHT
             list.value.$el.style.top = `${state.imageHeight}px`
         })
        const bgStyle = computed(()=>{
           console.log(props)
           return `background-image:url(${props.bgImages})`
         })
        const handlePlaylist = (playlist) => {
          const bottom = playlist.length > 0 ? '60px' : ''
          list.value.$el.style.bottom = bottom
          list.value.refresh()
        }
        const scroll = (pos) => {
           state.scrollY = pos.y
        }
        const back = () => {
           router.back()
        }
        const selectItem = (item, index) => {
          store.dispatch('selectPlay',{
            list:props.songs,
            index:index
          })
        }
         const random = ()=>{
        
        }
      watch(()=>state.scrollY,(newVal) =>{
        let translateY = Math.max(state.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / state.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
        layer.value.style[transform] = `translate3d(0,${translateY}px,0)`
        filter.value.style[backdrop] = `blur(${blur}px)`
        if (newVal < state.minTransalteY) {
          zIndex = 10
          bgImage.value.style.paddingTop = 0
          bgImage.value.style.height = `${RESERVED_HEIGHT}px`
          playBtn.value.style.display = 'none'
        } else {
          bgImage.value.style.paddingTop = '70%'
          bgImage.value.style.height = 0
          playBtn.value.style.display = ''
        }
        bgImage.value.style[transform] = `scale(${scale})`
        bgImage.value.style.zIndex = zIndex
      })
        return {
             ...toRefs(state),
             bgImage,
             filter,
             layer,
             playBtn,
             handlePlaylist,
             scroll,
             back,
             list,
             selectItem,
             random,
             bgStyle
         }
     },
     components:{
         Scroll,
         Loading,
         SongList
     }
  
  
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
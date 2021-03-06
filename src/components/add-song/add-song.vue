<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBoxRef" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <Scroll ref="songListRef" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <SongList :songs="playHistory" @select="selectSong">
              </SongList>
            </div>
          </Scroll>
          <Scroll :refreshDelay="refreshDelay" ref="searchListRef" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <Suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></Suggest>
      </div>
      <top-tip ref="topTipRef">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SongList from 'base/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Switches from 'base/switches/switches'
  import TopTip from 'base/top-tip/top-tip'
  import Suggest from 'components/suggest/suggest'
  // import {searchMixin} from 'common/js/mixin'
  // import {mapGetters, mapActions} from 'vuex'
  // import Song from 'common/js/song'
import { reactive, toRefs, ref, computed } from 'vue'
import { useStore } from 'vuex'

  export default {
    setup(){
      const state = reactive({
        showFlag: false,
        query:'',
        showSinger: false,
        currentIndex: 0,
        songs: [],
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
       ]
      })
      const store = useStore()
      const songListRef = ref(null)
      const searchListRef = ref(null)
      const searchBoxRef = ref(null)
      const showListRef = ref(null)
      const topTipRef = ref(null)
      const playHistory = computed(()=>{
        return store.getters.playHistory
      })
      const searchHistory = computed(()=>{
        return store.getters.searchHistory
      })
      const show = ()=>{
        state.showFlag = true
        setTimeout(() => {
          if (state.currentIndex === 0) {
            songListRef.value.refresh()
          } else {
            searchListRef.value.refresh()
          }
        }, 20)
      }

      const hide = ()=>{
        state.showFlag = false
      }
      const deleteSearchHistory = ()=>{
        store.dispatch('deleteSearchHistory')
        showTip()
      }
      const selectSong = (song,index)=>{
        if (index!==0){
          store.dispatch('insertSong',song)
        }
      }
      const onQueryChange = (query) =>{
      state.query = query
      }
      const selectSuggest = ()=>{
        store.dispatch('saveSearchHistory',state.query)
        showTip()
      }

      const  blurInput = () => {
        searchBoxRef.value.blur()
      }
      const switchItem = (index)=>{
        state.currentIndex = index
      }

      const addQuery = (query)=>{
        searchBoxRef.value.setQuery(query)
      }

      const showTip = ()=>{
        topTipRef.value.show()
      }
      return {
        ...toRefs(state),
        showListRef,
        searchListRef,
        searchBoxRef,
        show,
        hide,
        selectSong,
        songListRef,
        selectSuggest,
        switchItem,
        onQueryChange,
        blurInput,
        playHistory,
        searchHistory,
        deleteSearchHistory,
        addQuery
      }
    },
    components: {
      SearchBox,
      SongList,
      SearchList,
      Scroll,
      Switches,
      TopTip,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
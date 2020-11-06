<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" :key="item.id" v-for="item in topList">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" src='../../assets/logo.png'/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.first}}-{{song.second}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getTopList} from 'api/rank'
import { onMounted, reactive, watch, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import * as Types from "../../store/mutation-types"
import { useStore } from 'vuex'

  export default {
    setup(){
        const state = reactive({
            topList:[]
        })
        const rank = ref(null)
        const toplist = ref(null)
        const router = useRouter()
        const store = useStore()
        onMounted(()=>{
            _getTopList()
        })
        const handlePlaylist = (playlist)=>{
          const bottom = playlist.length > 0 ? '60px' : ''
          rank.value.style.bottom = bottom
          toplist.value.refresh()
        }

        const selectItem = (item) => {
            router.push({
                path:`/rank/${item.id}`
            })
            store.commit(Types.SET_TOP_LIST,item)
        }
        const _getTopList = ()=>{
            getTopList().then(res=>{
                console.log(res.data.list)
                res.data.list.forEach(item=>{
                    if (item.tracks.length>0){
                     state.topList.push({
                        id:item.id,
                        picUrl:item.coverImgUrl,
                        songList:item.tracks,
                        name:item.name
                    })
                    }  
                })
            })
        }

        watch(()=>state.topList,()=>{
            setTimeout(()=>{

            },20)
        })

        return {
            ...toRefs(state),
            rank,
            toplist,
            handlePlaylist,
            selectItem
        }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
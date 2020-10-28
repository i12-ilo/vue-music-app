<template>
<transition name="slider">
  <music-list v-if="songs.length>0" :title="title" :bg-images="bgImage" :songs="songs"></music-list>
</transition>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import {useStore} from "vuex"
import {getSingerDetail, getAlbum} from "api/singer.js"
import MusicList from 'components/music-list/music-list'
export default {
  setup(){
    const store = useStore()
    const state = reactive({
      songs:[],
      temp:[]
    })

     const title =  computed(()=>{
     console.log(store.state)
      return store.state.singer.name
    })
   const bgImage  =  computed(()=>{
     console.log(store.state.singer.url)
      return store.state.singer.url
    })
   
    onMounted(()=>{
      initSongs()
    })
  
   
    const initSongs = ()=>{
      getSingerDetail(store.state.singer.singerId).then(res=>{
        if (res.data.code===200) {
          console.log(res.data)
          res.data.songs.forEach((item,index)=>{
            state.temp.push(
              {
                name:item.name,
                id:item.id,
                albumId:item.al.id,
                duration:item.dt,
                singer:title
            })
          })
        }
      })
    }

    const getAlubmInfo=()=>{
      state.temp.forEach((item,index) => {
        getAlbum(item.albumId).then(res=>{
          item.imgUrl = res.data.album.blurPicUrl
          item.albumName = res.data.album.name
           if (index === state.temp.length-1) {
              console.log('ok')
              state.songs = state.temp;
              console.log(state.songs)
          }
        })
      })
      
    }

    watch(()=>state.temp.length,(newValue,oldValue)=>{
      if (newValue > 0) {
        console.log('======')
        getAlubmInfo()
      }
    })

   return {
      ...toRefs(state),
      initSongs,
      getAlubmInfo,
      title,
      bgImage
    }
  },
  components:{
    MusicList 
  }

}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
<template>
  <div class="singer" ref="singerRef">
    <list-view v-if='singers&&singers.length>0' @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, reactive, watch, toRefs, ref,computed } from "vue";
import { hotSinger, letterSinger } from "api/singer.js";
import {useRouter} from "vue-router";
import ListView from 'base/listview/listView'
import {useStore} from "vuex"
import * as types from "../../store/mutation-types"
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      singers:[],
      letterArr:[]
    })
    let hot = []
    const singerRef = ref(null)
    const list = ref(null)
    onMounted(() => {
      getHotSingerArr().then(res=>{
        let temp = [];
        res.map((item,index)=>{
          temp.push({
            name:item.name,
            avatar:item.img1v1Url,
            id:item.id
          })
        })
        hot.push({
          title:"热门",
          item:temp
        })
      })
      getSingerByLetter()
    });
    // 按照字母分类的歌手列表
    const getSingerByLetter = ()=>{
        const letterItems = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        for (let i = 0;i<26;i++){
          letterSinger(letterItems[i]).then(res=>{
            let temp = [];
            if (res&&res.data&&res.data.artists){
              res.data.artists.map((item,index)=>{
                temp.push({
                  name:item.name,
                  avatar:item.img1v1Url,
                  id:item.id
                })
              })
            }
            state.letterArr.push({
              title:letterItems[i],
              item:temp
            })
          })
        }
    }
    // 热门歌手列表
    const getHotSingerArr = async()=>{
      const result = await hotSinger()
      return result.data.artists
    }
    // 拿到热门歌手和按照字母分类的歌手列表
    const normalizaSinger = (hotList,allLetterSinger) => {
      //  想拿到的allLetterSinger数组的结构是 [{title:'a',items:[]}]
      // 但这个结构不一定是个有序的，在操作它之前可以先排序
      allLetterSinger.sort((a,b)=>{
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
       state.singers = hotList.concat(allLetterSinger)
       console.log(state.singers.length)
    }
    // 跳转到歌手详情页
    const selectSinger = (id,url,name)=>{
      router.push(`/singer/${id}`)
      console.log('=====',id,url,name)
      store.commit(types.SET_SINGER,{singerId:id,url,name});
    }
    watch(()=>state.letterArr.length,(cur,pre)=>{
    //  监视数据的变化，一旦获取到了数据，即可更改state.singers
     if (cur===26&&hot.length===1){
       normalizaSinger(hot,state.letterArr)
     }
   })
   const handlePlaylist = (playlist)=>{
     const bottom = playlist.value.length>0?'60':""
     singerRef.value.style.bottom = bottom+"px"
     list.value.refresh()
   }
    const playlist = computed(()=>{
        return store.getters.playlist
      })

      watch(()=>playlist.value.length,()=>{
        handlePlaylist(playlist)
      })
   
   return {
     ...toRefs(state),
     getSingerByLetter,
     getHotSingerArr,
     normalizaSinger,
     selectSinger,
     singerRef,
     list,
     handlePlaylist
   }
},
  components:{
   ListView:ListView
 }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
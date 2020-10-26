<template>
  <div class="singer" ref="singer">
    <list-view v-if='singers&&singers.length>0' @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, reactive, watch, toRefs } from "vue";
import { hotSinger, letterSinger } from "api/singer.js";
import ListView from 'base/listview/listView'
export default {
  setup() {
    const state = reactive({
      singers:[],
      letterArr:[]
    })
    let hot = []
    onMounted(() => {
      getHotSingerArr().then(res=>{
        let temp = [];
        res.map((item,index)=>{
          temp.push({
            name:item.name,
            avatar:item.img1v1Url
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
            state.letterArr.push({
              title:letterItems[i],
              item:res.data.artists
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
   watch(()=>state.letterArr.length,(cur,pre)=>{
    //  监视数据的变化，一旦获取到了数据，即可更改state.singers
     if (cur===26&&hot.length===1){
       normalizaSinger(hot,state.letterArr)
     }
   })

   return {
     ...toRefs(state),
     getSingerByLetter,
     getHotSingerArr,
     normalizaSinger
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
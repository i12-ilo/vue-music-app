<template>
  <div>singer</div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { hotSinger, letterSinger } from "api/singer.js";
export default {
  setup() {
    const HOT_NAME = '热门'
    const state = reactive({
      singers: [],
    });

    onMounted(() => {
      hotSinger().then((res) => {
        console.log(res);
        if (res.statusText === "OK" && res.status === 200) {
          console.log("33333");
          res.data.artists.map((curobj, index) => {
            state.hot.push({
              picUrl: curobj.picUrl,
              name: curobj.name,
            });
          });
          console.log(state.hot);
        }
      });
      letterSinger("a").then((res) => {
        console.log("====a", res);
      });
    });
    
    const normalizaSinger=()=>{
      let map = {
        hot: {
          title:HOT_NAME,
          items:[]
        }
      }
      //处理热门歌手数据
      hotSinger().then((res) => {
        if (res.statusText === "OK" && res.status === 200) {
          res.data.artists.map((curobj, index) => {
            map.hot.items.push({
              avatar: curobj.picUrl,
              name: curobj.name,
            });
          });
        }
      })
      
      // 处理26个字母的歌手列表

    }
  
  
  },
};
</script>

<style>
</style>
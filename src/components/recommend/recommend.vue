<template>
  <div class="recommend" ref="recomment">
    <scroll ref="scrollT" class="recommend-content" :data="discList">
    <div>
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" style="width:100%" :src="item.picUrl" />
              </a>
            </div>
          </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
          @click='selectItem(item)'
           v-for="item in discList"
           :key="item.id"
            class="item"
          >
            <div class="icon">
               <img width="60" height="60" v-lazy="item.picUrl" src="../../assets/logo.png"/>
            </div>
            <div class="text">
              <h2 class="name" v-html="item.name"></h2>
              <p class="artistName" v-html="item.copywriter.substring(0,4)"></p>
            </div>
          </li>
        </ul>
       </div>
    </div> 
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from "base/slider/slider";

import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { RecomMV, getRecommend } from "api/recommend";
import { reactive, toRefs, onMounted, ref, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as Types from "../../store/mutation-types"
export default {
  setup(props, context) {
    const state = reactive({
      recommends: [],
      discList: [],
      checkloaded: false,
    });

    const recomment = ref(null);
    const scrollT = ref(null);
    const router = useRouter()
    const store = useStore()
     const playlist = computed(()=>{
        return store.getters.playlist
      })

      watch(()=>playlist.value.length,()=>{
        handlePlaylist(playlist)
      })
    const handlePlaylist = playlist => {
      const bottom = playlist.length > 0 ? "60px" : "";
      recomment.value.style.bottom = bottom;
      scrollT.value.refresh();
    };
    const selectItem = (item)=>{
      router.push({
        path:`/recommend/${item.id}`
      })
      store.commit(Types.SET_DISC,item)
    }
    onMounted(() => {
      RecomMV("/personalized/mv").then((res) => {
        state.recommends = res.data.result;
        console.log(state.recommends)
      })
      getRecommend("/personalized", 10).then((res) => {
        state.discList = res.data.result;
      })
    });

    return {
      ...toRefs(state),
      handlePlaylist,
      scrollT,
      recomment,
      selectItem
    };
  },

  components: {
    Slider,
    Scroll,
    Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
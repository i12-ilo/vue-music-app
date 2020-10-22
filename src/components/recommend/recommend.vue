<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
    <div>
      <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        <!-- <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick"  :src="item.picUrl" />
              </a>
            </div>
          </slider> -->
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
           v-for="item in discList"
           :key="item.id"
            class="item"
          >
            <div class="icon">
               <img width="60" height="60" :src="item.picUrl" />
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
// import Slider from "base/slider/slider";

import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { RecomMV, getRecommend } from "api/recommend";
import { reactive, toRefs, onMounted } from "vue";
export default {
  setup(props, context) {
    console.log("===============");
    const state = reactive({
      recommends: [],
      discList: [],
      checkloaded: false,
    });
    // const recomment = ref(null);
    // const scroll = ref(null);

    // const handlePlayList = playlist => {
    //   const bottom = playlist.length > 0 ? "60px" : "";
    //   recomment.value.style.bottom = bottom;
    //   scroll.value.refresh();
    // };
    // const loadImage = () => {
    //   if (!state.checkloaded) {
    //     state.checkloaded = true;
    //     // scroll.value.refresh();
    //   }
    // };
    onMounted(() => {
      RecomMV("/personalized/mv").then((res) => {
        // console.log(state.recommends);
        state.recommends = res.data.result;
        console.log("推荐mv", res);
      })
      getRecommend("/personalized", 10).then((res) => {
        console.log("推荐歌单", res);
        // console.log(state.discList);
        state.discList = res.data.result;
      })
    });

    return {
      ...toRefs(state),
      // handlePlayList,
      // loadImage,
      // scroll,
      // recomment
    };
  },

  components: {
    // Slider,
    Scroll,
    Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
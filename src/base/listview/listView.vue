<template>
  <Scroll
    @scroll="scrollT"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    ref="listview"
  >
      <ul ref="listGroup">
      <li v-for="group in data" :key="group.title" class="list-group">
        <h2 class="list-group-title" ref="hello">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.item" :key="item.name" class="list-group-item">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{ current: currentIndex === index }"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div> -->
     <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";
import { reactive, ref, computed, watch, toRefs, onMounted } from "vue";

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

export default {
  props: {
    data: {
      type: Array
    }
  },
  setup(props, context) {
    const state = reactive({
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      probeType: 3,
      listenScroll: true,
      touch: {},
      listHeight: [],
      fixedTop:0
    });
    onMounted(()=>{
      calculateHeight()
    })
    const listview = ref(null);
    const listGroup = ref(null);
    const fixed = ref(null)
    const touch = {};
    const selectItem = (item) => {
      context.emit("select", item);
    };
    const onShortcutTouchStart = (e) => { 
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      touch.y1 = firstTouch.pageY;
      touch.anchorIndex = anchorIndex;
      scrollTo(anchorIndex);
    };

    const onShortcutTouchMove = (e) => {
      let firstTouch = e.touches[0];
      touch.y2 = firstTouch.pageY;
      let delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(touch.anchorIndex) + delta;
      scrollTo(anchorIndex);
    };
    const refresh = () => {
      listview.value.refresh();
    };
    const scrollT = (pos) => {
      state.scrollY = pos.y;
    };
    const calculateHeight = () => {
      state.listHeight = [];
      const list = listGroup.value.children;
      let height = 0;
      state.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        state.listHeight.push(height);
      }
    };
    const scrollTo = (index) => {
      state.scrollY = -state.listHeight[index];
      console.log(listview.value.hasVerticalScroll);
      listview.value.scrollToElement(listGroup.value.children[index], 0);
    };
    const shortcutList = computed(() => {
      return props.data.map((group) => {
        return group.title.substr(0, 1);
      });
    });

    const fixedTitle = computed(() => {
      if (state.scrollY > 0) {
        return "";
      }
      return props.data[state.currentIndex]
        ? props.data[state.currentIndex].title
        : "";
    });
    watch(
      () => props.data,
      () => {
        console.log("执行了")
        setTimeout(() => {
          calculateHeight();
        }, 20);
      }
    );
    watch(
      () => state.scrollY,
      (newY, oldY) => {
        const listHeight = state.listHeight;
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          state.currentIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            state.currentIndex = i;
            state.diff = height2 + newY;
            return;
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        state.currentIndex = listHeight.length - 2;
      }
    );
    watch(
      () => state.diff,
      (newVal) => {
        let fixedTop =
          newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
        if (state.fixedTop === fixedTop) {
          return;
        }
        state.fixedTop = fixedTop;
        fixed.value.style.transform = `translate3d(0,${fixedTop}px,0)`;
      }
    );
    return {
      ...toRefs(state),
    listview,
    listGroup,
    fixed,
    selectItem,
    onShortcutTouchStart,
    onShortcutTouchMove,
    refresh,
    scrollT,
    calculateHeight,
    scrollTo,
    shortcutList,
    fixedTitle
    }
  },
  components: {
    Scroll,
    Loading
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

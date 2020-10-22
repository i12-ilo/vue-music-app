<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'
  import {reactive, onMounted, onUnmounted, ref } from 'vue'
  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    setup(props,context) {
      const state = reactive({
        dots: [],
        currentPageIndex: 0,
        children:[],
        timer:null
      });
      let sliderWrapper = null;
      const slider = ref(null);
      const sliderGroup = ref(null);
      onMounted(()=>{
        setTimeout(() => {
         setSliderWidth()
          initDots()
         initSlider()
         if (props.autoPlay) {
            play()
          }
        }, 20)
        window.addEventListener('resize', () => {
          if (!state.slider) {
            return
          }
          setSliderWidth(true)
          state.slider.refresh()
        })
      })

      onUnmounted(()=>{
         clearTimeout(state.timer)
      })
       const setSliderWidth = (isResize)=>{
         state.children = sliderGroup.value.children
         let width = 0
         let sliderWidth =slider.value.clientWidth
         for (let i = 0; i < state.children.length; i++) {
           let child = state.children[i]
           addClass(child, 'slider-item')

           child.style.width = sliderWidth + 'px'
           child.style.height = 300+'px'
           width += sliderWidth
         }
         if (props.loop && !isResize) {
           width += 2 * sliderWidth
         }
         sliderGroup.value.style.width = width + 'px'
       }
     const  initSlider =()=> {
         sliderWrapper = new BScroll(slider.value, {
           scrollX: true,
           scrollY: false,
           momentum: false,
           snap: true,
           snapLoop: props.loop,
           snapThreshold: 0.3,
           snapSpeed: 400
         });
         console.log(sliderWrapper)
         sliderWrapper.on('scrollEnd', () => {
           let pageIndex = sliderWrapper.getCurrentPage().pageX
           if (props.loop) {
             pageIndex -= 1
           }
           state.currentPageIndex = pageIndex

           if (props.autoPlay) {
             clearTimeout(state.timer)
             play()
           }
         })
       }
     const  initDots =()=> {
         state.dots = new Array(state.children.length)
       }
    const   play=() =>{
         let pageIndex = state.currentPageIndex + 1
         if (props.loop) {
           pageIndex += 1
         }
         console.log(sliderWrapper)
         state.timer = setTimeout(() => {
           sliderWrapper.goToPage(pageIndex, 0, 400)
         }, props.interval)
       }
       return {
         state,
         initSlider,
         play,
         initDots,
         setSliderWidth,
         slider,
         sliderGroup
       }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
          height: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

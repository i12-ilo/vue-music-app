<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { onMounted, ref } from "vue";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
  },

  setup(props, context) {
   let scrollWrap = null;
    const wrapper = ref(null);
    onMounted(() => {
      setTimeout(() => {
        _initScroll();
      }, 20);
    });

    const _initScroll = () => {
      if (!wrapper.value) {
        return;
      }
      scrollWrap = new BScroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click,
      });
      console.log(scrollWrap,"scroll里的")
      
      if (props.listenScroll) {
          scrollWrap.on("scroll", (pos) => {
           context.emit("scroll", pos);
        });
      }

      if (props.pullup) {
        scrollWrap.on("scrollEnd", () => {
          console.log("dsfas")
          if (scrollWrap.y <= scrollWrap.maxScrollY + 50) {
            context.emit("scrolltoend");
          }
        });
      }

      if (props.beforeScroll) {
        scrollWrap.on("beforeScrollStart", () => {
          context.emit("beforescroll");
        });
      }
    };

    const disable = () => {
      scrollWrap && scrollWrap.disable();
    };
    const enable = () => {
    scrollWrap && scrollWrap.enable();
    };
    const refresh = () => {
      scrollWrap && scrollWrap.refresh();
    };
    const scrollTo = () => {
      scrollWrap &&
       scrollWrap.scrollto.apply(scrollWrap, arguments);
    };
    const scrollToElement = (...args) => {
      scrollWrap &&
      scrollWrap.scrollToElement(...args);
    };
    return {
      wrapper,
      disable,
      enable,
      refresh,
      scrollTo,
      scrollToElement,
    };
  },
};
</script>

<style>
</style>
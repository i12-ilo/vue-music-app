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
    probType: {
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
    console.log("=============scroll")
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
        probType: props.probType,
        click: props.click,
      });
      if (props.listenScroll) {
          scrollWrap.on("scroll", (pos) => {
          scrollWrap.emit("scroll", pos);
        });
      }

      if (props.pullup) {
        scrollWrap.on("scrollEnd", () => {
          if (scrollWrap.y <= scrollWrap.maxScrollY + 50) {
            scrollWrap.emit("scrollToEnd");
          }
        });
      }

      if (props.beforeScroll) {
        scrollWrap.on("beforeScrollStart", () => {
          scrollWrap.emit("beforeScroll");
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
    const scrollToElement = () => {
      scrollWrap &&
       scrollWrap.scrollToElement.apply(scrollWrap, arguments);
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
<template>
  <div>singer</div>
</template>

<script>
import { onMounted } from "vue";
import { hotSinger, letterSinger } from "api/singer.js";
export default {
  setup() {
      const state = {
          hotList:[]
      }
    onMounted(() => {
      hotSinger().then((res) => {
        console.log("====hot", res);
      });
    });
    letterSinger("a").then((res) => {
      console.log("====a", res);
    });
  },
};
</script>

<style>
</style>
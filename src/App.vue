<template>
  <div id="nav">
   <m-header></m-header>
   <tab></tab>
  </div>
  <keep-alive>
  <router-view />
  </keep-alive>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  components: {
    'm-header':MHeader,
    Tab
  }
}
</script>



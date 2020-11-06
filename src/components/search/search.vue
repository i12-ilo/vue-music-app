<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
        <Scroll class="shortcut" ref="shortcutRef" :data="shortcut">
          <div>
              <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                    <li @click="addQuery(item.first)" class="item" v-for="item in hotKey" :key="item.first">
                        <span>{{item.first}}</span>
                    </li>
                </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="deletecAll">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <SearchList v-show="searchHistory.length>0" :searches="searchHistory" @select="addQuery" @delete="deleteOne"></SearchList>
            </div>
          </div>
        </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <Suggest @select="saveSearch" @listscroll="blurInput" :query="query"></Suggest>
    </div>
    <Confirm @confirm="clearSearchHistory" ref="confirmRef" text="是否清空所有搜索历史" confirmBtnText="清空"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {getHotKey} from 'api/search'
  import { onMounted, reactive, toRefs, ref, computed, watch } from 'vue'
  import { useStore } from 'vuex'

  export default {
      setup(){
          const state = reactive({
              hotKey:[],
              query:""
          })
          const store = useStore()
        //   const searchResult = ref(null)
        //   const suggest = ref(null)
        //   const shortcutWrapper = ref(null)
        //   const shortcut = ref(null)
            const confirmRef = ref(null)
             const searchBox = ref(null)
             const shortcutRef = ref(null)
        //   const sorcuT = computed(()=>{

        //   })
            const shortcut = computed(()=>{
              return state.hotKey.concat(state.searchHistory)
            })
          onMounted(()=>{
              _getHotKey()
              console.log(searchHistory.value.length)
          })
          const searchHistory = computed(()=>{
            return  store.getters.searchHistory
          })
          const saveSearch = ()=>{
            store.dispatch('saveSearchHistory',state.query)
          }
          watch(()=>searchHistory.value.length,(newValue)=>{
            console.log(newValue)
          })

          const deleteOne = (item)=>{
           store.dispatch('deleteSearchHistory',item)
          }
          const deletecAll = ()=>{
            console.log(confirmRef.value)
            confirmRef.value.show()
            store.dispatch('clearSearchHistory')
          }
        //  const  handlePlaylist = (playlist) =>{
        //    const bottom = playlist.length > 0 ? '60px' : ''

        //     searchResult.value.style.bottom = bottom
        //     suggest.value.refresh()

        //     shortcutWrapper.value.style.bottom = bottom
        //      shortcut.value.refresh()
        //  }
        //  const  showConfirm = () => {
        //    confirm.value.show()
        //  }
          
         const  _getHotKey = () => {
              getHotKey().then((res) => {
              state.hotKey = res.data.result.hots
           })
         }
         const addQuery = (query)=>{
             state.query = query
             searchBox.value.setQuery(query)
             onQueryChange(query)
             saveSearch()
         }
         const onQueryChange = (query)=>{
           state.query = query
         }
         const blurInput = ()=>{
           searchBox.value.blur()
         }
         watch(()=>state.query,(newQuery)=>{
           if (!newQuery){
             setTimeout(()=>{
               shortcutRef.value.refresh()
             },20)
           }
         })
         return {
             ...toRefs(state),
             confirmRef,
             searchBox,
             addQuery,
             onQueryChange,
             blurInput,
             saveSearch,
             searchHistory,
             SearchList,
             deleteOne,
             deletecAll,
             Confirm,
             shortcut,
             Scroll,
             shortcutRef
            //  searchResult,
            //  shortcutWrapper,
            //  suggest,
            //  searchResult,
            //  shortcut,
            //  sorcuT,
            
            //  handlePlaylist,
            //  searchResult,
            //  showConfirm

         }
      
    },
    components: {
      SearchBox,
      Suggest
    //   SearchList,
    //   Scroll,
    //   Confirm,
      
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
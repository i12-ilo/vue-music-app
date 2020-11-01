import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
const app = createApp(App);
app.use(store)
app.use(router)
app.directive("lazy",{
    beforeMount(el,binding){
        let lazyLoadObser = new IntersectionObserver((entries,observer)=>{
            entries.forEach((entry,index)=>{
                let lazyImage =  entry.target
                if (entry.intersectionRatio>0){
                    lazyImage.src = binding.value
                    lazyLoadObser.unobserve(lazyImage)
                }
            })
        })
        lazyLoadObser.observe(el)
    }   
})
app.mount("#app")


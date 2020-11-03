import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from 'components/recommend/recommend'
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/recommend/recommend.vue'),
    children:[
      {
        path:':id',
        component:()=>import("../components/disc/disc.vue")
      }
    ]
  },
  {
    path:"/singer",
    name:"singer",
    component:()=>import("../components/singer/singer.vue"),
    children:[
      {
        path:':id',
        component:()=>import("../components/singer-detail/singer-detail.vue")
     }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

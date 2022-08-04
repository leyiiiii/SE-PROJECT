import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import user from "@/store/user";
import Writer from "@/views/Writer";
import Paper from "@/views/Paper";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/team/:id',
    name: 'team',
    component: () => import('../views/Team.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/project/:id',
    name: 'project',
    component: () => import('../views/Project.vue'),
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('../views/Design.vue'),
  },
  {
    path: '/design2',
    name: 'design2',
    component: () => import('../views/Design2.vue'),
  },
  {
    path: '/design3',
    name: 'design3',
    component: () => import('../views/Design3.vue'),
  },
  {
    path: '/writer',
    name:'writer',
    component: Writer
  },
  {
    path:'/paper',
    name:'paper',
    component: Paper
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('../views/Invitation.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 通过 Vuex 获取用户登录信息
  const userInfo = user.getters.getUser(user.state());

  if (to.path === '/login') {
    localStorage.setItem("preRoute", router.currentRoute.fullPath);
  }

  // 若用户未登录且访问的页面需要登录，则跳转至登录页面
  if (!userInfo && to.meta.requireAuth) {
    next({
      name: 'Login',
    })
  }

  next()
})

export default router

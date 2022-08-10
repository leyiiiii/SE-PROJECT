import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import user from "@/store/user";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/teamhome',
    name: 'team homepage',
    component: () => import('../views/TeamHomepage.vue'),
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
    path: '/writer',
    name:'writer',
    component: () => import('../views/Writer.vue'),
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('../views/Invitation.vue'),
  },
  {
    path: '/recycle/:id',
    name: 'recycle',
    component: () => import('../views/Recycle.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/preview/:id',
    name: 'preview',
    component: () => import('../components/Editor/Preview')
  }
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

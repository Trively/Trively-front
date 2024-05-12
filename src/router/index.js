import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TheUserView from "@/views/TheUserView.vue"
import UserLogin from "@/components/users/UserLogin.vue"
import UserJoin from "@/components/users/UserJoin.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user',
      name: 'user',
      component: TheUserView,
      children: [
        {
          path: "login",
          name: "login",
          component: UserLogin
        },
        {
          path: "join",
          name: "join",
          component: UserJoin
        }
      ]

    }
  ]
})

export default router

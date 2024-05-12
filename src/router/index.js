import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from "@/views/PostView.vue"
import PostList from "@/components/post/PostList.vue"
import PostWrite from "@/components/post/PostWrite.vue"
import PostDetail from '@/components/post/PostDetail.vue'
import PostModify from '@/components/post/PostModify.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/post',
      name: 'post',
      component: PostView,
      children: [
        {
          path: '',
          name: 'postList',
          component: PostList,
        },
        {
          path: '',
          name: 'postWrite',
          component: PostWrite,
        },
        {
          path: ':postId',
          name: 'postDetail',
          component: PostDetail,
        },
        {
          path: ':postId',
          name: 'postModify',
          component: PostModify,
        },
      ],
    },
  ]
})

export default router

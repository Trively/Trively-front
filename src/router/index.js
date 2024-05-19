import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import PostView from "@/views/PostView.vue"
import PostList from "@/components/post/PostList.vue"
import PostWrite from "@/components/post/PostWrite.vue"
import PostDetail from '@/components/post/PostDetail.vue'
import PostModify from '@/components/post/PostModify.vue'

import TheUserView from "@/views/TheUserView.vue"
import UserLogin from "@/components/users/UserLogin.vue"
import UserJoin from "@/components/users/UserJoin.vue"
import UserMyPage from "@/components/users/UserMyPage.vue"


import MessageView from "@/views/MessageView.vue"
import MessageSend from '@/components/message/MessageSend.vue'
import MessageRoomList from '@/components/message/MessageRoomList.vue'
import MessageRoomDetail from '@/components/message/MessageRoomDetail.vue'
import { storeToRefs } from "pinia";

import { useMemberStore } from "@/stores/member";


const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { userInfo, isValidToken } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;

  let token = sessionStorage.getItem("accessToken");

  if (userInfo.value != null && token) {
    await getUserInfo(token);
  }
  if (!isValidToken.value || userInfo.value === null) {
    next({ name: "login" });
  } else {
    next();
  }
};
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
      {
      path: '/member',
      name: 'member',
      component: TheUserView,
      children: [
        {
          path: "join",
          name: "join",
          component: UserJoin
        },
        {
          path: "login",
          name: "login",
          component: UserLogin
        },
        {
          path: "myPage",
          name: "myPage",
          component: UserMyPage
        }
      ]

    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
      children: [
        {
          path: ":memberId",
          name: "messageSend",
          component: MessageSend
        },
        {
          path: "",
          name: "messageRoomList",
          component: MessageRoomList,
        },
        {
          path: ":roomId",
          name: "messageRoomDetail",
          component: MessageRoomDetail,
        }
      ]

    }

  ]
})

export default router

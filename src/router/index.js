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
import MapView from "@/views/MapView.vue"


import MessageView from "@/views/MessageView.vue"
import MessageSend from '@/components/message/MessageSend.vue'
import MessageRoomList from '@/components/message/MessageRoomList.vue'
import MessageRoomDetail from '@/components/message/MessageRoomDetail.vue'
import { storeToRefs } from "pinia";

import { useMemberStore } from "@/stores/member";
import UserLogout from "@/components/users/UserLogout.vue"
import UserMyScrap from '@/components/users/UserMyScrap.vue'
import UserMyPost from '@/components/users/UserMyPost.vue'
import UserMyComment from '@/components/users/UserMyComment.vue'
import UserMyInfo from '@/components/users/UserMyInfo.vue'

import MyPlan from '@/views/MyPlan.vue'


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
      component: HomeView,
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
          beforeEnter: onlyAuthUser,
        },
        {
          path: ':postId',
          name: 'postDetail',
          component: PostDetail,
          beforeEnter: onlyAuthUser,
        },
        {
          path: ':postId',
          name: 'postModify',
          component: PostModify,
          beforeEnter: onlyAuthUser,
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
          component: UserMyPage,
          beforeEnter: onlyAuthUser,
          children: [
            {
              path: "scrap",
              name: "myScrap",
              component: UserMyScrap,
              beforeEnter: onlyAuthUser,
            },
            {
              path: "post",
              name: "myPost",
              component: UserMyPost,
              beforeEnter: onlyAuthUser,
            },
            {
              path: "comment",
              name: "myComment",
              component: UserMyComment,
              beforeEnter: onlyAuthUser,
            },
            {
              path: "info",
              name: "info",
              component: UserMyInfo,
              beforeEnter: onlyAuthUser,
            },
          ]
        },
        {
          path: "logout",
          name: "logout",
          component: UserLogout
        }
      ]

    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
      beforeEnter: onlyAuthUser,
      children: [
        {
          path: ":memberId",
          name: "messageSend",
          component: MessageSend,
          beforeEnter: onlyAuthUser,
        },
        {
          path: "",
          name: "messageRoomList",
          component: MessageRoomList,
          beforeEnter: onlyAuthUser,
        },
        {
          path: ":roomId",
          name: "messageRoomDetail",
          component: MessageRoomDetail,
          beforeEnter: onlyAuthUser,
        }
      ]

    }, 
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/map/:planListId",
      name: "detailPlan",
      component: MapView,
    },
    {
      path: "/myPlan",
      name: "myPlan",
      component: MyPlan,
    }

  ]
})

export default router

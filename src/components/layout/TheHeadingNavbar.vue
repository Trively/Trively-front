<script setup>
import { ref } from "vue";
import { useMenuStore } from "@/stores/menu";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
// import { useRoute } from "vue-router";


const menuStore = useMenuStore();
const memberStore = useMemberStore();

const { menuList } = storeToRefs(menuStore);
const { changeMenuState } = menuStore;
const logout = () => {
  memberStore.userLogout();
};
// Logic to check if user is logged in or not
// Example:
// if (someCondition) {
//   user.value = { username: 'username' };
// }
</script>

<template>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="" />
  <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors" />
  <meta name="generator" content="Hugo 0.115.4" />
  <title>여행을 주다</title>

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap" rel="stylesheet" />

  <nav
    class="navbar navbar-expand-md bg-dark sticky-top border-bottom bg-primary-subtle border border-primary-subtle rounded-3"
    style="top: 20px; margin: 10px"
  >
    <div class="container d-flex">
      <router-link to="/">
        <img src="@/assets/logo2.png" alt="Trively Logo" />
      </router-link>
    </div>
    <div class="container">
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
      >
        <div class="offcanvas-body ms-5">
          <ul class="navbar-nav flex-grow-1 justify-content-between">
            <li class="nav-item ms-auto">
              <router-link class="nav-link" to="/post">게시판</router-link>
            </li>
            <template v-if="memberStore.userInfo">
              <li class="nav-item">
                <router-link class="nav-link" to="/message">쪽지</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/member/myPage/info">마이페이지</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/" @click.prevent="logout">로그아웃</router-link>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/member/login">로그인</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/member/join">회원가입</router-link>
              </li>
            </template>
            
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>

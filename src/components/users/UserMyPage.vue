<script setup>
import { ref } from 'vue';

const selectedMenu = ref('info');

const selectMenu = (menu) => {
  selectedMenu.value = menu;
};
</script>
<template>
  <div class="container">
    <!-- <div class="title">
      <h2>마이페이지</h2>
    </div> -->
    <div class="content-container">
      <div class="sidebar">
        <nav>
          <button 
            @click="selectMenu('info'); $router.push('/member/myPage/info')"
            :class="{ 'active': selectedMenu === 'info' }"
          >
            내 정보 수정
          </button>
          <button 
            @click="selectMenu('post'); $router.push('/member/myPage/post')"
            :class="{ 'active': selectedMenu === 'post' }"
          >
            내가 쓴 글
          </button>
          <button 
            @click="selectMenu('scrap'); $router.push('/member/myPage/scrap')"
            :class="{ 'active': selectedMenu === 'scrap' }"
          >
            내가 스크랩한 글
          </button>
          <button 
            @click="selectMenu('comment'); $router.push('/member/myPage/comment')"
            :class="{ 'active': selectedMenu === 'comment' }"
          >
            내가 댓글 단 글
          </button>
        </nav>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 25px; /* 타이틀과 내용을 아래로 내리는 역할 */
}

.title {
  text-align: center;
}

.content-container {
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 10px;
}

nav {
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  color: #7685b5;
  border: none;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 17px;
}

nav button:hover {
  background-color: #5a6b96;
  color: white;
}

nav button.active {
  background-color: #7685b5;
  color: white;
}

.content {
  margin-top: 20px;
  flex: 1;
  margin-left: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
}
</style>

<script setup>
import { ref } from 'vue';

const selectedMenu = ref('UserMyPage');

const selectMenu = (menu) => {
  selectedMenu.value = menu;
};
</script>

<template>
    <div class="title">
        <h3>마이페이지</h3>
      </div>
  <div class="container">
    <div class="sidebar">
      <nav>
        <button @click="selectMenu('UserMyPage')">내 정보 수정</button>
        <button @click="selectMenu('UserMyPost')">내가 쓴 글</button>
        <button @click="selectMenu('UserMyScrap')">내가 스크랩한 글</button>
      </nav>
    </div>
    <div class="content">
      <component :is="selectedMenu" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: flex-start;
}

.sidebar {
  width: 200px;
  padding: 10px;
}

.title {
  text-align: center;
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
  padding: 10px;
  text-align: center;
  text-decoration: none;
  color: #7685b5;
  border: 2px solid #7685b5;
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

nav button:hover {
  background-color: #5a6b96;
  color: white;
}

.content {
  flex: 1;
  margin-left: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>

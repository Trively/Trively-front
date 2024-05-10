<script setup>
import { RouterLink, RouterView } from "vue-router";
import TheHeadingNavbar from "@/components/layout/TheHeadingNavbar.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
</script>

<template>
  <link href="https://webfontworld.github.io/goodchoice/Jalnan.css" rel="stylesheet" />
  <div class="wrapper">
    <TheHeadingNavbar />
    <RouterView />
    <TheFooter />
  </div>
</template>

<style scoped>
.wrapper {
  font-family: "Jalnan";
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left;
  background-attachment: fixed;
  background-image: url(@/assets/background.jpg);
  display: flex; /* Flex container로 설정하여 내부 요소를 정렬합니다. */
  flex-direction: column; /* 내부 요소들을 세로 방향으로 정렬합니다. */
  height: 100vh; /* 화면의 높이를 100%로 설정합니다. */
}
</style>

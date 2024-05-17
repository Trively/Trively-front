<script setup>
import MainMap from "@/components/map/MainMap.vue";
import TourList from "@/components/map/TourList.vue";
</script>

<template>
  <div class="map-container">
    <TourList class="tour-list"></TourList>
    <MainMap class="map"></MainMap>
  </div>
</template>

<style scoped>
.map-container {
  display: flex;
  position: relative;
  height: 100%;
}

.map {
  height: 100% !important;
  width: 100% !important;
}

.tour-list {
  position: absolute;
  top: 0;
  left: 0; /* 왼쪽 상단에 위치 */
  width: 450px; /* 너비 조정 가능 */
  height: 97%; /* 맵과 같은 높이로 설정 */
  background-color: rgba(255, 255, 255, 0.8); /* 배경색과 투명도 조정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 가능하도록 설정 */
  overflow-x: hidden;
  padding: 10px;
  margin: 10px;
  z-index: 2;
  border: 1px solid #8f8f8f; /* 테두리 추가 */
  border-radius: 10px; /* 테두리 모서리 둥글게 */
}
</style>

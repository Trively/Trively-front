<script setup>
import { ref, provide } from "vue";
import MainMap from "@/components/map/MainMap.vue";
import TourList from "@/components/map/TourList.vue";

const showTourList = ref(false);
const toggleTourList = () => {
  showTourList.value = !showTourList.value;
};

const map = ref(null);
provide('map', map); 
</script>

<template>
  <div class="map-container">
    <MainMap class="map"></MainMap>
    <button @click="toggleTourList"  v-if="!showTourList"
    class="btn btn-lg btn-jittery open-button btn-hover color-3">
    여행지 찾기!
    </button>
  
    <TourList v-if="showTourList" @close="toggleTourList" class="tour-list"></TourList>
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

.open-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
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

.btn {
  margin: 1rem;
}
.btn-jittery {
  -webkit-animation: jittery 4s infinite;
          animation: jittery 4s infinite;
}


@keyframes jittery {
  5%,
  50% {
    transform: scale(1);
  }

  10% {
    transform: scale(0.9);
  }

  15% {
    transform: scale(1.15);
  }

  20% {
    transform: scale(1.15) rotate(-5deg);
  }

  25% {
    transform: scale(1.15) rotate(5deg);
  }

  30% {
    transform: scale(1.15) rotate(-3deg);
  }

  35% {
    transform: scale(1.15) rotate(2deg);
  }

  40% {
    transform: scale(1.15) rotate(0);
  }
}

.btn-hover {
    width: 200px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    margin: 20px;
    height: 55px;
    text-align:center;
    border: none;
    background-size: 300% 100%;

    border-radius: 50px;
    moz-transition: all .4s ease-in-out;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
}

.btn-hover:hover {
    background-position: 100% 0;
    moz-transition: all .4s ease-in-out;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
}

.btn-hover:focus {
    outline: none;
}

.btn-hover.color-3 {
    background-image: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7);
    box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
}
</style>

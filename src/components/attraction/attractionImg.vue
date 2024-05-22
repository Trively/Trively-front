<script setup>
import { ref, onMounted } from 'vue';
import { localAxios } from '@/util/http-common';

const local = localAxios();

const attractions = ref([]);

onMounted(async () => {
  try {
    const response = await local.get('/attraction/img');
    if (response.data.success) {
      attractions.value = response.data.data.attractions;
    }
  } catch (error) {
    console.error('Failed to fetch images:', error);
  }
});
</script>

<template>
  <div class="carousel">
    <div class="carousel-track">
      <div v-for="(attraction, index) in [...attractions, ...attractions]" :key="index" class="carousel-item">
        <img :src="attraction.image1" alt="Attraction image" class="carousel-image" />
        <div class="overlay">{{ attraction.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 300px; /* 높이를 늘렸습니다 */
}

.carousel-track {
  display: flex;
  animation: scroll 50s linear infinite;
  height:300px;
  width:calc(500px*20);
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px; /* 너비를 늘렸습니다 */
  margin-right: 0px; /* 아이템 간의 간격을 늘렸습니다 */
  border: 1px solid #ffffff; /* 각각의 이미지-이름 쌍에 테두리를 추가했습니다 */
  border-radius:10px;
background-color: white;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 각 테두리 아이템 안의 여백을 늘렸습니다 */
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s; /* 애니메이션 효과 추가 */
}

.carousel-image {
  width: 400px;
  height: auto;
}

.attraction-name {
  margin-top: 10px; /* 이미지와 이름 사이의 간격을 늘렸습니다 */
  text-align: center;
  font-size: 18px; /* 글씨 크기를 키웠습니다 */
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6); /* 반투명 검은 배경 */
  color: white;
  font-size: 18px;
  font-weight: bold;
  opacity: 0; /* 기본 상태에서는 보이지 않도록 설정 */
  transition: opacity 0.3s;
}
.carousel-item:hover .overlay {
  opacity: 1; /* 마우스를 올리면 보이도록 설정 */
  border-radius: 10px
}

.carousel-item:hover .attraction-name {
  opacity: 1; /* 마우스를 올리면 이름 보이도록 설정 */
}
.attraction-name {
  margin-top: 10px; /* 이미지와 이름 사이의 간격을 늘렸습니다 */
  text-align: center;
  font-size: 18px; /* 글씨 크기를 키웠습니다 */
}
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* 반복된 아이템 수에 맞춰서 변경했습니다 */
  }
}
</style>
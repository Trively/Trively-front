<script setup>
import { ref, provide, onMounted } from "vue";
import MainMap from "@/components/map/MainMap.vue";
import TourList from "@/components/map/TourList.vue";
import PlanList from "@/components/map/PlanList.vue";
import { localAxios } from "@/util/http-common";
import { useRoute } from "vue-router";
import { useMapTourList } from "@/stores/mapTour";

const route = useRoute();
const local = localAxios();
const planListId = ref(route.params.planListId);
const showTourList = ref(false);
const showPlanList = ref(false);
const map = ref(null);
const { planList } = useMapTourList();
const title = ref("");
provide("map", map);
provide("showPlanList", showPlanList);
provide("title", title);
provide("planListId", planListId);

const toggleTourList = () => {
  showTourList.value = !showTourList.value;
};
const togglePlanList = () => {
  showPlanList.value = !showPlanList.value;
};

const getMyPlan = () => {
  planList.value = [];

  if (planListId.value != null) {
    local
      .get(`/plan/${planListId.value}`)
      .then((response) => {
        const data = response.data.data;
        title.value = data.title;

        // 각 계획 리스트를 반복하여 추가
        data.planLists.forEach((plan) => {
          const attractionList = plan.attractionList;
          const newTrip = {
            id: plan.planId, // 기존에는 id를 새로 생성했으나, 이 경우에는 이미 주어진 planListId를 사용
            attractionId: attractionList.attractionId,
            name: attractionList.name,
            address: attractionList.address,
            addr2: "", // addr2는 데이터에 없으므로 빈 문자열로 설정
            image1: attractionList.image1,
            sidoCode: attractionList.sidoCode,
            typeId: attractionList.typeId,
            latitude: attractionList.latitude,
            longitude: attractionList.longitude,
            date: plan.planDate, // 계획 날짜 사용
          };
          planList.value.push(newTrip);
        });

        showPlanList.value = true;
      })
      .catch((error) => {
        console.error("요청 중 오류 발생: ", error);
      });
  }
};

onMounted(() => {
  getMyPlan();
});
</script>

<template>
  <div class="map-container">
    <MainMap class="map"></MainMap>
    <button
      @click="toggleTourList"
      v-if="!showTourList"
      class="btn btn-lg btn-jittery open-button-tour btn-hover color-3"
    >
      여행지 찾기!
    </button>

    <TourList v-if="showTourList" @close="toggleTourList" class="tour-list"></TourList>

    <PlanList v-if="showPlanList" class="plan-list" @close="togglePlanList"></PlanList>
    <button
      @click="togglePlanList"
      v-if="!showPlanList"
      class="btn btn-lg btn-jittery open-button-plan btn-hover color-3"
    >
      나의 계획!
    </button>
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

.open-button-tour {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.open-button-plan {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.tour-list {
  position: absolute;
  top: 0;
  left: 0; /* 왼쪽 상단에 위치 */
  width: 500px; /* 너비 조정 가능 */
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

.plan-list {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px; /* 너비 조정 가능 */
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
  text-align: center;
  border: none;
  background-size: 300% 100%;

  border-radius: 50px;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.btn-hover:hover {
  background-position: 100% 0;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.btn-hover:focus {
  outline: none;
}

.btn-hover.color-3 {
  background-image: linear-gradient(to right, #667eea, #764ba2, #6b8dd6, #8e37d7);
  box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
}
</style>

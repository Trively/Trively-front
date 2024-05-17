<script setup>
import { ref, onMounted, onUnmounted, watch, inject } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useMapTourList } from "@/stores/mapTour";

const searchArea = ref("0");
const searchKeyword = ref("");
const selectedTypes = ref([]);
const attractionId = ref();
const lastAttractionId = ref(0);
const areas = ref([]);
const isLoading = ref(false);
const mapTourList = useMapTourList();
const { setMarkerList } = mapTourList;
const { tripList, markerList } = storeToRefs(mapTourList);
const map = ref(inject('map'));

//카테고리 조회
const ListAreas = () => {
  axios
    .get("http://localhost:80/api/board")
    .then((response) => {
      areas.value = response.data.data.boards;
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

const updateTripList = () => {
  axios
    .get(`http://localhost:80/api/attraction?typeIds=${selectedTypes.value}`, {
      params: {
        sidoCode: searchArea.value,
        search: searchKeyword.value,
        lastAttractId: attractionId.value,
      },
    })
    .then((response) => {
      Array.prototype.push.apply(tripList.value, response.data.data.attractions);
      setMarkerList();
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

const search = () => {
  markerList.value = [];
  axios
    .get(`http://localhost:80/api/attraction?typeIds=${selectedTypes.value}`, {
      params: {
        sidoCode: searchArea.value,
        search: searchKeyword.value,
        lastAttractId: attractionId.value,
      },
    })
    .then((response) => {
      tripList.value = response.data.data.attractions;
      setMarkerList();
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

watch([searchArea, searchKeyword, selectedTypes], () => {
  search();
});

const handleNotificationListScroll = (e) => {
  const { scrollHeight, scrollTop, clientHeight } = e.target;
  const isAtTheBottom = scrollHeight - (scrollTop + clientHeight) < 10; //정확도 향상을 위해 10 이하로 설정
  attractionId.value = tripList.value[tripList.value.length - 1].attractionId;

  // 일정 이상 밑으로 내려오면 함수 실행, 반복 호출을 막기위해 1초마다 스크롤 감지 후 실행
  if (isAtTheBottom && lastAttractionId.value !== attractionId.value) {
    isLoading.value = true;
    setTimeout(() => {
      handleLoadMore();
      isLoading.value = false; // 1초 후에 isLoading.value를 false로 설정
    }, 800); // 1초 지연
  }
};

// 내려오면 api 호출하여 리스트 아래에 더 추가
const handleLoadMore = () => {
  if (lastAttractionId.value !== attractionId.value) {
    lastAttractionId.value = attractionId.value;
    updateTripList();
  }
};

const moveCenter = (lat, lng) => {
  if (map.value) {
    const position = new kakao.maps.LatLng(lat, lng);
    map.value.setCenter(position);

    const marker = markerList.value.find((marker) => marker.lat === lat && marker.lng === lng);

    if (marker) {
      marker.infoWindow.visible = true;
    }
  }
};

onMounted(() => {
  ListAreas();
  updateTripList();
  window.addEventListener("resize", handleNotificationListScroll);
});

onUnmounted(() => {
  // 컴포넌트가 언마운트 되었을 때 리사이즈 이벤트 리스너를 제거합니다.
  window.removeEventListener("resize", handleNotificationListScroll);
});
</script>

<template>
  <div class="list" @scroll="handleNotificationListScroll">
    <button @click="$emit('close')" class="btn btn-sm btn-danger close-button">닫기</button>
    <div class="col-10 mx-auto">
      <div class="display-6 mb-4 text-center" role="alert"><h3>전국 관광지 정보</h3></div>
      <form class="d-flex" @submit.prevent="updateTripList" role="search">
        <select v-model="searchArea" class="form-select me-2" aria-label="Default select example">
          <option value="0" selected>지역 선택</option>
          <option v-for="area in areas" :key="area.boardId" :value="area.boardId">
            {{ area.boardName }}
          </option>
        </select>
        <input
          v-model="searchKeyword"
          class="form-control me-2"
          type="search"
          placeholder="검색어"
          aria-label="검색어"
        />
        <button
          @click="search()"
          class="btn btn-outline-dark text-nowrap"
          type="button"
          style="background-color: #001e3d; color: white"
        >
          검색
        </button>
      </form>

      <div class="row justify-content-center" style="height: 50%">
        <div class="">
          <div class="row d-flex" role="group" style="margin-top: 10px">
            <input
              type="checkbox"
              class="btn-check"
              id="search-1"
              value=""
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-1">관광지</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-2"
              value="14"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-2">문화시설</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-3"
              value="15"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-3">축제공연행사</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-4"
              value="25"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-4">여행코스</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-5"
              value="28"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-5">레포츠</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-6"
              value="32"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-6">숙박</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-7"
              value="38"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-7">쇼핑</label>
            <input
              type="checkbox"
              class="btn-check"
              id="search-8"
              value="39"
              v-model="selectedTypes"
            />
            <label class="btn btn-outline-dark col-6" for="search-8">음식점</label>
          </div>
        </div>
      </div>
      <div id="map" class="col-10 mx-auto mt-3 rounded-3" style="height: 100%"></div>
      <div class="row">
        <table v-if="tripList.length > 0" class="table table-striped m-3 mx-auto">
          <thead>
            <tr>
              <th>대표이미지</th>
              <th>관광지명</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trip in tripList"
              :key="trip.attractionId"
              @click="moveCenter(trip.longitude, trip.latitude)"
            >
              <td><img :src="trip.image1 || '/src/assets/logo.png'" width="100px" /></td>
              <td>{{ trip.name }}</td>
              <td>{{ trip.address }} {{ trip.addr2 }}</td>
            </tr>
          </tbody>
        </table>
        <div class="spinner-div" v-if="isLoading">
          <a-spin />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  height: calc(100vh - 70px);
  overflow: auto;
}

.spinner-div {
  text-align: center;
  border-radius: 4px;
}

.open-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
</style>

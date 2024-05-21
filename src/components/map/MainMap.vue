<script setup>
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
import { ref, watch, inject } from "vue";
import { useMapTourList } from "@/stores/mapTour"; // 스토어 경로에 따라 임포트 경로를 조정하세요.
import { storeToRefs } from "pinia";

const map = ref(inject("map"));
const mapTourList = useMapTourList();
const showPlanList = ref(inject("showPlanList"));
const { markerList, tripList, planList } = storeToRefs(mapTourList);

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  updateMapBounds();
};

// 지도 범위를 tripList에 맞게 설정합니다
const updateMapBounds = () => {
  if (markerList.value.length > 0) {
    const bounds = new kakao.maps.LatLngBounds();
    markerList.value.forEach((marker) => {
      bounds.extend(new kakao.maps.LatLng(marker.lat, marker.lng));
    });
    map.value.setBounds(bounds);
  }
};

const markerInfoWindowContent = (marker) => {
  return `
    <div style='min-width:250px; max-width:500px; padding:10px; background:white; border:1px solid #ccc; position: relative;'>
      <img src='${marker.infoWindow.image || "/src/assets/logo.png"}' width='100px' />
      <div>
        <strong>${marker.infoWindow.content}</strong>
      </div>
      <div class="text-muted">${marker.infoWindow.address}</div>
      <button style='position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 16px; cursor: pointer;' onclick="closeInfoWindow(${
        marker.lat
      }, ${marker.lng})">X</button>
    </div>`;
};

// InfoWindow를 닫는 함수
window.closeInfoWindow = (lat, lng) => {
  const marker = markerList.value.find((m) => m.lat === lat && m.lng === lng);
  if (marker) {
    marker.infoWindow.visible = false;
  }
};

watch([tripList, markerList], () => {
  updateMapBounds();
});
</script>

<template>
  <KakaoMap :lat="37.566826" :lng="126.9786567" @onLoadKakaoMap="onLoadKakaoMap">
    <KakaoMapMarker
      v-for="marker in markerList"
      :key="marker.infoWindow.content"
      :lat="marker.lat"
      :lng="marker.lng"
      :infoWindow="{
        content: markerInfoWindowContent(marker),
        visible: marker.infoWindow.visible,
      }"
      :clickable="true"
      @onClickKakaoMapMarker="
        () => {
          marker.infoWindow.visible = !marker.infoWindow.visible;
        }
      "
    />
  </KakaoMap>
</template>

<style scoped></style>

import { defineStore } from 'pinia'
import { ref } from "vue"

export const useMapTourList = defineStore('mapTourList',()=>  {
    // 상태
    const tripList = ref([])
    const markerList = ref([])
    const planList = ref([])

    const setMarkerList = () => {
      const newMarkers = [];
      tripList.value.forEach((trip) => {
        newMarkers.push({
          attractionId: trip.attractionId,
          planned: false,
          lat: trip.longitude,
          lng: trip.latitude,
          infoWindow: {
            content: trip.name,
            visible: false,
          },
        });
      });
      markerList.value = newMarkers;
    }

    const setPlanToMarkerList = () => {
      const newMarkers = [];
      planList.value.forEach((trip) => {
        newMarkers.push({
          attractionId: trip.attractionId,
          planned: false,
          lat: trip.longitude,
          lng: trip.latitude,
          infoWindow: {
            content: trip.name,
            visible: false,
          },
        });
      });
      markerList.value = newMarkers;
    }
  
    return { tripList, markerList, planList, setMarkerList, setPlanToMarkerList };
})
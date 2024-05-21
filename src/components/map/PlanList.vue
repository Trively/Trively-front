<script setup>
import { useMapTourList } from '@/stores/mapTour'
import draggable from 'vuedraggable'
import { useMemberStore } from "@/stores/member"

  
const memberStore = useMemberStore()
const mapTourList = useMapTourList();
const { setPlanToMarkerList } = mapTourList;
const { planList } = useMapTourList()

const removeItem = (index) => {
  planList.splice(index, 1);
  updateMarker()
}

const updateMarker = () => {
  setPlanToMarkerList()
} 

</script>

<template>
  <div>
    <button @click="$emit('close')" class="btn btn-sm btn-danger close-button">닫기</button>
    <button @click="updateMarker" 
              class="btn btn-sm btn-success remove-button">계획 마커 표시</button>

    <div class="col-10 mx-auto mb-5">
      <div class="display-6 mb-4 text-center" role="alert"><h3>나의 여행 계획</h3></div>
      <p>순서를 조정해 나만의 여행지를 계획해보세요!</p>
      <draggable
        :list="planList"
        item-key="id"
        class="list-group"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <div class="plan-item-wrapper">
            <li :key="element.id" class="plan-item" style="list-style-type: none;">
              <img :src="element.image1 || '/src/assets/logo.png'" width="100px" />
              <div>{{ element.name }}</div>
              <div>{{ element.address }} {{ element.addr2 }}</div>
              <br>
              <label for="travel-schedule">여행일정</label>
              <input type="date" class="form-control" v-model="element.date" />
              <button @click="removeItem(index)" 
              class="btn btn-sm btn-danger remove-button">x</button>
            </li>
          </div>
        </template>
      </draggable>
      <button  v-if="planList.length > 0 && memberStore.userInfo" class="btn btn-sm btn-primary btn-save">저장</button>
    </div>  
  </div>
</template>

<style scoped>
.plan-item {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
}

.plan-item-wrapper {
  position: relative;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
}

.btn-save {
  position: absolute;
  right: 50px;
}
</style>

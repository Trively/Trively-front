<script setup>
import { useMapTourList } from '@/stores/mapTour'
import draggable from 'vuedraggable'

const { planList } = useMapTourList()
// 드래그 앤 드롭 후 호출될 핸들러
// const handleDragChange = (event) => {
//   // console.log(event)
//   console.log(planList)
//   setPlanList(event)
// }
</script>

<template>
  <div>
    <button @click="$emit('close')" class="btn btn-sm btn-danger close-button">닫기</button>
    <div class="col-10 mx-auto">
      <div class="display-6 mb-4 text-center" role="alert"><h3>나의 여행 계획</h3></div>
      <draggable
        :list="planList"
        item-key="name"
        class="list-group"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <li :key="element.name" class="plan-item" style="list-style-type: none;">
            <img :src="element.image1 || '/src/assets/logo.png'" width="100px" />
            <div>{{ element.name }}</div>
            <div>{{ element.address }} {{ element.addr2 }}</div>
          </li>
        </template>
      </draggable>
    </div>  
  </div>
</template>

<style scoped>
.plan-item {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
}
</style>

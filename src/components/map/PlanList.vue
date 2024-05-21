<script setup>
import { ref, inject, onMounted } from "vue";
import { useMapTourList } from "@/stores/mapTour";
import draggable from "vuedraggable";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member";
import { useRouter } from "vue-router";

const router = useRouter();
const memberStore = useMemberStore();
const mapTourList = useMapTourList();
const { setPlanToMarkerList } = mapTourList;
const { planList } = useMapTourList();
const local = localAxios();
const planListId = ref(inject("planListId"));

const showModal = ref(false);
const title = ref(inject("title"));

const removeItem = (index) => {
  planList.splice(index, 1);
  // updateMarker();
};

const updateMarker = () => {
  setPlanToMarkerList();
};

const savePlan = () => {
  if (!title.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "제목을 입력해주세요!",
    });
    return;
  }

  const plans = planList.map((plan, index) => ({
    attractionId: plan.attractionId,
    planDate: plan.date,
    orders: index,
    open: plan.open || false,
  }));
  const payload = {
    title: title.value,
    plans,
  };

  if (planListId.value != null) {
    payload.planListId = planListId.value;
    local
      .put("/plan", payload)
      .then((response) => {
        Swal.fire({
          title: "계획이 성공적으로 저장되었습니다!",
          icon: "success",
        });
        showModal.value = false;
        router.push({ name: "myPlan" });
      })
      .catch((error) => {
        console.error("요청 중 오류 발생: ", error);
        Swal.fire({
          icon: "error",
          title: "로그인 후 다시 시도해주세요!",
        });
      });
  } else {
    local
      .post("/plan", payload)
      .then((response) => {
        Swal.fire({
          title: "계획이 성공적으로 저장되었습니다!",
          icon: "success",
        });
        showModal.value = false;
        router.push({ name: "myPlan" });
      })
      .catch((error) => {
        console.error("요청 중 오류 발생: ", error);
        Swal.fire({
          icon: "error",
          title: "로그인 후 다시 시도해주세요!",
        });
      });
  }
};

onMounted(() => {

});
</script>

<template>
  <div>
    <button @click="$emit('close')" class="btn btn-sm btn-danger close-button">닫기</button>
    <button @click="updateMarker" class="btn btn-sm btn-success remove-button">
      계획 마커 표시
    </button>

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
            <li :key="element.id" class="plan-item" style="list-style-type: none">
              <div style="color: #5a6b96">총 {{ element.planCnt }}명이 계획했어요!</div>
              <img :src="element.image1 || '/src/assets/logo.png'" width="100px" />
              <div>{{ element.name }}</div>
              <div>{{ element.address }} {{ element.addr2 }}</div>
              <br />
              <label for="travel-schedule">여행일정 공유</label>
              <input type="checkbox" v-model="element.open" />
              <input type="date" class="form-control" v-model="element.date" />
              <!-- <label for="toggle-open">공유</label> -->
              <button @click="removeItem(index)" class="btn btn-sm btn-danger remove-button">
                x
              </button>
            </li>
          </div>
        </template>
      </draggable>
      <button
        v-if="planList.length > 0 && memberStore.userInfo"
        @click="showModal = true"
        class="btn btn-sm btn-primary btn-save"
      >
        저장
      </button>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span @click="showModal = false" class="close">&times;</span>
        <h2>설레는 일정의</h2>
        <h2>제목을 지어주세요!</h2>
        <input
          type="text"
          v-model="title"
          placeholder="여행 계획 제목을 입력하세요"
          class="form-control"
        />
        <button @click="savePlan" class="btn btn-sm btn-success mt-2">저장</button>
      </div>
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>

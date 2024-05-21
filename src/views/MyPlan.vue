<script setup>
import { ref, onMounted } from "vue";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";

const local = localAxios();
const planLists = ref([]);

const getAllPlan = () => {
  local
    .get(`/planList`)
    .then((response) => {
      planLists.value = response.data.data.planAllLists;
    })
    .catch((error) => {
      console.error("검색 중 오류 발생:", error);
    });
};

const removePlan = (planId) => {
  Swal.fire({
    title: "계획을 삭제하시겠습니까?",
    text: "다시 되돌릴 수 없습니다.",
    icon: "warning",

    showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
    confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
    cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
    cancelButtonText: "취소", // cancel 버튼 텍스트 지정

    reverseButtons: true, // 버튼 순서 거꾸로
  }).then((result) => {
    // 만약 Promise리턴을 받으면,
    if (result.isConfirmed) {
      local
        .delete(`/planList/${planId}`)
        .then((response) => {
          planLists.value = planLists.value.filter((plan) => plan.planListId !== planId);
        })
        .catch((error) => {
          console.error("검색 중 오류 발생:", error);
        });
      Swal.fire("삭제가 완료되었습니다.", "", "success");
    }
  });
};

onMounted(async () => {
  getAllPlan();
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <h2 class="my-3 py-3">나의 여행 계획</h2>
            <hr />
          </div>
          <div class="col-lg-10 plan-list-container">
            <div class="plan-list">
              <div v-for="plan in planLists" :key="plan.planListId" class="plan-card mt-2">
                <button @click="removePlan(plan.planListId)" class="remove-button">x</button>
                <div class="image-container">
                  <img
                    :src="plan.mainImage || '/src/assets/logo.png'"
                    alt="Main Image"
                    class="plan-image"
                  />
                </div>
                <div class="plan-title">{{ plan.title }}</div>
                <div class="overlay">
                  <span class="details">상세보기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plan-list-container {
  max-height: 80vh; /* 컨테이너 높이 설정 */
  overflow-y: auto; /* y 축 스크롤 활성화 */
}

.container {
  max-width: 1200px;
  margin: 16px auto;
}

.col-lg-10 {
  max-width: 100%;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

.plan-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.plan-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  flex: 1 1 calc(25% - 40px); /* 카드가 4개씩 배치되도록 설정 */
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  max-width: 300px;
  min-height: 300px; /* 카드의 최소 높이를 설정하여 세로로 길게 보이도록 함 */
  display: flex;
  flex-direction: column; /* 세로로 내용 정렬 */
  justify-content: space-between;
  position: relative; /* 상대 위치 설정 */
  overflow: hidden; /* 오버플로우 숨김 */
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s; /* 애니메이션 효과 추가 */
}

.plan-card:hover {
  transform: translateY(-10px); /* 마우스를 올리면 살짝 위로 이동 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 그림자 강화 */
  background-color: rgba(0, 0, 0, 0.6); /* 배경 어두워짐 */
}

.plan-card:hover .overlay,
.plan-card:hover .remove-button {
  opacity: 1; /* 마우스를 올리면 오버레이와 x 버튼이 보이도록 설정 */
}

.plan-card:hover .image-container {
  opacity: 0.3;
}

.image-container {
  width: 100%;
  height: 200px; /* 이미지 컨테이너의 높이 설정 */
  overflow: hidden; /* 이미지가 컨테이너를 넘치지 않도록 함 */
  position: relative; /* 상대 위치 설정 */
}

.plan-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 컨테이너를 가득 채우도록 함 */
  border-radius: 10px 10px 0 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s; /* 애니메이션 효과 추가 */
}

.details {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.plan-title {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  /* color: white; 마우스를 올렸을 때도 잘 보이도록 흰색으로 설정 */
}

.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: background 0.3s, opacity 0.3s;
  z-index: 2;
  opacity: 0; /* 기본 상태에서는 보이지 않도록 설정 */
}

.remove-button:hover {
  background: darkred;
}
</style>

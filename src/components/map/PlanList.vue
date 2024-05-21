<script setup>
import { ref, inject, onMounted, watch } from "vue";
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
const id = ref(0)
const nickname = ref("")
const showModal = ref(false);
const showReplyModal = ref(false);
const MAX_CONTENT_LENGTH = 255;
const currentContentLength = ref(0);
const title = ref(inject("title"));
const message = ref({
    content: "",
});
const showRecommendationModal = ref(false);
const recommendationList = ref([]);
const selectedElement = ref(null);
const contentErrMsg = ref("");

const checkContentLength = () => {
    if (message.value.content.length > MAX_CONTENT_LENGTH) {
        contentErrMsg.value = `내용은 ${MAX_CONTENT_LENGTH}자를 넘을 수 없습니다.`;
    } else {
        contentErrMsg.value = ""; // 오류 메시지 초기화
    }
};

const removeItem = (index) => {
  planList.splice(index, 1);
  // updateMarker();
};

const openReplyModal = (member) => {
    id.value = member.memberId;
    nickname.value = member.nickname;
    showReplyModal.value = true;
};

const closeReplyModal = () => {
    showReplyModal.value = false;
    message.value.content = "";
};

const confirmSend = () => {
    if (message.value.content.trim() === "") {
        contentErrMsg.value = "내용을 입력해주세요!";
        return;
    }
    checkContentLength();
    if(contentErrMsg.value){
      return;
    }
    local
        .post(`/message/${id.value}`, {
            content: message.value.content,
        })
        .then((response) => {
          Swal.fire({
          title: "쪽지를 보냈습니다!",
          icon: "success",
          });
          closeReplyModal();
        })
        .catch((error) => {
            console.error("전송 중 오류 발생: ", error);
        });
};

watch(showReplyModal, (newVal) => {
    if (!newVal) {
        message.value.content = "";
    }
});

watch(() => message.value.content, (newVal) => {
  currentContentLength.value = newVal.length;
  checkContentLength();
});

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

const openRecommendationModal = (element) => {
  selectedElement.value = element;
  if (!element.date) {
    Swal.fire({
      icon: "warning",
      title: "날짜를 입력하세요!",
    });
    return;
  }
  fetchRecommendations(element.attractionId, element.date);
};

const fetchRecommendations = async (attractionId, date) => {
  try {
    const response = await local.get(`/plan/message?attractionId=${attractionId}&date=${date}`);
    if (response.data.success) {
      recommendationList.value = response.data.data.members;
      if (recommendationList.value.length === 0) {
        Swal.fire({
          icon: "info",
          title: "친구를 찾지 못했어요ㅠㅠ",
        });
      } else {
        showRecommendationModal.value = true;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "추천친구 조회에 실패했습니다.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "요청 중 오류 발생",
      text: error.message,
    });
  }
};

onMounted(() => {
});
</script>

<template>
  <div class="overlay-container">
    <div class="modal-overlay" v-if="showReplyModal">
      <div class="modal-container">
        <div class="modal-header"> 
          <h2 class="modal-title">To. {{nickname}}님</h2>
          <button @click="closeReplyModal" class="close-reply-button">x</button>
        </div>
        <div class="modal-body">
          <textarea v-model="message.content" placeholder="메시지를 입력하세요"></textarea>
          <div class="char-count">{{ currentContentLength }}/255</div>
          <div v-if="contentErrMsg" class="error-msg">{{ contentErrMsg }}</div>
        </div>
        <div class="modal-footer">
          <button @click="confirmSend" class="btn-reply">전송</button>
        </div>
      </div>
    </div>
    <div v-if="showRecommendationModal" class="modal">
      <div class="modal-content">
        <span @click="showRecommendationModal = false" class="close">&times;</span>
        <h2>여행메이트 추천!</h2>
        <p>나와 비슷한 시기에 같은 곳을 여행하는 사람들이에요.</p>
        <div v-if="recommendationList.length === 0">친구를 찾지 못했어요ㅠㅠ</div>
        <div v-else>
          <div v-for="member in recommendationList" :key="member.memberId" class="recommendation-item">
            <img src="@/assets/user_icon.png" alt="avatar" class="avatar"/>
            <div class="nickname">{{ member.nickname }}</div>
            <button class="btn btn-sm btn-primary custom-message-button" @click="openReplyModal(member)">쪽지 보내기</button>
          </div>
        </div>
      </div>
    </div>
    <div class="plan-container">
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
          <template #item="{ element, index }">
            <div class="plan-item-wrapper">
              <li :key="element.id" class="plan-item" style="list-style-type: none">
                <div style="color: #5a6b96">총 {{ element.planCnt }}명이 계획했어요!</div>
                <img :src="element.image1 || '/src/assets/logo.png'" width="100px" />
                <div>{{ element.name }}</div>
                <div>{{ element.address }} {{ element.addr2 }}</div>
                <br />
                <label for="travel-schedule">여행일정 공유</label>
                <input type="checkbox" v-model="element.open" />
                <button @click="openRecommendationModal(element)" class="btn btn-sm btn-info btn-message">
                  <img src="@/assets/heart-message.png" width="35px" height="23px" alt="Send Message" class="message-icon" />
                </button>
                <input type="date" class="form-control" v-model="element.date" />
                <button @click="removeItem(index)" class="btn btn-sm btn-danger remove-button">x</button>
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
  </div>
</template>

<style scoped>
.overlay-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px; /* Adjust the width as needed */
  height: 100%;
  z-index: 1000; /* Ensure this is higher than the map's z-index */
  background-color: rgba(255, 255, 255, 0.9); /* Optional: semi-transparent background */
  overflow-y: auto; /* Allow scrolling if content overflows */
}

.plan-container {
  padding: 10px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

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
  margin-top: 10px;
  float: right;
  margin-left: 10px;
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
.modal-content p {
  font-size: 0.87em; /* Reduce the font size */
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.recommendation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.nickname {
  flex: 1; /* Adjust the flex property as needed */
  text-align: left;
}
.custom-message-button {
  background-color: #7685b5; /* Change this to the desired color */
  border-color: #7685b5;
  color: white; /* Ensure the text color is readable */
}
.custom-message-button:hover {
  background-color: #5a6b96; /* Slightly darker shade for hover state */
  border-color: #5a6b96; /* Ensure the border color matches the background */
}
.btn-message{
  border:none;
  background-color: transparent;
  float: right;
}
.btn-message:hover{
  background-color: #7685b5;
}
/* reply Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background: white;
  padding: 2em;
  border-radius: 5px;
  width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between; /* 헤더 내 요소들을 좌우 정렬 */
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.2em;
}

.close-reply-button {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}

.modal-body {
  margin-top: 1em;
  text-align: center;
}

.modal-body textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 1em;
  padding: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.modal-footer {
  display: flex;
  justify-content: center; /* 푸터 내 요소들을 가운데 정렬 */
}
.btn-reply{
  padding: 10px 20px;
  background-color: #7685b5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-reply:hover{
  background-color: #5a6b96;
}
.error-msg {
  color: rgb(223, 123, 123);
  margin-bottom: 1em;
}
</style>

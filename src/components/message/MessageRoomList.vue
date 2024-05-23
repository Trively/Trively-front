<template>
  <div class="outer-container">
    <div class="container">
      <!-- Room List -->
      <div class="room-list">
        <h4 class="title">쪽지 목록</h4>
        <ul>
          <li v-for="room in rooms" :key="room.roomId" class="room-item" @click="selectRoom(room.roomId)">
            <h3>{{ room.nickname }}</h3>
            <p v-text="truncateRecentContent(room.recentContent, 15)"></p>
            <small>{{ new Date(room.recentDateTime).toLocaleString() }}</small>
          </li>
        </ul>
      </div>

      <!-- Message Room -->
      <div class="message-room" v-show="showDetail">
        <div class="header">
          <div class="left">
            <h4>{{ selectedRoomNickname }}님과의 쪽지
              <img src="@/assets/plane.png" class="header-image">
            </h4>
            <button @click="openPlanList" class="plan-button">여행계획 공유하기</button>
          </div>
          <div class="right">
            <button class="reply-button" @click="openReplyModal">답장하기</button>
            <button class="h-close-button" @click="closeDetail">닫기</button>
          </div>
        </div>
        <div class="messages">
          <div v-for="message in messages" :key="message.messageId" :class="{'message-sent': message.sender, 'message-received': !message.sender, 'with-plan-list': message.planlistId}" @mouseover="toggleOverlay(true)" @mouseleave="toggleOverlay(false)">

            <template v-if="message.planlistId">
              <!-- 여기에 여행계획 카드 넣기-->
              <div class="col-lg-10 plan-list-container">
                <div class="plan-list" @click="goToDetail(message.planlistId, isShare)">
                  <p><{{ message.title}}></p> 
                  <p> 공유된 여행계획을 확인해보세요.</p>
                  <div class="image-container">
                    <img :src="message.imageUrl" alt="Main Image" class="plan-image small-image"/>
                    <div class="overlay" v-show="showOverlay">상세보기</div>
                  </div>
                  
                </div>
              </div>
            </template>
            <template v-else>
              <p>{{ message.content }}</p>
              <small>{{ message.createdAt }}</small>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">To. {{selectedRoomNickname}}님</h2>
          <button @click="closeModal" class="close-button">x</button>
        </div>
        <div class="modal-body">
          <textarea v-model="message.content" placeholder="메시지를 입력하세요"></textarea>
          <div class="char-count">{{ currentContentLength }}/255</div>
          <div v-if="contentErrMsg" class="error-msg">{{ contentErrMsg }}</div>
        </div>
        <div class="modal-footer">
          <button @click="confirmSend" class="btn">전송</button>
        </div>
      </div>
    </div>
    <!-- Plan List Modal -->
    <div v-if="showPlanListModal" class="modal">
      <div class="modal-content">
        <span @click="showPlanListModal = false" class="close">&times;</span>
        <h2>여행계획을 공유해보세요!</h2>
        <div v-if="planList.length === 0">계획이 아직 없어요ㅠㅠ</div>
        <div v-else>
          <div v-for="plan in planList" :key="plan.planListId" class="recommendation-item">
            <div>{{ plan.title }}</div>
            <button @click="sendMyPlan(plan.planListId)" class="btn btn-sm btn-primary custom-message-button">공유하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import defaultLogo from "@/assets/logo.png"; // Import the default logo image
const showOverlay = ref(false);
const router = useRouter();
const local = localAxios();
const showDetail = ref(false);
const roomId = ref(null);
const messages = ref([]);
const rooms = ref([]);
const showModal = ref(false);
const showPlanListModal = ref(false);
const planList = ref([]);
const message = ref({
  content: "",
});
const toggleOverlay = (value) => {
  showOverlay.value = value;
};
const contentErrMsg = ref("");
const MAX_CONTENT_LENGTH = 255;
const currentContentLength = ref(0);

const checkContentLength = () => {
  if (message.value.content.length > MAX_CONTENT_LENGTH) {
    contentErrMsg.value = `내용은 ${MAX_CONTENT_LENGTH}자를 넘을 수 없습니다.`;
  } else {
    contentErrMsg.value = "";
  }
};

const truncateRecentContent = (content, maxLength) => {
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + "...더보기";
  }
  return content;
};

const fetchMessages = async () => {
  try {
    const response = await local.get(`/message/${roomId.value}`);
    const messagesData = response.data.data.messages;
    const messagesWithImagesAndTitles = await Promise.all(
      messagesData.map(async (message) => {
        if (message.planlistId) {
          const { imageUrl, title } = await getFirstAttractionImage(message.planlistId);
          return { ...message, imageUrl, title }; // title 추가
        }
        return message;
      })
    );
    messages.value = messagesWithImagesAndTitles;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};


const goToDetail = (planListId, isShare) => {
  router.push({ name: "sharePlan", params: { planListId: planListId, isShare: true } });
};

const fetchRooms = async () => {
  try {
    const response = await local.get('/message');
    const fetchedRooms = response.data.data.rooms.map(room => ({
      ...room,
      recentContent: truncateRecentContent(room.recentContent, 50)
    }));
    rooms.value = fetchedRooms;
  } catch (error) {
    console.error("Error fetching message rooms:", error);
  }
};

const sendMyPlan = (planListId) => {
  local
    .post(`/message/room/${roomId.value}`, {
      content: "",
      planlistId: planListId,
    })
    .then((response) => {
      Swal.fire({
        title: "쪽지를 보냈습니다!",
        icon: "success",
      });
      closeModal();
      fetchMessages();
    })
    .catch((error) => {
      console.error("전송 중 오류 발생: ", error);
    });
};

const getFirstAttractionImage = async (planListId) => {
  try {
    const response = await local.get(`/plan/${planListId}`);
    if (response.data.success) {
      const plan = response.data.data;
      const firstAttraction = plan.planLists[0].attractionList;
      const imageUrl = firstAttraction.image1 || defaultLogo;
      return { imageUrl, title: plan.title }; // title 추가
    } else {
      console.error("Error fetching attraction image:", response.data.message);
      return { imageUrl: defaultLogo, title: "Unknown" };
    }
  } catch (error) {
    console.error("Error fetching attraction image:", error);
    return { imageUrl: defaultLogo, title: "Unknown" };
  }
};


const openPlanList = async () => {
  try {
    const response = await local.get(`/planList`);
    if (response.data.success) {
      planList.value = response.data.data.planAllLists;
      if (planList.value.length === 0) {
        Swal.fire({
          icon: "info",
          title: "공유할 수 있는 계획이 없어요!",
        });
      } else {
        showPlanListModal.value = true;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "여행계획 목록 조회에 실패했습니다.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "여행계획 목록 조회에 실패했습니다.",
    });
  }
};

const selectedRoomNickname = ref("");

const selectRoom = (id) => {
  roomId.value = id;
  const selectedRoom = rooms.value.find(room => room.roomId === id);
  selectedRoomNickname.value = selectedRoom ? selectedRoom.nickname : "";
  showDetail.value = true;
  fetchMessages();
};

const closeDetail = () => {
  showDetail.value = false;
  messages.value = [];
};

const openReplyModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  message.value.content = "";
};

const confirmSend = () => {
  if (message.value.content.trim() === "") {
    contentErrMsg.value = "메시지 내용을 입력해주세요.";
    return;
  }
  local
    .post(`/message/room/${roomId.value}`, {
      content: message.value.content,
    })
    .then((response) => {
      Swal.fire({
        title: "쪽지를 보냈습니다!",
        icon: "success",
      });
      closeModal();
      fetchMessages();
    })
    .catch((error) => {
      console.error("전송 중 오류 발생: ", error);
    });
};

onMounted(() => {
  fetchRooms();
});

watch(
  () => message.value.content,
  (newValue) => {
    currentContentLength.value = newValue.length;
    checkContentLength();
  }
);
</script>

<style scoped>
/* Styles for the modal and the rest of the page */
/* Styles for the modal and the rest of the page */

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 500px;
  max-width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: row;
  margin: 20px;
  height: 80vh;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.room-list {
  width: 30%;
  padding: 20px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.room-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.room-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #d5dcf5;
  display: flex;
  flex-direction: column;
}

.room-item:hover {
  background-color: #f9f9f9;
}

.room-item h3 {
  margin: 0 0 5px 0;
  font-size: 1.1em;
}

.room-item p {
  margin: 0 0 5px 0;
  font-size: 0.9em;
  color: #555;
}

.message-room {
  width: 70%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 80vh;
  scrollbar-width: none;
}
.header-image {
  width: 40px; /* Adjust the width as needed */
  height: auto; /* Maintain aspect ratio */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left {
  flex: 1;
}

.right {
  display: flex;
}

.h-close-button,
.reply-button,
.plan-button {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.h-close-button, .plan-button {
  background-color: #b6cfea;
  color: #fff;
}

.messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  max-height: 70vh;
}

.message-sent {
  align-self: flex-end;
  background-color: #d5dcf5;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 80%;
}

.message-received {
  align-self: flex-start;
  background-color: #d6d8e2;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 80%;
}

.message-room p {
  margin: 0;
  word-wrap: break-word;
}

.message-room small {
  font-size: 0.8em;
  color: #999;
  display: block;
  margin-top: 5px;
}

.reply-button{
  background-color: #7685b5;
  color: #fff;
}

.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 400px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
}

.char-count {
  text-align: right;
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
}

.error-msg {
  color: rgb(255, 167, 167);
  font-size: 0.9em;
  margin-top: 5px;
}

.modal-footer {
  text-align: right;
}

.btn {
  background-color: #7685b5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #5a6b96;
}

.plan-list-container {
  margin-bottom: 10px;
  
}


.plan-image {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-container .overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  transform: translate(-50%, -50%);
}

.image-container:hover .overlay {
  opacity: 1;
  visibility: visible;
}
.message-sent.with-plan-list,
.message-received.with-plan-list {
  position: relative;
}

.message-sent.with-plan-list:hover,
.message-received.with-plan-list:hover {
  background-color: #f0f0f0; /* 배경 어둡게 설정 */
}

.message-sent.with-plan-list:hover .overlay,
.message-received.with-plan-list:hover .overlay {
  opacity: 1;
  visibility: visible;
}
.overlay {
  white-space: nowrap; /* 텍스트가 한 줄로만 표시되도록 설정 */
  position: absolute;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  transform: translate(-50%, -50%);
}
.custom-message-button {
  padding: 5px 10px; /* 버튼의 패딩 크기를 줄여서 크기를 작게 만듭니다 */
  font-size: 0.8em; /* 폰트 크기를 줄여서 버튼 크기를 더 작게 만듭니다 */
  background-color: #7685b5;
}
.reply-button:hover{
  background-color: #5a6b96; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트색 변경 */
}
.h-close-button:hover{
  background-color: #5a6b96; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트색 변경 */
}
.plan-button:hover{
  background-color: #5a6b96; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트색 변경 */
}
.recommendation-item div {
  font-size: 1.1em; /* 원하는 크기로 조절하세요 */
}
</style>
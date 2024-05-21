<template>
    <div class="outer-container">
        <div class="container">
          
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
            <div class="message-room" v-show="showDetail">
                <div class="header">
                  <div class="left">
                    <h4>{{selectedRoomNickname}}님과의 쪽지
                      <img src="@/assets/plane.png" class="header-image">
                    </h4>
                    
                  </div>
                  <div class="right">
                    <button class="reply-button" @click="openReplyModal">답장하기</button>
                    <button class = "h-close-button"@click="closeDetail">닫기</button>
                  </div>
                </div>
                <div class="messages">
                    <div v-for="message in messages" :key="message.messageId" :class="{'message-sent': message.sender, 'message-received': !message.sender}">
                        <p>{{ message.content }}</p>
                        <small>{{ message.createdAt }}</small>
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
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
const local = localAxios();
const showDetail = ref(false);
const roomId = ref(null);
const messages = ref([]);
const rooms = ref([]);
const showModal = ref(false);
const message = ref({
    content: "",
});
const contentErrMsg = ref("");
const MAX_CONTENT_LENGTH = 255;
const currentContentLength = ref(0);
// 텍스트 입력 길이 확인 및 오류 메시지 표시 함수
const checkContentLength = () => {
    if (message.value.content.length > MAX_CONTENT_LENGTH) {
        contentErrMsg.value = `내용은 ${MAX_CONTENT_LENGTH}자를 넘을 수 없습니다.`;
    } else {
        contentErrMsg.value = ""; // 오류 메시지 초기화
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
        messages.value = response.data.data.messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

const fetchRooms = async () => {
  try {
    const response = await local.get('/message');
    const fetchedRooms = response.data.data.rooms.map(room => ({
      ...room,
      recentContent: truncateRecentContent(room.recentContent, 50) // recentContent를 50자까지 자르고 "..."으로 대체
    }));
    rooms.value = fetchedRooms;
  } catch (error) {
    console.error("Error fetching message rooms:", error);
  }
};

// 선택된 방의 nickname을 저장할 변수 추가
const selectedRoomNickname = ref("");

const selectRoom = (id) => {
    roomId.value = id;
    // 선택된 방의 nickname을 할당
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
        contentErrMsg.value = "내용을 입력해주세요!";
        return;
    }
    checkContentLength();
    if(contentErrMsg.value){
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
// showModal 값이 변경될 때마다 message 초기화
watch(showModal, (newVal) => {
    if (!newVal) {
        message.value.content = "";
    }
});

// message.value.content가 변경될 때마다 currentContentLength 업데이트
watch(() => message.value.content, (newVal) => {
  currentContentLength.value = newVal.length;
  checkContentLength();
});
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
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
  flex-direction: column; /* 제목과 내용을 세로로 배치하기 위해 추가 */
}

.room-item:hover {
  background-color: #f9f9f9;
}

.room-item h3 {
  margin: 0 0 5px 0;
  font-size: 1.1em;
  top: 0;

  z-index: 1;
  padding: 15px;
}


.room-item p {
  margin: 0 0 5px 0;
  font-size: 0.9em;
  color: #555;
  
  max-height: 200px; /* 내용 영역 최대 높이 설정 */

}

.message-room {
  width: 70%;
  padding: 20px;
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
.reply-button {
  padding: 5px 10px; /* 공통으로 사용할 패딩 값 */
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}
.h-close-button {
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
.reply-button {
  background-color: #7685b5;
  color: white;

}.header-image {
    height: 1em; /* 이미지의 높이 설정 */
    width: auto; /* 이미지의 너비를 자동으로 조정하여 비율 유지 */
    margin-right: 5px; /* 이미지와 텍스트 사이의 간격 조정 */
}

.reply-button:hover {
  background-color: #5a6b96;
}

/* Modal styles */
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

.close-button {
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

.btn {
  padding: 10px 20px;
  background-color: #7685b5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #5a6b96;
}


.error-msg {
  color: rgb(223, 123, 123);
  margin-bottom: 1em;
}
</style>
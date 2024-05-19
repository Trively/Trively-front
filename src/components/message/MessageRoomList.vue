<template>
    <div class="outer-container">
        <div class="container">
            <div class="room-list">
                <h3 class="title">쪽지 목록</h3>
                <ul>
                    <li v-for="room in rooms" :key="room.roomId" class="room-item" @click="selectRoom(room.roomId)">
                        <h3>{{ room.nickname }}</h3>
                        <p>{{ room.recentContent }}</p>
                        <small>{{ new Date(room.recentDateTime).toLocaleString() }}</small>
                    </li>
                </ul>
            </div>
            <div class="message-room" v-show="showDetail">
                <div class="header">
                    <button @click="closeDetail">닫기</button>
                </div>
                <div class="messages">
                    <div v-for="message in messages" :key="message.messageId" :class="{'message-sent': message.sender, 'message-received': !message.sender}">
                        <p>{{ message.content }}</p>
                        <small>{{ message.createdAt }}</small>
                    </div>
                </div>
                <button class="reply-button" @click="openReplyModal">답장하기</button>
            </div>
        </div>
        <div class="modal-overlay" v-if="showModal">
            <div class="modal-container">
                <div class="modal-header"> 
                    <h2 class="modal-title">쪽지</h2>
                    <button @click="closeModal" class="close-button">x</button>
                </div>
                <div class="modal-body">
                    <textarea v-model="message.content" placeholder="메시지를 입력하세요"></textarea>
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
        rooms.value = response.data.data.rooms;
    } catch (error) {
        console.error("Error fetching message rooms:", error);
    }
};

const selectRoom = (id) => {
    roomId.value = id;
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
    local
        .post(`/message/room/${roomId.value}`, {
            content: message.value.content,
        })
        .then(() => {
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
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #d5dcf5;
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

.room-item small {
  font-size: 0.8em;
  color: #999;
}

.message-room {
  width: 70%;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.header button {
  padding: 5px 10px;
  background-color: #b6cfea;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 60vh;
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
}

.message-room small {
  font-size: 0.8em;
  color: #999;
  display: block;
  margin-top: 5px;
}
.reply-button {
  margin-top: 20px; /* 이전 위치 지정 제거 */
  padding: 10px 20px;
  background-color: #7685b5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* 요소의 위치를 고정 */
  bottom: 70px; /* 하단 여백 조정 */
  left: 60%; /* 가운데 정렬을 위한 왼쪽 위치 조정 */
  transform: translateX(-50%); /* 가운데 정렬을 위한 가로 위치 조정 */
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
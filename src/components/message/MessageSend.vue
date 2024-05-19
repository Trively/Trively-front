<script setup>
import { localAxios } from "@/util/http-common";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const local = localAxios();
const router = useRouter();
const route = useRoute();

const message = ref({
    content: "",
});
const contentErrMsg = ref("");
const showModal = ref(false);

// 상대방 ID 받아오기
const memberId = route.params.memberId;

const sendMessage = () => {
    if (message.value.content.trim() == "") {
        contentErrMsg.value = "내용을 입력해주세요!";
        return;
    }
    showModal.value = true;
};

const confirmSend = () => {
    local
        .post(`/message/${memberId}`, {
            content: message.value.content,
        })
        .then(() => {
            moveList();
        })
        .catch((error) => {
            console.error("전송 중 오류 발생: ", error);
        });
    showModal.value = false;
};

const moveList = () => {
    router.push({ name: 'messageRoomList' });
};

const closeModal = () => {
    showModal.value = false;
};
</script>

<template>
<div class="message-send-container">
    <div class="logo-container">
        <img class="mb-4" src="@/assets/bloom-messages.png" alt="logo">
    </div>
    <h3 class="message-title">쪽지</h3>
    <textarea v-model="message.content" placeholder="메시지를 입력하세요"></textarea>
    <div v-if="contentErrMsg" class="error-msg">{{ contentErrMsg }}</div>
    <div class="buttons">
        <button @click="sendMessage" class="btn w-100 py-2">전송</button>
        <button @click="moveList" class="btn w-100 py-2">취소</button>
    </div>

    <div class="modal-overlay" v-if="showModal">
        <div class="modal-container">
            <div class="modal-header">
                <button @click="closeModal" class="close-button">x</button>
            </div>
            <div class="modal-body">
                <p>전송하시겠습니까?</p>
            </div>
            <div class="modal-footer">
                <button @click="confirmSend" class="btn">확인</button>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.message-send-container {
    width: 90%;
    max-width: 800px;
    height: 100%;
    max-height: 700px;
    margin: 30px auto;
    background-color: white;
    padding: 2em;
    border-radius: 30px;
    box-shadow: -10px -10px 15px rgba(212, 212, 212, 0.12),
        10px 10px 15px rgba(186, 186, 186, 0.12);
    display: flex;
    text-align: center;
    flex-direction: column;
}
.logo {
    height: 60px;
    width: 60px;
}
.message-title {
    width: 100%;
    text-align: center;
    margin-bottom: 1em;
}
textarea {
    width: 100%;
    height: 400px;
    margin-bottom: 1em;
    padding: 1em;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
img {
    height: 120px;
    width: 120px;
    margin: 10px auto;
}
.buttons {
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
}
.btn {
    margin-top: 10px;
    background-color: #7685b5;
    color: white;
}
button:first-of-type {
    background-color: #7685b5;
    color: white;
}
button:last-of-type {
    background-color: #7685b5;
    color: white;
}
.error-msg {
    color: rgb(223, 123, 123);
    margin-bottom: 1em;
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
    padding: 1em;
    border-radius: 5px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
}
.modal-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
.modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 1em;
}
</style>

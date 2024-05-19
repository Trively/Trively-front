<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localAxios } from "@/util/http-common";

const route = useRoute();
const router = useRouter();
const local = localAxios();

const messages = ref([]);
const roomId = ref(route.params.roomId);

const fetchMessages = async () => {
    try {
        const response = await local.get(`/message/${roomId.value}`);
        messages.value = response.data.data.messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

const replyMessage = () => {
    router.push({ name: 'messageSend', params: { roomId: roomId.value } });
};

watch(() => route.params.roomId, (newRoomId) => {
    roomId.value = newRoomId;
    fetchMessages();
});

onMounted(fetchMessages);
</script>

<template>
    <div class="message-room">
        <div class="header">
            <button @click="replyMessage">답장</button>
        </div>
        <div class="messages">
            <div v-for="message in messages" :key="message.messageId" :class="{'message-sent': message.sender, 'message-received': !message.sender}">
                <p>{{ message.content }}</p>
                <small>{{ message.createdAt }}</small>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-room {
    width: 70%;
    padding: 10px;
}
.header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}
.messages {
    display: flex;
    flex-direction: column;
}
.message-sent {
    align-self: flex-end;
    background-color: #d1ffd1;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
}
.message-received {
    align-self: flex-start;
    background-color: #ffd1d1;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
}
</style>

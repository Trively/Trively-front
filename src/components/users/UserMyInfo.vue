<script setup>
import { ref, onMounted } from 'vue';
import { localAxios } from '@/util/http-common';

const local = localAxios();

const userData = ref({
  id: '',
  password: '',
  email: '',
  nickname: '',
});

const fetchUserInfo = async () => {
  try {
    const response = await local.get(`/member/info`);
    userData.value = {
      id: response.data.userInfo.id,
      password: response.data.userInfo.password,
      email: response.data.userInfo.email,
      nickname: response.data.userInfo.nickname,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

const updateUserInfo = async () => {
  if (confirm('정보를 수정하시겠습니까?')) {
    try {
      await local.put('/member/edit', {
        id: userData.value.id,
        password: userData.value.password,
        email: userData.value.email,
        nickname: userData.value.nickname,
      });
      alert('정보가 수정되었습니다.');
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  }
};

const showMessageId = ref(false); // 아이디 변경 메시지
const showMessageEmail = ref(false); // 이메일 변경 메시지

const showNotificationId = () => {
    showMessageId.value = true;
    setTimeout(() => {
    showMessageId.value = false; // 일정 시간이 지난 후 메시지 감춤
  }, 1500);
};

const showNotificationEmail = () => {
    showMessageEmail.value = true;
    setTimeout(() => {
    showMessageEmail.value = false; // 일정 시간이 지난 후 메시지 감춤
  }, 1500);
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="container">
    <!-- <div class="title">
      <h3>내 정보 수정</h3>
    </div> -->
    <form @submit.prevent="updateUserInfo">
      <div class="form-group">
        <label for="id">아이디</label>
        <div class="input-container">
          <input type="text" id="id" v-model="userData.id" readonly class="form-control" @click="showNotificationId()" />
          <span class="message" v-show="showMessageId">아이디는 변경할 수 없습니다!</span>
        </div>
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="userData.password" class="form-control" />
      </div>
      <div class="form-group">
        <label for="email">이메일</label>
        <div class="input-container">
          <input type="email" id="email" v-model="userData.email" readonly class="form-control" @click="showNotificationEmail()" />
          <span class="message" v-show="showMessageEmail">이메일은 변경할 수 없습니다!</span>
        </div>
      </div>
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="userData.nickname" class="form-control" />
      </div>
      <button type="submit" class="btn">저장</button>
    </form>
  </div>
</template>

<style scoped>
/* 스타일링 */
.input-container {
  position: relative;
}
.title{
    text-align: center;
    margin-bottom: 20px;
}
.message {
  position: absolute;
  top: 100%;
  left: 0;
  color: rgb(253, 108, 108);
  font-size: 12px;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #7685b5;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5a6b96;
  color: white;
}
</style>

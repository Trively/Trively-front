<script setup>
import { ref, onMounted } from 'vue';
import { localAxios } from '@/util/http-common';
import { useRouter } from "vue-router"
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member";
const local = localAxios();
const router = useRouter();
const memberStore = useMemberStore();
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
   
      await local.put('/member/edit', {
        id: userData.value.id,
        password: userData.value.password,
        email: userData.value.email,
        nickname: userData.value.nickname,
      }).then((response) => {
        Swal.fire({
          title : "정보가 수정되었습니다!",
          icon : "success",
        });
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
      });
      
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
const signOut = async () => {
  const result = await Swal.fire({
    title: '정말 탈퇴하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
  });

  if (result.isConfirmed) {
    try {
      await local.delete('/member/bye');
      Swal.fire({
        title: '탈퇴되었습니다.',
        icon: 'success',
      });
      memberStore.userLogout();
      router.push({ name: "login" });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
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
      <button type="button" @click="signOut" class="btn btn-bye">탈퇴</button>
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
.btn-bye{
  margin-left: 20px;
  background-color: rgb(215, 89, 89);
}
.btn-bye:hover{
  background-color: #ff0000;
  color: white;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

</style>

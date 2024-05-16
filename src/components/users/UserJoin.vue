<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"

const { VITE_MEMBER_BASE_URL } = import.meta.env

const router = useRouter();

const id = ref('')
const password = ref('')
const email = ref('')
const nickname = ref('')

const successModal = ref(false); // 모달 표시 상태 변수
const errorModal = ref(false); // 항목 미입력 모달 표시 상태 변수

const userRegist = () => {
    // 입력 필드가 비어 있는지 확인
    if (!id.value || !password.value || !email.value || !nickname.value) {
        errorModal.value = true; // 에러 모달 표시
        return; // 회원가입 함수 종료
    }
    axios.post("http://localhost:80/api/member/join", { id: id.value, password: password.value, email: email.value, nickname: nickname.value })
        .then(response => {
            successModal.value = true; // 회원가입 성공 시 상태 변수 설정
        })
        .catch(error => {
        console.log('Error 발생: ', error)
    })
}

const closeModal = (modalType) => {
    if (modalType === 'error') {
        errorModal.value = false; // 에러 모달 닫기
    } else if (modalType === 'success') {
        successModal.value = false; // 회원가입 성공 모달 닫기
        router.push({ name: 'login' }); // 로그인 페이지로 리다이렉트
    }
}

</script>

<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <div class="main">
        <form>
            <div class="logo-container">
                <img class="mb-4" src="@/assets/logo.png" width="200">
            </div>
            <h1 class="h3 mb-3 fw-normal">회원가입</h1>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="ID" v-model="id">
                <label for="floatingInput">아이디</label>
                <!-- <div v-if="isExistingId" class="form-text text-danger">이미 존재하는 아이디거나 불가능한 아이디 입니다.</div> -->
            </div>

            <div class="form-floating mb-3">
                <input type="password" class="form-control" placeholder="PW" v-model="password" >
                <label for="floatingInput">비밀번호</label>
            </div>

            <div class="form-floating mb-3">
                <input type="email" class="form-control" placeholder="Email" v-model="email">
                <label for="floatingInput">이메일</label>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="Name" v-model="nickname"> 
                <label for="floatingInput">닉네임</label>
            </div>

            <button type="button" @click="userRegist" class="btn w-100 py-2">회원가입</button>
            <!-- 에러 모달 -->
            <div class="modal" :class="{ 'is-active': errorModal }">
                <div class="modal-background" @click="()=>closeModal('error')"></div>
                <div class="modal-content">
                    <div class="box">
                        <p>항목을 모두 입력하세요.</p>
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close" @click="()=>closeModal('error')"></button>
            </div>

        </form>

        <!-- 모달 -->
        <div class="modal" :class="{ 'is-active': successModal }">
            <div class="modal-background" @click="()=>closeModal('success')"></div>
            <div class="modal-content">
                <div class="box">
                    <p>회원가입에 성공하셨습니다.</p>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="()=>closeModal('success')"></button>
        </div>

    </div>
</template>

<style scoped>
.main {
    height: 100%;
    width: 50%;
    max-width: 500px;
    min-width: 300px;

    display: flex;
    justify-content: center;
    align-items: center;

    margin: auto;
    background-color: white;
    border-radius: 30px;
    box-shadow: -10px -10px 15px rgba(212, 212, 212, 0.12),
        10px 10px 15px rgba(186, 186, 186, 0.12);
}

img {
    width: 70%;
    margin: 30px;
}

form {
    width: 80%;
    margin: auto;
}

.btn {
    margin-bottom: 30px;
    background-color: #7685b5;
    color: white;
}

.has-danger input {
    background-color: #f2dede;
}

.has-success input {
    background-color: #dff0d8;
}
/* 로고 컨테이너 스타일링 */
.logo-container {
  display: flex;
  justify-content: center;
}

/* 로고 이미지 스타일링 */
.logo {
  margin-bottom: 30px; /* 로고 아래 간격 조정 */
}
</style>

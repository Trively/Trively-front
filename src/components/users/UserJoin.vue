<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"

const { VITE_USER_BASE_URL } = import.meta.env

// import { useMemberStore } from "@/stores/member";
// import { findById } from "@/api/user";

const router = useRouter();

const id = ref('')
const password = ref('')
const email = ref('')
const nickname = ref('')

const userRegist = () => {
    axios.post("http://localhost:80/api/member", { id: id.value, password: password.value, email: email.value, nickname: nickname.value })
        .then(response => {
            router.push({name:'login'})
        })
        .catch(error => {
        console.log('Error 발생: ', error)
    })
}
// const memberStore = useMemberStore();

// const { userRegist } = memberStore;

// const registInfo = ref({
//     id: "",
//     password: "",
//     passwordCk: "",
//     name: "",
//     email: "",
//     phone: "",
//     birth: ""
// });

// const passwordMismatch = ref(false);
// const isExistingId = ref(false);

// const regist = async () => {
//     // 비밀번호와 비밀번호 확인이 일치하는지 확인
//     if (passwordMismatch.value) {
//         alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
//         return;
//     }

//     await userRegist(registInfo.value);
//     router.push('/user/login');
// };

// // 비밀번호와 비밀번호 확인이 일치하는지 실시간으로 확인
// const checkPasswordMatch = () => {
//     passwordMismatch.value = registInfo.value.password !== registInfo.value.passwordCk;
// };

// const isFormValid = () => {
//     return Object.values(registInfo.value).every(value => value.trim());
// };

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const isEmailValid = () => {
//     return emailRegex.test(registInfo.value.email);
// };

// // 아이디 중복 확인 함수
// const checkExistingId = async () => {

//     if (!registInfo.value.id) {
//         isExistingId.value = true;
//         return;
//     }
//     // findById 함수 호출
//     await findById(registInfo.value.id,
//         ({ data }) => {
//             // 아이디가 존재하지 않을 경우
//             if (data) {
//                 isExistingId.value = true;
//             }
//             else {
//                 isExistingId.value = false;
//             }
//         },
//         (error) => {

//         }
//     );
// };

</script>

<template>
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

        </form>
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

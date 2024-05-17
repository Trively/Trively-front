<script setup>
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { useMemberStore } from "@/stores/member"
import { useMenuStore } from "@/stores/menu"


const router = useRouter()

const memberStore = useMemberStore()

const { isLogin, isLoginError } = storeToRefs(memberStore)
const { userLogin, getUserInfo } = memberStore
const { changeMenuState } = useMenuStore()

const loginUser = ref({
  userId: "",
  userPwd: "",
})

const login = async () => {
  await userLogin(loginUser.value)
  let token = sessionStorage.getItem("accessToken")
  console.log(token)
  console.log("isLogin: " + isLogin.value)
  if (isLogin.value) {
    getUserInfo(token)
    changeMenuState()
    router.replace("/")
  }
}
const getLogin = () => {
    axios.post("http://localhost/api/member/login", { id: id.value, password: password.value })
        .then(response => {
            const token = response.data.accessToken;
            //토큰을 localStorage에 저장
            localStorage.setItem('accessToken', token);
            router.push({name: 'home'})
        })
        .catch(error => {
        console.log('Error 발생: ', error);
    })
}
// axios 인터셉터 설정하여 이후 요청에 토큰 포함
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        // 토큰이 만료되었는지 확인
        if (isTokenExpired(token)) {
            // 토큰이 만료되었으면 로그아웃 처리
            localStorage.removeItem('accessToken');
            router.push({ name: 'login' });
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// axios 응답 인터셉터 설정하여 401 에러 처리
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        // 401 에러 발생 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        router.push({ name: 'login' });
    }
    return Promise.reject(error);
});
</script>

<template>

    <div class="main">
        <form>
            <div class="logo-container">
                <img class="mb-4" src="@/assets/logo.png" width="200">
            </div>
            
            <h1 class="h3 mb-3 fw-normal">로그인</h1>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInput" v-model="id" placeholder="Id">
                <label for="floatingInput">아이디</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" v-model="password" placeholder="Password">
                <label for="floatingPassword">비밀번호</label>
            </div>

            <div class="form-check text-start my-3">
                <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    아이디 저장
                </label>
            </div>
            <div class="buttons">
                <button type="button" @click="getLogin" class="btn w-100 py-2">로그인</button>
                <button type="button" @click="goToUserJoin" class="btn w-100 py-2">회원가입</button>
            </div>
        </form>

    </div>
</template>

<style scoped>
.main {
    height: 100%;
    width: 50%;
    max-width: 500px;
    
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 30px auto;
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
    margin-top: 10px;
    background-color: #7685b5;
    color: white;
}
.buttons{
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
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
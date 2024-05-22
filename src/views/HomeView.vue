<script setup>
import { useRoute, useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member"
import attractionImg from "@/components/attraction/attractionImg.vue"

const memberStore = useMemberStore()
const router = useRouter();

function moveMap() {
  router.push({ name: "map" });
}
</script>

<template>
  <link href="https://webfontworld.github.io/goodchoice/Jalnan.css" rel="stylesheet" />

  <body>
    <div class="container" id="index">
      <div class="container-fluid pt-3">
        <div class="row justify-content-around">
          <div class="col-6 position-relative overflow-hidden p-3 m-1 text-center">
            <div class="col-md-15 mx-auto my-5">
              <h1>
                <span v-if="memberStore.userInfo">
                  <span
                    v-for="(char, index) in memberStore.userInfo.nickname + '님, 여행을 떠나볼까요?'"
                    :key="index"
                    class="animated-char"
                  >
                    {{ char }}
                  </span>
                </span>
                <span v-else>
                  <span
                    v-for="(char, index) in '여행을 떠나볼까요?'"
                    :key="index"
                    class="animated-char"
                  >
                    {{ char }}
                  </span>
                </span>
              </h1>
              <div class="mt-3 text-center">
                <img style="width: 300px" src="@/assets/traveler.png" alt="" />
              </div>
              <button
                class="btn btn-outline-dark mx-auto mt-3 btn-jittery"
                style="background-color: #001e3d; color: white"
                type="button"
                id="index-search-btn"
                @click="moveMap()"
              >
                <i class="bi bi-search"></i> 출발!
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="carousel-container">
        <attractionImg /> <!-- Add the ImageCarousel component here -->
    </div>
  </body>
</template>

<style scoped>
body {
  font-family: "Jalnan";
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left;
  background-attachment: fixed;
  background-image: url(@/assets/background.jpg);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}
.btn-jittery {
  -webkit-animation: jittery 4s infinite;
          animation: jittery 4s infinite;
}

.animated-char {
  display: inline-block;
  animation: wave 1s ease-in-out infinite;
}

.animated-char:nth-child(1) { animation-delay: 0s; }
.animated-char:nth-child(2) { animation-delay: 0.1s; }
.animated-char:nth-child(3) { animation-delay: 0.2s; }
.animated-char:nth-child(4) { animation-delay: 0.3s; }
.animated-char:nth-child(5) { animation-delay: 0.4s; }
.animated-char:nth-child(6) { animation-delay: 0.5s; }
.animated-char:nth-child(7) { animation-delay: 0.6s; }
.animated-char:nth-child(8) { animation-delay: 0.7s; }
.animated-char:nth-child(9) { animation-delay: 0.8s; }
.animated-char:nth-child(10) { animation-delay: 0.9s; }
.animated-char:nth-child(11) { animation-delay: 1.0s; }
.animated-char:nth-child(12) { animation-delay: 1.1s; }
.animated-char:nth-child(13) { animation-delay: 1.2s; }
.animated-char:nth-child(14) { animation-delay: 1.3s; }
.animated-char:nth-child(15) { animation-delay: 1.4s; }
.animated-char:nth-child(16) { animation-delay: 1.5s; }
.animated-char:nth-child(17) { animation-delay: 1.6s; }
.animated-char:nth-child(18) { animation-delay: 1.7s; }
.animated-char:nth-child(19) { animation-delay: 1.8s; }
.animated-char:nth-child(20) { animation-delay: 1.9s; }
.animated-char:nth-child(21) { animation-delay: 2.0s; }
.animated-char:nth-child(22) { animation-delay: 2.1s; }
.animated-char:nth-child(23) { animation-delay: 2.2s; }
.animated-char:nth-child(24) { animation-delay: 2.3s; }
.animated-char:nth-child(25) { animation-delay: 2.4s; }
.animated-char:nth-child(26) { animation-delay: 2.5s; }
.animated-char:nth-child(27) { animation-delay: 2.6s; }
.animated-char:nth-child(28) { animation-delay: 2.7s; }
.animated-char:nth-child(29) { animation-delay: 2.8s; }
/* 추가 글자에 대해서도 nth-child를 추가해줍니다 */

@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.carousel-container{
  width:100%;
  margin-top: 50px;
}
</style>

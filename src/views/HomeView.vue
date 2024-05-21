<script setup>
import { useRoute, useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member"

  
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
      <!-- section -->
      <div class="container-fluid pt-3">
        <div class="row justify-content-around">
          <!-- 메인 좌측 (여행지 선택) -->
          <div class="col-6 position-relative overflow-hidden p-3 m-1 text-center">
            <div class="col-md-15 mx-auto my-5">
              <h1>{{ memberStore.userInfo ? `${memberStore.userInfo.nickname} 님, 여행을 떠나볼까요?` : '여행을 떠나볼까요?' }}</h1>
              <div class="mt-5 text-center">
                <img style="width: 300px" src="@/assets/traveler.png" alt="" />
              </div>
              <form action="" method="post">
                <input type="hidden" value="indexToMap" />
                <!-- 지역 선택 -->
                <div class="input-group m-3" style="min-width: 200px">
                  <span class="input-group-text" style="width: 50px; background-color: #001e3d">
                    <i class="bi bi-map-fill m-auto" style="color: white"></i>
                  </span>
                  <select
                    name="index-search-area"
                    id="index-search-area"
                    class="form-select me-2"
                    aria-label="Default select example"
                    style="background-color: #e6e6e6"
                  >
                    <option value="0" selected>어디로 떠날까요?</option>
                  </select>
                </div>

                <!-- 관광지 유형 선택 -->
                <div class="input-group m-3" style="min-width: 200px">
                  <span class="input-group-text" style="width: 50px; background-color: #001e3d">
                    <i class="bi bi-binoculars-fill m-auto" style="color: white"></i>
                  </span>
                  <select
                    name="index-search-content"
                    id="index-search-content-id"
                    class="form-select me-2"
                    style="background-color: #e6e6e6"
                  >
                    <option value="0" selected>어떤 것을 할까요?</option>
                    <option value="12" title="관광지">관광지</option>
                    <option value="14">문화시설</option>
                    <option value="15">축제공연행사</option>
                    <option value="25">여행코스</option>
                    <option value="28">레포츠</option>
                    <option value="32">숙박</option>
                    <option value="38">쇼핑</option>
                    <option value="39">음식점</option>
                  </select>
                </div>

                <!-- 검색어 입력-->
                <div class="input-group m-3" style="min-width: 200px">
                  <span class="input-group-text" style="width: 50px; background-color: #001e3d">
                    <i class="bi bi-question-lg m-auto" style="color: white"></i>
                  </span>
                  <input
                    name="index-search-keyword"
                    id="index-search-keyword"
                    class="form-control me-2"
                    style="background-color: #e6e6e6"
                    type="search"
                    placeholder="무엇이 궁금한가요?"
                    aria-label="검색어"
                  />
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
              </form>
            </div>
          </div>
        </div>
      </div>
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


@keyframes jittery {
  5%,
  50% {
    transform: scale(1);
  }

  10% {
    transform: scale(0.9);
  }

  15% {
    transform: scale(1.15);
  }

  20% {
    transform: scale(1.15) rotate(-5deg);
  }

  25% {
    transform: scale(1.15) rotate(5deg);
  }

  30% {
    transform: scale(1.15) rotate(-3deg);
  }

  35% {
    transform: scale(1.15) rotate(2deg);
  }

  40% {
    transform: scale(1.15) rotate(0);
  }
}
</style>

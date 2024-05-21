<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member"

const local = localAxios();
const memberStore = useMemberStore()
const { VITE_POST_BASE_URL } = import.meta.env;
const route = useRoute();
const router = useRouter();

const postId = ref(route.params.postId);

const post = ref({});

onMounted(() => {
  getPost();
});

const getPost = () => {
  local
    .get(`post/${postId.value}`)
    .then((response) => {
      post.value = response.data.data.post;
    })
    .catch((error) => {
      console.error("검색 중 오류 발생:", error);
    });
};

function moveList() {
  router.push({ name: "postList" });
}

function moveModify() {
  router.push({ name: "postModify", params: { postId: postId.value } });
}

function onDeleteArticle() {
  if (confirm("정말 삭제하시겠습니까?")) {
    local
      .delete(`/post/${postId.value}`)
      .then(() => {
        Swal.fire({
          title: "정상적으로 삭제되었습니다.",
          icon: "success",
        });
        router.push({ name: "postList" });
      })
      .catch((error) => {
        console.error("삭제 중 오류 발생:", error);
      });
  }
}
</script>

<template>
  <div class="container">
    <div class="position-relative">
      <div class="fixed-top-container position-absolute top-0 end-0">
        <div class="col-md align-self-center text-end">
          <div class="image-container">
            <!-- <img :src="attraction.firstImage" class="img-fluid rounded" alt="Attraction Image"> -->
            <!-- <p class="fst-italic mt-2">{{ post.title }}</p> -->
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <div class="col-8">
            <h2 class="text-dark">{{ post.title }}</h2>
            <div class="clearfix align-content-center">
              <p>
                <!-- <span class="fw-bold">{{ post.userName }}</span> <br /> -->
                <span class="text-secondary fw-light">
                  {{ post.createdAt }} | 조회 : {{ post.hit }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md">
            <div class="text-dark">
              <div v-html="post.content"></div>
              <!-- <p>이 글이 도움이 되었다면?</p>
              <button type="button" class="btn btn-outline-secondary mb-3" @click="onRecommend">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" /> {{ articles.likes }}
              </button> -->
            </div>
            <hr />
            <!-- <div class="mt-3">
              <template v-if="userInfo != null">
                <BoardComment />
              </template>
              <template v-else>
                <BoardComment />
              </template>
            </div> -->
          </div>
        </div>
        <div class="divider mt-3 mb-3"></div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="d-flex justify-content-center">
              <button type="button" class="btn btn-outline-secondary mb-3" @click="moveList">
                글목록
              </button>            
              <button type="button" class="btn btn-secondary mb-3 ms-1"
                @click="moveModify" v-if="memberStore.userInfo && memberStore.userInfo.memberId === post.memberId">
                글수정
              </button>
              <button type="button" class="btn btn-danger mb-3 ms-1"
                @click="onDeleteArticle" v-if="memberStore.userInfo && memberStore.userInfo.memberId === post.memberId">
                글삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  margin-top: 20px;
  width: 100%;
}

.position-relative {
  position: relative;
}

.fixed-top-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  z-index: 1000;
}

.image-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  height: 200px;
}

.text-center {
  text-align: center;
}

.d-flex.justify-content-center {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>

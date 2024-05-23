<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member";
import CommentForm from "@/components/comment/CommentForm.vue";
import CommentList from "@/components/comment/CommentList.vue";

const local = localAxios();
const memberStore = useMemberStore();
const route = useRoute();
const router = useRouter();

const postId = ref(route.params.postId);
const post = ref({});
const comments = ref([]);

onMounted(() => {
  getPost();
  getComments();
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

const getComments = () => {
  local
    .get(`comment/${postId.value}`)
    .then((response) => {
      comments.value = response.data.data.list;
    })
    .catch((error) => {
      console.error("댓글 조회 중 오류 발생:", error);
    });
};

const reload = () => {
  getPost();
  getComments();
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
const toggleLike = () => {
  local
    .post(`/post/${postId.value}/like`)
    .then(() => {
      post.value.liked = !post.value.liked;
      if (post.value.liked) post.value.likeCnt += 1;
      if (!post.value.liked) post.value.likeCnt -= 1;
    })
    .catch((error) => {
      console.error("좋아요 처리 중 오류 발생:", error);
    });
};

const toggleScrap = () => {
  local
    .post(`/post/${postId.value}/scrap`)
    .then(() => {
      post.value.scraped = !post.value.scraped;
    })
    .catch((error) => {
      console.error("스크랩 처리 중 오류 발생:", error);
    });
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <div class="col-8">
            <h2 class="text-dark">{{ post.title }}</h2>
            <div class="clearfix align-content-center">
              <p>
                <!-- <span class="fw-bold">{{ post.userName }}</span> <br /> -->
                <span class="text-secondary fw-light">
                  {{ post.createdAt }} | 조회 : {{ post.hit }} 좋아요 : {{ post.likeCnt }}
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
        <div class="col-12 text-start">
          <div class="d-flex justify-content-between align-items-center">
            <!-- 좋아요, 스크랩 버튼 -->
            <div class="d-flex align-items-center">
              <button class="btn btn-icon me-1" @click="toggleLike">
                <img
                  v-if="post.liked"
                  src="@/assets/heart.png"
                  alt="Like Button"
                  class="like-img"
                />
                <img v-else src="@/assets/unheart.png" alt="Un-Like Button" class="like-img" />
              </button>
              <button class="btn btn-icon me-1" @click="toggleScrap">
                <img
                  v-if="post.scraped"
                  src="@/assets/star.png"
                  alt="Scrap Button"
                  class="scrap-img"
                />
                <img v-else src="@/assets/unstar.png" alt="Un-Scrap Button" class="scrap-img" />
              </button>
            </div>
            <!-- 글목록, 삭제, 수정 버튼 -->
            <div class="d-flex">
              <button type="button" class="btn btn-outline-secondary mb-3 me-1" @click="moveList">
                글목록
              </button>
              <button
                type="button"
                class="btn btn-secondary mb-3 me-1"
                @click="moveModify"
                v-if="memberStore.userInfo && memberStore.userInfo.memberId === post.memberId"
              >
                글수정
              </button>
              <button
                type="button"
                class="btn btn-danger mb-3 me-1"
                @click="onDeleteArticle"
                v-if="memberStore.userInfo && memberStore.userInfo.memberId === post.memberId"
              >
                글삭제
              </button>
            </div>
          </div>
        </div>
        <div class="divider mt-3 mb-3"></div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <h3>댓글 ({{ post.commentCnt }})</h3>
            <CommentForm :postId="postId" @commentSubmitted="reload" />
            <div class="comment-list-wrapper">
              <CommentList :comments="comments" :postId="postId" @commentSubmitted="reload" />
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
  height: 80vh; /* 전체 높이를 부모 요소로 설정 */
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

.row.my-2 > div.col-8 {
  width: 100%;
}

.row.my-2 > div.col-8 > h2.text-dark {
  width: 100%;
}

.row.my-2 > div.col-8 > .clearfix.align-content-center {
  width: 100%;
}

.row > div.col-md > .text-dark {
  width: 100%;
}

.row.justify-content-center > div.col-md-8 {
  width: 100%;
  height: 100%; /* 부모 요소가 전체 높이를 차지하도록 설정 */
  display: flex;
  flex-direction: column;
}

.comment-list-wrapper {
  height: 50vh;
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 표시 */
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

.btn-icon {
  width: 50px; /* 버튼 컨테이너 크기 */
  height: 50px; /* 버튼 컨테이너 크기 */
  padding: 0;
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.like-img {
  width: 40px;
  height: 40px;
}

.scrap-img {
  width: 50px; /* 스크랩 버튼 이미지 크기 */
  height: 50px; /* 스크랩 버튼 이미지 크기 */
}

.text-start {
  background-color: white;
  border-radius: 7px;
}
</style>

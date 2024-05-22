<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PostListItem from "@/components/post/item/PostListItem.vue";
import BoardList from "@/components/post/BoardList.vue";
import { localAxios } from "@/util/http-common";
import { useMemberStore } from "@/stores/member"

const local = localAxios();
const memberStore = useMemberStore()
const router = useRouter();
const posts = ref([]);

const listPosts = () => {
  local
    .get("/post")
    .then((response) => {
      posts.value = response.data.data.posts;
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

const updatePosts = (newPosts) => {
  posts.value = newPosts;
};

const moveWrite = () => {
  router.push({ name: "postWrite" });
};

const moveDetail = (postId) => {
  router.push({ name: "postDetail", params: { postId: postId.toString() } });
};

onMounted(() => {
  listPosts();
});
</script>

<template>
  <div class="container">
    <div class="row">
      <!-- 좌측에 BoardList -->
      <div class="col-lg-3">
        <BoardList @selectBoard="updatePosts" />
      </div>
      <!-- 우측에 PostList -->
      <div class="col-lg-9">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <h2 class="my-3 py-3 text-center">글 목록</h2>
          </div>
          <div class="col-lg-10-2">
            <div class="row align-self-center mb-2">
              <div class="col-md-2 text-start">
                <button type="button" class="btn btn-success btn-sm" @click="moveWrite" v-if="memberStore.userInfo">
                  글쓰기
                </button>
              </div>
            </div>
            <table class="table table-hover">
              <thead>
                <tr class="text-center">
                  <th scope="col">글번호</th>
                  <th scope="col">지역</th>
                  <th scope="col">제목</th>
                  <th scope="col">작성자</th>
                  <th scope="col">조회수</th>
                  <th scope="col">댓글</th>
                  <th scope="col">좋아요</th>
                  <th scope="col">작성일</th>
                </tr>
              </thead>
              <tbody>
                <PostListItem
                  v-for="post in posts"
                  :key="post.postId"
                  :post="post"
                  @click="moveDetail(post.postId)"
                ></PostListItem>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col-lg-10-2 {
  border-radius: 15px; /* Adjust this value to make corners more or less rounded */
  padding: 15px; /* Optional: add some padding inside the element */
  background-color: #fff; /* Optional: change the background color */
}
</style>

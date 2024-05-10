<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import PostListItem from "@/components/post/item/PostListItem.vue";
import BoardList from "@/components/post/BoardList.vue";

const { VITE_POST_BASE_URL } = import.meta.env;
const router = useRouter();
const posts = ref([]);

const listPosts = () => {
  axios
    .get(VITE_POST_BASE_URL)
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
            <h2 class="my-3 py-3 text-center">글목록</h2>
          </div>
          <div class="col-lg-10">
            <div class="row align-self-center mb-2">
              <div class="col-md-2 text-start">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="moveWrite">
                  글쓰기
                </button>
              </div>
              <!-- <div class="col-md-5 offset-5">
                <form class="d-flex">
                  <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      class="form-control"
                      v-model="param.word"
                      placeholder="검색어..."
                    />
                    <button class="btn btn-dark" type="button" @click="getArticleList">검색</button>
                  </div>
                </form>
              </div> -->
            </div>
            <table class="table table-hover">
              <thead>
                <tr class="text-center">
                  <th scope="col">글번호</th>
                  <th scope="col">지역</th>
                  <th scope="col">제목</th>
                  <th scope="col">작성자</th>
                  <th scope="col">조회수</th>
                  <th scope="col">작성일</th>
                </tr>
              </thead>
              <tbody>
                <PostListItem v-for="post in posts" :key="post.postId" :post="post"></PostListItem>
              </tbody>
            </table>
          </div>
          <!-- <PageNavigation
            :current-page="currentPage"
            :total-page="totalPage"
            @pageChange="onPageChange"
          ></PageNavigation> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

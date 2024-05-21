<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PostListItem from '@/components/post/item/PostListItem.vue';
import { localAxios } from '@/util/http-common';

const local = localAxios();
const router = useRouter();
const posts = ref([]);

const listMyPosts = () => {
  local
    .get('/member/my-post')
    .then((response) => {
      posts.value = response.data.data.posts;
    })
    .catch((error) => {
      console.error('요청 중 오류 발생: ', error);
    });
};

const moveDetail = (postId) => {
  router.push({ name: 'postDetail', params: { postId: postId.toString() } });
};

onMounted(() => {
  listMyPosts();
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 text-center">글 목록</h2>
      </div>
      <div class="col-lg-10-2">
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
</template>

<style scoped>
.container {
  margin-top: 20px;
}

.col-lg-10-2 {
  border-radius: 15px;
  padding: 15px;
  background-color: #fff;
}
</style>

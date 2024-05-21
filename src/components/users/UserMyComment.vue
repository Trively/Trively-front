<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CommentListItem from '@/components/post/item/CommentListItem.vue';
import { localAxios } from '@/util/http-common';

const local = localAxios();
const router = useRouter();
const comments = ref([]);

const listMyComments = () => {
  local
    .get('/member/my-comment')
    .then((response) => {
      comments.value = response.data.data.list;
    })
    .catch((error) => {
      console.error('요청 중 오류 발생: ', error);
    });
};

const moveDetail = (postId) => {
  router.push({ name: 'postDetail', params: { postId: postId.toString() } });
};

onMounted(() => {
  listMyComments();
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 text-center">댓글 목록</h2>
      </div>
      <div class="col-lg-10-2">
        <table class="table table-hover">
          <thead>
            <tr class="text-center">
              <th scope="col">글번호</th>
              <th scope="col">댓글 내용</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            <CommentListItem
              v-for="comment in comments"
              :key="comment.postId"
              :comment="comment"
              @click="moveDetail(comment.postId)"
            ></CommentListItem>
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

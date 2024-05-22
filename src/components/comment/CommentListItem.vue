<script setup>
import { defineProps, defineEmits } from "vue";
import { localAxios } from "@/util/http-common";

const local = localAxios();
const props = defineProps({
  commentItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refreshComments"]);

const deleteComment = () => {
  //   local.delete(`/api/comments/${props.commentItem.commentId}`).then(() => {
  //     emit("refreshComments");
  //   });
};
</script>

<template>
  <div class="comment-item">
    <p>
      <strong>{{ commentItem.nickname }}</strong> {{ commentItem.createdAt }}
    </p>
    <p>{{ commentItem.content }}</p>
    <button @click="$emit('reply', commentItem.commentId)">Reply</button>
    <button @click="deleteComment">Delete</button>
    <div v-if="commentItem.replies.length" class="replies">
      <CommentListItem
        v-for="reply in commentItem.replies"
        :key="reply.commentId"
        :commentItem="reply"
        @reply="$emit('reply', reply.commentId)"
        @refreshComments="$emit('refreshComments')"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
.replies {
  margin-left: 20px;
}
</style>

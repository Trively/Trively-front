<script setup>
import { ref, watch } from "vue";
import CommentForm from "@/components/comment/CommentForm.vue";

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  postId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["commentSubmitted"]);
const formattedComments = ref([]);
const replyParentId = ref(null);

const organizeComments = (comments) => {
  const commentMap = new Map();
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.commentId, comment);
    if (comment.parentId === null) {
      formattedComments.value.push(comment);
    } else {
      commentMap.get(comment.parentId)?.replies.push(comment);
    }
  });
};

watch(
  () => props.comments,
  (newComments) => {
    formattedComments.value = [];
    organizeComments(newComments);
  },
  { immediate: true }
);

const setReplyParent = (commentId) => {
  replyParentId.value = commentId;
};

const refreshComments = () => {
  emit("commentSubmitted");
};
</script>

<template>
  <div>
    <div v-for="comment in formattedComments" :key="comment.commentId" class="comment">
      <p><strong>{{ comment.nickname }}</strong> {{ comment.createdAt }}</p>
      <p>{{ comment.content }}</p>
      <button @click="setReplyParent(comment.commentId)">Reply</button>
      <div v-if="replyParentId === comment.commentId">
        <CommentForm :postId="comment.postId" :parentId="comment.commentId" @commentSubmitted="refreshComments" />
      </div>
      <div v-if="comment.replies.length" class="replies">
        <CommentList :comments="comment.replies" :postId="comment.postId" @commentSubmitted="refreshComments" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
.replies {
  margin-left: 20px;
}
</style>

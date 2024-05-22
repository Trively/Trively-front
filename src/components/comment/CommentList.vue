<script setup>
import { ref, watch } from "vue";
import CommentForm from "@/components/comment/CommentForm.vue";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";
import { useMemberStore } from "@/stores/member";

const memberStore = useMemberStore();
const local = localAxios();
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
const showReplyForm = ref(false);

const organizeComments = (comments) => {
  const commentMap = new Map();
  const rootComments = [];

  // 댓글을 맵에 저장하고 replies 배열 초기화
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.commentId, comment);
  });

  // 부모 댓글과 대댓글을 연결
  comments.forEach((comment) => {
    if (comment.parentId === null) {
      rootComments.push(comment);
    } else {
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    }
  });

  formattedComments.value = rootComments;
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
  showReplyForm.value = true;
};

const closeReplyForm = () => {
  replyParentId.value = null;
  showReplyForm.value = false;
};

const refreshComments = (newComment) => {
  if (newComment.parentId) {
    // 대댓글인 경우 부모 댓글의 하위로 추가
    const parentComment = formattedComments.value.find(
      (comment) => comment.commentId === newComment.parentId
    );
    if (parentComment) {
      parentComment.replies.push(newComment);
    }
  } else {
    // 대댓글이 아닌 경우 리스트에 바로 추가
    formattedComments.value.push(newComment);
  }

  emit("commentSubmitted");
};

const deleteComment = (postId, commentId) => {
  Swal.fire({
    title: "댓글을 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a3d91",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      local
        .delete(`/comment/${postId}/${commentId}`)
        .then(() => {
          Swal.fire({
            title: "댓글이 삭제되었습니다.",
            icon: "success",
            confirmButtonColor: "#0a3d91",
          });
          emit("commentSubmitted");
        })
        .catch((error) => {
          console.error("댓글 삭제 중 오류 발생:", error);
        });
    }
  });
};
</script>

<template>
  <div class="comment-list">
    <div v-for="comment in formattedComments" :key="comment.commentId">
      <div class="comment">
        <div class="comment-content">
          <div class="author-and-button">
            <div class="author-container">
              <strong class="comment-author">{{ comment.nickname }}</strong>
            </div>
            <div class="buttons">
              <button
                v-if="!showReplyForm || replyParentId !== comment.commentId"
                class="reply-button btn btn-outline-secondary"
                @click="setReplyParent(comment.commentId)"
              >
                답글
              </button>
              <button
                v-if="memberStore.userInfo && memberStore.userInfo.memberId === comment.memberId"
                class="delete-button btn btn-outline-danger ms-1"
                @click="deleteComment(comment.postId, comment.commentId)"
              >
                삭제
              </button>
            </div>
          </div>

          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-time">{{ comment.createdAt }}</div>
        </div>
        <div
          v-if="replyParentId === comment.commentId || (showReplyForm && replyParentId === null)"
          class="reply-form"
        >
          <CommentForm
            :postId="postId"
            :parentId="comment.commentId"
            @commentSubmitted="refreshComments"
            @cancel="closeReplyForm"
          />
        </div>
      </div>
      <div v-if="!comment.parentId && comment.replies.length" class="replies">
        <div v-for="reply in comment.replies" :key="reply.commentId" class="comment reply">
          <div class="comment-content">
            <div class="author-and-button">
              <strong class="comment-author">{{ reply.nickname }}</strong>
              <button
                v-if="memberStore.userInfo && memberStore.userInfo.memberId === reply.memberId"
                class="delete-button btn btn-outline-danger ms-1"
                @click="deleteComment(reply.postId, reply.commentId)"
              >
                삭제
              </button>
            </div>
            <p class="comment-text">{{ reply.content }}</p>
            <div class="comment-time">{{ reply.createdAt }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  border: 1px solid #ddd;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
}

.comment-content {
  display: flex;
  flex-direction: column;
}

.author-and-button {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.comment-author,
.comment-text {
  text-align: left;
}

.comment-author {
  margin-bottom: 5px;
  font-weight: bold; /* 작성자를 진하게 표시 */
}

.comment-text {
  opacity: 0.8; /* 내용을 연하게 표시 */
}

.comment-time {
  text-align: left;
  color: #999;
}

.reply-button {
  align-self: flex-end;
}

.replies {
  margin-left: 20px;
}

.reply {
  margin-left: 20px;
  border-left: 1px solid #ddd;
  padding-left: 10px;
}

.reply-form {
  position: relative;
}
</style>

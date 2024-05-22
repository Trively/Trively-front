<script setup>
import { ref } from "vue";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";

const local = localAxios();
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  parentId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["commentSubmitted", "cancel"]);

const content = ref("");

const onCancel = () => {
  emit("cancel");
};

const submitComment = () => {
  if (!content.value) {
    Swal.fire({
      icon: "warning",
      title: "댓글 내용이 없습니다!",
    });
    return;
  }

  const commentData = {
    content: content.value,
    parentId: props.parentId,
    postId: props.postId,
  };

  local.post("/comment", commentData).then((response) => {
    content.value = "";
    emit("commentSubmitted", response.data.data); // 새로운 댓글의 정보를 함께 전달

    if (props.parentId) {
      onCancel();
    }
  });
};
</script>

<template>
  <div class="input-wrapper mb-2">
    <input type="text" v-model="content" placeholder="댓글 작성..." />
    <button class="btn btn-primary" @click="submitComment">작성</button>
    <button v-if="parentId" @click="onCancel" class="btn btn-secondary">취소</button>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
}

input[type="text"] {
  flex: 1;
  margin-right: -1px; /* 버튼과 정확히 맞도록 조정 */
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  height: 38px; /* 버튼과 높이를 동일하게 설정 */
}

button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 38px; /* 버튼과 높이를 동일하게 설정 */
}
</style>

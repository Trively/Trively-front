<script setup>
import { ref } from "vue";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";

const local = localAxios();
const props = defineProps({
  parentId: {
    type: Number,
    default: null,
  },
  postId: {
    type: Number,
    required: true,
  },
});

const content = ref("");

const emit = defineEmits(["commentSubmitted"]);

const submitComment = () => {
  if (!content.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "내용을 입력해주세요!",
    });
    return;
  }

  const payload = {
    postId: props.postId,
    content: content.value,
    parentId: props.parentId,
  };

  local
    .post("/comment", payload)
    .then((response) => {
      Swal.fire({
        title: "댓글이 성공적으로 작성되었습니다!",
        icon: "success",
      });
      content.value = "";
      emit("commentSubmitted");
    })
    .catch((error) => {
      console.error("댓글 작성 중 오류 발생:", error);
      Swal.fire({
        icon: "error",
        title: "댓글 작성에 실패했습니다!",
      });
    });
};
</script>

<template>
  <div>
    <textarea v-model="content" placeholder="댓글을 입력하세요"></textarea>
    <button @click="submitComment">댓글 작성</button>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}
button {
  display: block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>

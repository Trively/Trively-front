<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const { VITE_POST_BASE_URL } = import.meta.env;

const router = useRouter();
const route = useRoute();
const props = defineProps({ type: String });

const post = ref({
  title: "",
  content: "",
  boardName: "",
});

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
const selectedBoardErrMsg = ref("");

// 제목 길이 검증
watch(
  () => post.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!";
    } else subjectErrMsg.value = "";
  },
  { immediate: true }
);

// 내용 길이 검증
watch(
  () => post.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!";
    } else contentErrMsg.value = "";
  },
  { immediate: true }
);

// 카테고리 선택 검증
watch(
  () => post.value.boardName,
  (value) => {
    if (!value || value === null) {
      selectedBoardErrMsg.value = "카테고리를 선택해 주세요!!!";
    } else {
      selectedBoardErrMsg.value = "";
    }
  }
);

const boards = ref([]);
const selectedBoard = ref(null);

const ListBoards = () => {
  axios
    .get("http://localhost:80/api/board")
    .then((response) => {
      boards.value = response.data.data.boards;
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

const onSubmit = () => {
  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    props.type === "regist" ? writeArticle() : "";
  }
};

const writeArticle = () => {
  axios
    .post(VITE_POST_BASE_URL, {
      title: post.value.title,
      content: post.value.content,
      boardName: selectedBoard.value.boardName,
    })
    .then(() => {
      moveList();
    })
    .catch((error) => {
      console.error("등록 중 오류 발생: ", error);
    });
};

const moveList = () => {
  router.push({ name: "postList" });
};

onMounted(() => {
  ListBoards();
});
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- <div class="mb-3">
      <label for="userid" class="form-label">작성자 ID : </label>
      <input
        type="text"
        class="form-control"
        v-model="article.userId"
        :disabled="isUseId"
        placeholder="작성자ID..."
      />
    </div> -->
    <div class="mb-3">
      <label for="board" class="form-label">카테고리 선택:</label>
      <select class="form-select" v-model="selectedBoard">
        <option disabled value="">카테고리 선택</option>
        <option v-for="board in boards" :key="board.boardId" :value="post.boardName">
          {{ board.boardName }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="title" class="form-label">제목 : </label>
      <input type="text" class="form-control" v-model="post.title" placeholder="제목..." />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용 : </label>
      <textarea class="form-control" v-model="post.content" rows="10"></textarea>
    </div>

    <!-- <div class="mb-3">
      <label for="upfile" class="form-label">파일:</label>
      <input
        type="file"
        class="form-control border"
        @change="upload(this)"
        id="upfile"
        name="upfile"
        multiple="multiple"
      />
    </div> -->

    <div class="col-auto text-center">
      <button
        type="submit"
        class="btn btn-outline-primary mb-3"
        v-if="type === 'regist'"
        @click="writeArticle"
      >
        글작성
      </button>
      <!-- <button type="submit" class="btn btn-outline-success mb-3" v-else @click="updateArticle">
        글수정
      </button> -->
      <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="moveList">
        목록으로이동...
      </button>
    </div>
  </form>
</template>

<style scoped></style>

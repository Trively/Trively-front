<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { localAxios } from "@/util/http-common";
import Swal from "sweetalert2";

const local = localAxios();

const router = useRouter();
const route = useRoute();
const props = defineProps({ type: String });
const postId = ref(route.params.postId);

const post = ref({
  title: "",
  content: "",
  boardName: "",
});

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
const selectedBoardErrMsg = ref("");

// 카테고리 선택 검증
watch(
  () => post.value.boardName,
  (value) => {
    if (!value || value === null) {
      selectedBoardErrMsg.value = "카테고리를 선택해 주세요!!!";
    } else {
      selectedBoardErrMsg.value = "";
    }
  },
  { immediate: true }
);

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

const getPost = () => {
  local
    .get(`/post/${postId.value}`)
    .then((response) => {
      post.value = response.data.data.post;
    })
    .catch((error) => {
      console.error("검색 중 오류 발생:", error);
    });
};

/**
 * 카테고리
 */
const boards = ref([]);

const ListBoards = () => {
  local
    .get("/board")
    .then((response) => {
      boards.value = response.data.data.boards;
    })
    .catch((error) => {
      console.error("요청 중 오류 발생: ", error);
    });
};

const onSubmit = () => {
  if (selectedBoardErrMsg.value) {
    Swal.fire({
      icon: "warning",
      title: selectedBoardErrMsg.value,
    });
  } else if (subjectErrMsg.value) {
    Swal.fire({
      icon: "warning",
      title: subjectErrMsg.value,
    });
  } else if (contentErrMsg.value) {
    Swal.fire({
      icon: "warning",
      title: contentErrMsg.value,
    });
  } else {
    props.type === "regist" ? writeArticle() : writeArticle();
  }
};

const writeArticle = () => {
  local
    .post("/post", {
      title: post.value.title,
      content: post.value.content,
      boardName: post.value.boardName,
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

  // postId 값이 있을 때 getPost 함수 호출
  if (postId.value) {
    getPost();
  }
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
      <select class="form-select" v-model="post.boardName">
        <option disabled value="">카테고리 선택</option>
        <option v-for="board in boards" :key="board.boardId" :value="board.boardName">
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
      <button type="submit" class="btn btn-primary mb-3" v-if="type === 'regist'">글작성</button>
      <button type="submit" class="btn btn-success mb-3" v-else>글수정</button>
      <button type="button" class="btn btn-secondary mb-3 ms-1" @click="moveList">
        목록으로이동...
      </button>
    </div>
  </form>
</template>

<style scoped></style>

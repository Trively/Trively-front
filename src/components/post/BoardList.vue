<template>
  <div>
    <h2 class="my-3 py-3 text-center">지역 목록</h2>

    <ul class="list-group">
      <li class="list-group-item" :class="{ active: !selectedBoard }" @click="handleClick(null)">
        전체 지역
      </li>
      <li
        class="list-group-item"
        v-for="board in boards"
        :key="board.board_id"
        @click="handleClick(board)"
        :class="{ active: selectedBoard === board }"
      >
        {{ board.boardName }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import axios from "axios";

const { VITE_POST_BASE_URL } = import.meta.env;

const boards = ref([]);
const selectedBoard = ref(); // 선택된 게시판을 추적하기 위한 변수
const emit = defineEmits(["selectBoard"]);

//카테고리 조회
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

//카테고리별 게시판 조회
const selectBoard = (board) => {
  const params = {
    boardId: board ? board.boardId : null, // board가 null이면 전체 게시판 조회
  };
  axios
    .get(VITE_POST_BASE_URL, { params })
    .then((response) => {
      emit("selectBoard", response.data.data.posts);
    })
    .catch((error) => {
      console.error("검색 중 오류 발생:", error);
    });
};

const handleClick = (board) => {
  // 클릭된 게시판 처리
  selectedBoard.value = board; // 클릭된 게시판을 변수에 할당
  selectBoard(board);
};

onMounted(() => {
  ListBoards();
});
</script>

<style scoped>
/* 선택된 리스트 아이템 스타일 */
.list-group-item.active {
  background-color: #007bff;
  color: white;
}
</style>

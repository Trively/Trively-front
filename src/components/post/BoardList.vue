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
import { localAxios } from "@/util/http-common";
import { usePostPage } from "@/stores/postPage"; 
import { storeToRefs } from "pinia";

const postPage = usePostPage()
const local = localAxios();
const boards = ref([]);
const selectedBoard = ref(); // 선택된 게시판을 추적하기 위한 변수
const emit = defineEmits(["selectBoard"]);
const { totalCount  } = storeToRefs(postPage);

//카테고리 조회
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

//카테고리별 게시판 조회
const selectBoard = (board) => {
  const params = {
    boardId: board ? board.boardId : null, // board가 null이면 전체 게시판 조회
  };
  local
    .get("/post", { params })
    .then((response) => {
      emit("selectBoard", response.data.data.posts);
      totalCount.value = response.data.data.totalCount;
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
.list-group-item {
  border: none; /* 테두리 제거 */
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

.list-group-item:hover {
  background-color: #f1f1f1; /* 마우스 오버 시 배경색 */
}

.list-group-item.active {
  background-color: #7685b5; /* 선택된 항목 배경색 */
  color: white; /* 선택된 항목 텍스트 색상 */
}

.list-group-item.active:hover {
  background-color: #5a6b96; /* 선택된 항목에 대한 마우스 오버 시 배경색 */
}
</style>

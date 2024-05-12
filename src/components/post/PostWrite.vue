<script setup>
import PostFormItem from "@/components/post/item/PostFormItem.vue";
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">글쓰기</mark>
        </h2>
      </div>
      <div class="col-lg-10 text-start">
        <PostFormItem type="regist" />
      </div>
    </div>
  </div>
</template>

<style scoped>
mark {
  background-color: rgb(151, 173, 236); /* 원하는 배경색으로 변경 */
}
</style>

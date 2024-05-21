<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">글수정</h2>
      </div>
      <div class="col-lg-10 text-start">
        <PostFormItem type="modify" />
      </div>
    </div>
  </div>
</template>
<script setup>
import PostFormItem from "@/components/post/item/PostFormItem.vue";
</script>
<style scoped></style>

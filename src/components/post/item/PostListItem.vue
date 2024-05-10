<script setup>
defineProps({ post: Object });
</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ post.postId }}</th>
    <td>{{ post.boardName }}</td>
    <td class="text-start">
      <!-- <router-link
        :to="{ name: 'article-view', params: { articleno: article.articleNo } }"
        class="article-title link-dark"
      > -->
      {{ post.title }}
      <!-- </router-link> -->
    </td>
    <td>{{ post.nickName }}</td>
    <td>{{ post.hit }}</td>
    <td>{{ post.createdAt }}</td>
  </tr>
</template>

<style scoped></style>

<script setup>
defineProps({ comment: Object });
</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ comment.postId }}</th>
    <td>{{ comment.content }}</td>
    <td>{{ comment.createdAt }}</td>
  </tr>
</template>

<style scoped></style>

import { defineStore } from 'pinia'
import { ref } from "vue"

export const usePostPage = defineStore('postPage',()=>  {
    const pageIndex = ref(1)
    const totalCount = ref()
    const pageSize = ref(10)
    const order = ref("earliest")
    const boardId = ref(0)
    return { pageIndex, totalCount, order, boardId, pageSize };
})
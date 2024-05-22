<template>
  <div>
    <a-button type="" @click="getGPTResponse">
      <img src="@/assets/ai.png" width="30px" height="30px" />
    </a-button>
    <!-- <button
      @click="getGPTResponse"
      class="btn btn-lg btn-jittery open-button-tour btn-hover color-3"
    >
      <img src="@/assets/ai.png" width="30px" height="30px" />
    </button> -->

    <a-modal v-model:open="open" title="AI 검색 결과" @ok="closeModal">
      <!-- <div v-if="showAiModal || loading"> -->
      <div class="modal-content">
        <div v-if="loading">
          <h2>잠시만 기다려주세요. 검색중입니다.</h2>
        </div>
        <div v-else>
          <h2>AI 검색 결과</h2>
          <hr />
          <div class="typed-text">
            <span v-for="(char, index) in displayedText" :key="index">{{ char }}</span>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </a-modal>

    <!-- <div v-if="showAiModal || loading" class="modal-overlay">
      <div class="modal-content">
        <div v-if="loading">
          <h2>잠시만 기다려주세요. 검색중입니다.</h2>
        </div>
        <div v-else>
          <h2>AI 검색 결과</h2>
          <hr />
          <div class="typed-text">
            <span v-for="(char, index) in displayedText" :key="index">{{ char }}</span>
          </div>
          <button @click="closeModal" class="close-button">닫기</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import OpenAI from "openai";

const props = defineProps({
  tripName: {
    type: String,
  },
});
const answer = ref("");
const showAiModal = ref(false);
const loading = ref(false);
const displayedText = ref("");
const currentCharIndex = ref(0);
let typingInterval = null;

const getGPTResponse = async () => {
  try {
    loading.value = true;
    const openai = new OpenAI({
      apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `대한민국의 ${props.tripName} 을 검색해서, 사람들의 방문 후기 혹은 이용후기를 요약해서 알려줘.
    단, 요약은 총 5개의 리스트로 정리해서 보여줘`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    answer.value = response.choices[0].message.content;
    loading.value = false;
    showAiModal.value = true;
    startTypingEffect();
    console.log("chatGPT 결과: ", response.choices[0].message.content);
  } catch (error) {
    console.log("chatGPT: 🚨 에러가 발생했습니다.");
    loading.value = false;
  }
};

const startTypingEffect = () => {
  clearInterval(typingInterval);
  displayedText.value = "";
  currentCharIndex.value = 0;
  typingInterval = setInterval(() => {
    if (currentCharIndex.value < answer.value.length) {
      displayedText.value += answer.value[currentCharIndex.value];
      currentCharIndex.value++;
    } else {
      clearInterval(typingInterval);
    }
  }, 50); // 50ms 간격으로 타이핑 효과
};

const closeModal = () => {
  showAiModal.value = false;
  clearInterval(typingInterval);
  displayedText.value = "";
  currentCharIndex.value = 0;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.typed-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #0056b3;
}
</style>

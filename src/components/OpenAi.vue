<template>
  <link href="https://webfontworld.github.io/goodchoice/Jalnan.css" rel="stylesheet" />
  <div class="wrapper">
    <div class="tooltip-container">
      <a-button class="ai-button" type="" @click="getGPTResponse">
      <img src="@/assets/ai.png" width="30px" height="30px" />
      <span class="tooltip">AI 리뷰 검색</span>
    </a-button>
    </div>
    

    <a-modal v-model:open="showAiModal" title="" @ok="closeModal" class="custom-modal">
      <div v-if="showAiModal || loading">
        <div class="modal-content">
          <div v-if="loading">
            <h2>답변 생성중입니다..</h2>
            <div class="spinner-div mt-3">
              <a-spin />
            </div>
          </div>
          <div v-else>
            <h2>{{ tripName }}</h2>
            <hr />
            <div class="typed-text">
              <span v-for="(char, index) in displayedText" :key="index">{{ char }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
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
  showAiModal.value = true;
  try {
    loading.value = true;
    const openai = new OpenAI({
      apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `대한민국의 ${props.tripName} 을 검색해서, 사람들의 방문 후기 혹은 이용후기를 요약해서 알려줘.
    단, 요약은 3개의 장점과, 3개의 단점으로 정리해줘.
    장점과 단점이 잘 구분되게 정리해줘.`;

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
.spinner-div {
  text-align: center;
  border-radius: 8px;
}

.custom-modal .ant-modal-content {
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Jalnan", sans-serif; /* 폰트 적용 */
}

.custom-modal .ant-modal-header {
  background-color: #f0f0f0;
  border-bottom: none;
}

.custom-modal .ant-modal-title {
  font-weight: bold;
  font-size: 1.5em;
}

.custom-modal .ant-modal-body {
  padding: 20px;
}

.custom-modal .ant-modal-footer {
  border-top: none;
  display: flex;
  justify-content: center;
}

.typed-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 1.2em; /* 글자 크기 키우기 */
}
.tooltip {
  visibility: hidden;
  width: 170%;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%); /* 가운데 정렬 */
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip-container {
  position: relative; /* Ensure tooltip is positioned relative to this container */
  display: inline-block; /* Adjust display as needed */
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

</style>

<style>
.custom-modal{
  font-family: "Jalnan";
}
</style>
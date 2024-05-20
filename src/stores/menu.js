import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";


export const useMenuStore = defineStore("menuStore", () => {
  const menuList = ref([
    { name: "로그인", show: true, routeName: "login" },
    { name: "쪽지", show: false, routeName: "messageRoomList" },
    { name: "마이 페이지", show: false, routeName: "myPage" },
    { name: "로그아웃", show: false, routeName: "logout" },
  ]);

  const router = useRouter();


  const changeMenuState = () => {
    menuList.value = menuList.value.map((item) => ({ ...item, show: !item.show }));
  };
  return {
    menuList,
    changeMenuState,
  };
});

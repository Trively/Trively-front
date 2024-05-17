import { ref } from "vue";
import { defineStore } from "pinia";

export const useMenuStore = defineStore("menuStore", () => {
  const menuList = ref([
    { name: "로그인", show: true, routeName: "login" },
    { name: "마이 페이지", show: false, routeName: "myPage" },
    { name: "로그아웃", show: false, routeName: "login" },
  ]);
  // const updateMenuState = (isLoggedIn) => {
  //   menuList.value = menuList.value.map((item) => {
  //     if (item.name === "로그인") {
  //       return { ...item, show: !isLoggedIn };
  //     } else {
  //       return { ...item, show: isLoggedIn };
  //     }
  //   });
  // };
  const changeMenuState = () => {
    menuList.value = menuList.value.map((item) => ({ ...item, show: !item.show }));
  };
  return {
    menuList,
    changeMenuState,
  };
});

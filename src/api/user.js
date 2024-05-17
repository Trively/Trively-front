import { localAxios } from "@/util/http-common";

const local = localAxios();

async function userConfirm(param, success, fail) {
    await local.post(`/member/login`, param).then(success).catch(fail);
  // await local.post(`/member/login`,param).then(success).catch(error => {
  //   console.error('Login request failed:', error.response || error.message);
  //   fail(error);
  // });
}

async function findById(userid, success, fail) {
  local.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
  await local.get(`/member/info/${userid}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
  await local.post(`/member/refresh`, user).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await local.get(`/member/logout/${userid}`).then(success).catch(fail);
}

export { userConfirm, findById, tokenRegeneration, logout };

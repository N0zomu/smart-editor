import {post, get} from './api'

export function Register(nickname, password, email){
  let data={};
  data.nickname=nickname;
  data.email=email;
  data.password=password;
  return post("/user/register", data);
}

export function Login(email, password){
  let data={};
  data.email=email;
  data.password=password;
  return post("/user/login",data);
}

export function selfInfo(){
  let param={};
  return get("/user/selfInfo",param);
}

export function selfAva() {
  let param={};
  return get("/user/icon",param);
}

export function updateNickName(nickname) {
  let data={};
  data.newNick = nickname;
  return post("/user/changeName", data);
}

export function updatePassword(oldPWD, newPWD, cPWD) {
  let data={};
  data.oldPWD = oldPWD;
  data.newPWD = newPWD;
  data.cPWD = cPWD;
  return post("/user/changePassword", data);
}

export function uploadAvatar(image){
  let data = new FormData();
  data.append("icon", image.raw);
  // data.append("icon", image.raw);
  return post("/user/changeIcon", data);
}

export function tobeVIP(){
  return post("/user/upgrade", {});
}

export function searchUser(email, team_id){
  let data={};
  data.email=email;
  data.team_id=team_id;
  return post("/user/searchEmail",data);
}
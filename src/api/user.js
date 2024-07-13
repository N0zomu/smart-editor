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

export function searchUser(email, team_id){
  let data={};
  data.email=email;
  data.team_id=team_id;
  return post("/user/searchEmail",data);
}
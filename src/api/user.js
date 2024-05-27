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

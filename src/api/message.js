import {post, get} from './api'

export function sendTeamMsg(rec_id, team_id){
  let data={};
  data.rec_id=rec_id;
  data.is_team=false;
  data.ref_type="team";
  data.ref_id = team_id
  return post("/msg/create", data);
}

export function all0Msg(){
  let data={};
  data.status=0;
  return post("/msg/all",data);
}

export function all1Msg(){
  let data={};
  data.status=1;
  return post("/msg/all",data);
}

export function handleMsg(msg_id){
  let data={};
  data.msg_id = msg_id
  return post("/msg/operate",data);
}

export function deleteMsg(msg_id){
  let data={};
  data.msg_id = msg_id
  return post("/msg/delete",data);
}
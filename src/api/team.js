import {post, get} from './api'

export function createTeam(name){
  let data={};
  data.team_name=name;
  return post("/team/create",data);
}

export function allTeam(){
  let param={};
  return get("/team/all",param);
}

export function deleteTeam(id){
  let data={};
  data.team_id=id;
  return post("/team/delete",data);
}

export function searchTeam(key){
  let data={};
  data.key=key;
  return post("/team/search",data);
}

export function teamInfo(team_id){
  let param={};
  return get(`/team/info/${team_id}`,param);
}

export function teamMembers(team_id){
  let data={};
  data.team_id=team_id;
  return post("/team/allMember",data);
}

export function addMember(team_id, user_id){
  let data={};
  data.team_id=team_id;
  data.user_id=user_id;
  return post("/team/add",data);
}

export function quitMember(team_id, user_id){
  let data={};
  data.team_id=team_id;
  data.user_id=user_id;
  return post("/team/quit",data);
}

export function quitSelf(team_id){
  let data={}
  data.team_id=team_id
  return post("/team/quitSelf", data)
}
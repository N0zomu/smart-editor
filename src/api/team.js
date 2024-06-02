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
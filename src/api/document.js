import {post, get} from './api'

export function createRootDoc(docname){
  let data={};
  data.doc_name=docname;
  data.ifteam=false;
  data.is_folder=false;
  return post("/doc/createDoc", data);
}

export function createRootFolder(name){
  let data={};
  data.doc_name=name;
  data.ifteam=false;
  data.is_folder=true;
  return post("/doc/createDoc", data);
}

export function createFolderDoc(docname, folder_id, is_team, team_id){
  let data={};
  data.doc_name=docname;
  data.ifteam=is_team;
  data.team_id = team_id
  data.is_folder=false;
  data.parent_id = folder_id
  return post("/doc/createDoc", data);
}

export function createFolderFolder(name, folder_id, is_team, team_id){
  let data={};
  data.doc_name=name;
  data.ifteam=is_team;
  data.team_id = team_id
  data.is_folder=true;
  data.parent_id = folder_id
  return post("/doc/createDoc", data);
}

export function teamRootDoc(docname, team_id){
  let data={};
  data.doc_name=docname;
  data.ifteam=true;
  data.team_id=team_id
  data.is_folder=false;
  return post("/doc/createDoc", data);
}

export function teamRootFolder(name, team_id){
  let data={};
  data.doc_name=name;
  data.ifteam=true;
  data.team_id=team_id
  data.is_folder=true;
  return post("/doc/createDoc", data);
}

export function rootDoc(){
  let param={};
  return get("/doc/root",param);
}

export function allTeamRootDoc(team_id){
  let data={};
  data.team_id = team_id
  return post("/doc/teamRoot",data);
}

export function folderDoc(folder_id){
  let data={};
  data.doc_id=folder_id
  return post("/doc/folder",data);
}

export function deleteDoc(doc_id ,is_folder) {
  let data={};
  data.doc_id = doc_id;
  data.is_folder = is_folder;
  return post("/doc/deleteDoc", data);
}

export function regainDoc(doc_id, is_folder){
  let data={};
  data.doc_id = doc_id;
  data.is_folder = is_folder;
  return post("/doc/regainDoc", data);
}

export function moveDoc(src_doc, dst_doc){
  let data={};
  data.src_doc = src_doc;
  data.dst_doc = dst_doc;
  return post("/doc/move", data);
}

export function collectDoc(doc_id) {
  let data={};
  data.doc_id = doc_id;
  return post("/doc/collect", data);
}

export function cancelCollect(doc_id){
  let data={};
  data.doc_id = doc_id;
  return post("/doc/removeCollect", data);
}

export function allCollect(){
  let param={};
  return get("/doc/allCollection",param);
}

export function getPath(doc_id){
  let data={};
  data.doc_id = doc_id;
  return post("/doc/path",data);
}

export function docContent(doc_id){
  let data={};
  data.doc_id = doc_id;
  return post("/doc/docContent",data);
}

export function updateDoc(doc_id, content){
  let data={};
  data.doc_id = doc_id;
  data.content = content
  return post("/doc/updateDoc",data);
}
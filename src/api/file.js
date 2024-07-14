import {post, get} from './api'

export function userUploadFile(doc_id, file){
  var formData = new FormData()
  formData.append('doc_id', doc_id)
  formData.append('file', file)
  return post("/file/upload", formData);
}

export function allFile(doc_id){
  let data = {}
  data.doc_id = doc_id
  return post("/file/all", data);
}

export function deleteFile(file_id){
  let data = {}
  data.file_id = file_id
  return post("/file/delete", data);
}
import {post, get} from './api'

export function userPolish(content, func){
  let data = {}
  data.env = ""
  data.detail = ""
  data.cont = content
  data.func = func
  return post("/ai/polish", data)
}

export function vipPolish(env, detail, content, func){
  let data = {}
  data.env = env
  data.detail = detail
  data.cont = content
  data.func = func
  return post("/ai/polish", data)
}

export function getMindMap(content){
  let data = {}
  data.cont = content
  return post("/ai/mindMap", data)
}

export function userGetOCR(file_id){
  let data = {}
  data.file_id = file_id
  data.key_word = ''
  return post("/ai/ocr", data)
}

export function VIPGetOCR(file_id, key_word){
  let data = {}
  data.file_id = file_id
  data.key_word = key_word
  return post("/ai/ocr", data)
}

export function userHasMindMap(doc_id){
  let data = {}
  data.doc_id = doc_id
  return post("/mp/has", data)
}


export function storeMindMap(doc_id, content){
  let data = {}
  data.doc_id = doc_id
  data.content = content
  return post("/mp/store", data)
}

export function userTypeSet(content){
  let data = {}
  data.cont = content
  return post("/ai/typeset", data)
}
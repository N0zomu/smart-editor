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
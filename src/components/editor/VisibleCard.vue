<template>
  <p>智能可视化</p>
  <el-card style="margin:10px 10px 10px 0" v-loading="aiLoading">
    <el-empty v-if="!hasMindMap" description="暂无思维导图"></el-empty>
    <el-button @click="visible" v-if="!hasMindMap" :disabled="!uStore.isVIP">💎获取思维导图</el-button>
    <el-space v-else direction="vertical">
      <el-icon  size="50" color="#67C23A"><CircleCheck /></el-icon>
      <el-text type="info">该文档的思维导图已存在！</el-text>
      <el-button @click="goMindMap">查看思维导图</el-button>
      <el-button @click="visible">重新生成</el-button>
    </el-space>
  </el-card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import { useEditorStore } from '@/stores/heading'
import {mindStore} from '@/stores/mindmap';
import {getMindMap, userHasMindMap, storeMindMap} from '@/api/ai';
import { userStore } from '@/stores/user'
import {ElMessage} from 'element-plus';
import {useRoute, useRouter} from 'vue-router';
import mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'

const mindMapStore = mindStore()
const route = useRoute()
const router = useRouter()
const uStore = userStore()
const editorStore = useEditorStore()
const aiLoading = ref(true)
const hasMindMap = ref(false)
const mindmapVisible = ref(false)

onMounted(()=>{
  
})

var promise = userHasMindMap(parseInt(route.params.docId))
  promise.then((res)=>{
    aiLoading.value = false
    if(res.code){
      mindMapStore.data = JSON.parse(res.content)
      hasMindMap.value = true
    }
  })

function visible(){
  if(!uStore.isVIP){
    return
  }else{
    aiLoading.value = true
    var cont =  JSON.stringify(editorStore.editorInstance.getJSON())
    getMindMap(cont).then((res)=>{
      hasMindMap.value = true
      try{
        storeMindMap(parseInt(route.params.docId), res.answer)
        mindMapStore.data = JSON.parse(res.answer)
      }catch(error){
        ElMessage({
          message: "生成失败...请精简你的文章，或重试一次。",
          type: 'error',
        })
      }
      
      aiLoading.value = false
    })
  }
}

function goMindMap(){
  const r = router.resolve({
    path:'/map'
  })
  window.open(r.href)
}

</script>

<style>

</style>
<template>
  <p>智能可视化</p>
  <el-card style="margin:10px 10px 10px 0" v-loading="aiLoading">
    <el-text>
      获取思维导图
    </el-text>
    <el-button @click="visible"></el-button>
  </el-card>
</template>

<script setup>
import {ref} from 'vue';
import { useEditorStore } from '@/stores/heading'
import {getMindMap} from '@/api/ai';
import { userStore } from '@/stores/user'
import {ElMessage} from 'element-plus';


const uStore = userStore()
const editorStore = useEditorStore()
const aiLoading = ref(false)


function visible(){
  if(!uStore.isVIP){
    return
  }else{
    aiLoading.value = true
    var cont = cont = JSON.stringify(editorStore.editorInstance.getJSON())
    getMindMap(cont).then((res)=>{
      console.log(res.answer)
      aiLoading.value = false
    })
  }
}
</script>

<style>

</style>
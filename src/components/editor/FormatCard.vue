<template>
  <p>智能格式</p>
  <el-card style="margin:10px 10px 10px 0" v-loading.fullscreen.lock="aiLoading">
    <el-button @click="setType">智能排版</el-button>
  </el-card>
  <div>
    <p>💎使用模板</p>
    <el-card style="margin:10px 10px 10px 0" >
      <el-select
        v-model="modeName"
        placeholder=""
        style="width: 250px; margin-bottom:15px"
      >
        <el-option
          v-for="item in modeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-space direction="vertical">
        <el-image style="width: 250px; height: 400px" :src="modeOptions.at(parseInt(modeName)-1).img" fit="fill" />
        <el-button @click="setM" :disabled="!uStore.isVIP">使用</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import { useEditorStore } from '@/stores/heading'
import { userStore } from '@/stores/user'
import {ElMessage} from 'element-plus';
import {useRoute, useRouter} from 'vue-router';
import {userTypeSet} from '@/api/ai';
import {dachuang, resume, business_plan, competation} from '@/assets/js/template';

const route = useRoute()
const router = useRouter()
const uStore = userStore()
const editorStore = useEditorStore()
const aiLoading = ref(false)
const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
const modeName = ref('1')
const modeOptions = [
  {
    value: '1',
    label: '大创项目书',
    img: require('@/assets/images/dc.png'),
    js : dachuang
  },
  {
    value: '2',
    label: '个人求职简历',
    img: require('@/assets/images/resume.png'),
    js : resume
  },
  {
    value: '3',
    label: '商业计划书',
    img: require('@/assets/images/com.png'),
    js : business_plan
  },
  {
    value: '4',
    label: '竞赛文书',
    img: require('@/assets/images/compete.png'),
    js : competation
  },
]

function setType(){
  aiLoading.value = true
  var cont =  JSON.stringify(editorStore.editorInstance.getJSON())
  userTypeSet(cont).then((res)=>{
    try{
        editorStore.editorInstance.commands.setContent(res.answer)
      }catch(error){
        ElMessage({
          message: "排版失败...请精简你的文章，或重试一次。",
          type: 'error',
        })
      }

    aiLoading.value = false
  })
}

function setM(){
  var j = JSON.parse(modeOptions.at(parseInt(modeName.value)-1).js)
  editorStore.editorInstance.commands.setContent(j)
}

</script>

<style>

</style>
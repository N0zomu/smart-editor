<template>
  <p>多媒体信息提取</p>
  <el-card style="margin:10px 10px 10px 0">
    <el-upload
      v-if="fileLoading"
      v-model:file-list="fileList"
      class="upload-demo"
      action=''
      :http-request='upload'	
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      list-type="text"
      style="height:25vh; overflow:auto"
    >
      <el-button type="primary">Click to upload</el-button>
      <template #tip>
        <div class="el-upload__tip">
          可上传图片与pdf格式的文件
        </div>
      </template>
    </el-upload>
  </el-card>
  <el-card style="margin:10px 10px 10px 0;" v-if="previewVisible" v-loading="aiLoading">
    <el-image v-if="previewFile.type=='img'"
      style="width: 80px; height: 80px"
      :src="serverAddress + url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="srcList"
      :initial-index="4"
      fit="cover"
    />

    <audio controls v-if="previewFile.type=='voice'">
      <source :src="serverAddress + url">
    </audio>
    
    <el-link :href="serverAddress + url" v-if="previewFile.type=='pdf'" target="_blank">{{previewFile.name}}</el-link>
    <el-input
      v-model="previewFile.content"
      type="textarea"
      style="margin: 15px 0"
      :rows="8"
    />
    <div v-if="previewFile.content!=''">
      <el-button @click="updateOCR">修正</el-button>
      <el-button @click="insert">插入</el-button>
    </div>
    <div v-else>
      <p style="margin-bottom:10px;font-size:small;color:#909399">暂无结果</p>
      <el-input placeholder="💎输入想提取的内容关键词..." style="margin-bottom: 15px" v-model="keyWord" :disabled="!uStore.isVIP"></el-input>
      <el-button @click="OCR">提取内容</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRoute} from 'vue-router';
import {userUploadFile, allFile, deleteFile} from '@/api/file';
import {ElMessage} from 'element-plus';
import { useEditorStore } from '@/stores/heading'
import {userGetOCR, VIPGetOCR} from '@/api/ai';
import {updateFile} from '@/api/file';
import { userStore } from '@/stores/user'

const uStore = userStore()
const editorStore = useEditorStore()
const localAddress = "http://127.0.0.1:8000"
const serverAddress = "http://152.136.110.235"
const route = useRoute()
const doc_id = parseInt(route.params.docId)
const previewVisible = ref(false)
const previewFile = ref()
const keyWord = ref('')
const aiLoading = ref(false)
const url =
  ref('https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg')
const srcList = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
])

const textarea = ref('')
const fileList = ref([
])
const fileLoading = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
  deleteFile(uploadFile.file_id).then((res)=>{
    console.log(uploadFile.file_id)
    ElMessage({
      message: "删除文件成功！",
      type: 'success',
    })
  })
}

const handleChange = (uploadFile, uploadFiles) => {
  console.log(uploadFile)
  fileList.value.push({
    name: uploadFile.name,
    url: uploadFile.url,
    content: '',
    type: 'image',
  })
  console.log(fileList.value)
}

const beforeUpload = (rawFile) => {
  var t = rawFile.name.split('.').at(-1)
  console.log(t)
  if (!['jpeg', 'jpg', 'gif', 'png', 'svg', 'pdf'].includes(t)) {
    console.log(111)
    ElMessage.error('接受的图片格式：jpeg, jpg, gif, png, svg')
    ElMessage.error('接受的文档格式：pdf')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Avatar picture size can not exceed 10MB!')
    return false
  }
  return true
}

const handlePreview = (file) => {
  console.log(file)
  previewVisible.value = true
  previewFile.value = file
  url.value = file.url
  srcList.value = [serverAddress + file.url]
  textarea.value = file.content
}

onMounted(()=>{
  allFile(doc_id).then((res)=>{
    fileList.value = res.res
    fileLoading.value = true
  })
})

function insert(){
  var pos = editorStore.editorInstance.view.state.selection.$anchor.pos
  console.log(previewFile.value.content)
  editorStore.editorInstance.commands.insertContentAt(pos, `<p>${previewFile.value.content}</p>`)
}

function upload(uploadFile){
  console.log(uploadFile.file)
  userUploadFile(doc_id, uploadFile.file).then((res)=>{
    fileList.value.pop()
    fileList.value.push({
      file_id: res.file_id,
      name: res.file_name,
      url: res.url,
      content: '',
      type: res.file_type,
    })
  })
}

function OCR(){
  aiLoading.value = true
  console.log(previewFile.value.file_id)
  if(uStore.isVIP&&keyWord.value!=''){
    VIPGetOCR(previewFile.value.file_id, keyWord.value).then((res)=>{
      if(res.code == 1){
        previewFile.value.content = res.res.llmResult
        updateFile(previewFile.value.file_id, previewFile.value.content)
      }else{
        ElMessage({
          message: "something goes wrong...",
          type: 'error',
        })
      }
      aiLoading.value = false
    })
  }else{
    userGetOCR(previewFile.value.file_id).then((res)=>{
      if(res.code == 1){
        previewFile.value.content = res.res
        updateFile(previewFile.value.file_id, previewFile.value.content)
      }else{
        ElMessage({
          message: "something goes wrong...",
          type: 'error',
        })
      }
      aiLoading.value = false
    })
  }
}

function updateOCR(){
  updateFile(previewFile.value.file_id, previewFile.value.content).then((res)=>{
    ElMessage({
      message: "已保存修正",
      type: 'success',
    })
  })
}
</script>

<style>

</style>
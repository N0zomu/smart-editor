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
          可上传图片，音频，以及pdf格式的文件
        </div>
      </template>
    </el-upload>
  </el-card>
  <el-card style="margin:10px 10px 10px 0" v-if="previewVisible">
    <el-image v-if="previewFile.type=='img'"
      style="width: 100px; height: 100px"
      :src="localAddress + url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="srcList"
      :initial-index="4"
      fit="cover"
    />

    <audio controls v-if="previewFile.type=='voice'">
      <source :src="localAddress + url">
    </audio>
    
    <el-link :href="localAddress + url" v-if="previewFile.type=='pdf'" target="_blank">{{previewFile.name}}</el-link>
    <el-input
      v-model="previewFile.content"
      type="textarea"
      style="margin: 15px 0"
      :rows="8"
    />
    <div v-if="previewFile.content!=''">
      <el-button>修正</el-button>
      <el-button @click="insert">插入</el-button>
    </div>
    <div v-else>
      <p style="margin-bottom:10px;font-size:small;color:#909399">暂无结果</p>
      <el-button>提取内容</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRoute} from 'vue-router';
import {userUploadFile, allFile, deleteFile} from '@/api/file';
import {ElMessage} from 'element-plus';
import { useEditorStore } from '@/stores/heading'

const editorStore = useEditorStore()
const localAddress = "http://127.0.0.1:8000"
const serverAddress = "http://152.136.110.235"
const route = useRoute()
const doc_id = parseInt(route.params.docId)
const previewVisible = ref(false)
const previewFile = ref()
const url =
  ref('https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg')
const srcList = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
])

const textarea = ref('')
const fileList = ref([
  // {
  //   name: 'food.jpeg',
  //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  //   content: 'OCR识别成果1',
  //   type: 'img'
  // },
  // {
  //   name: 'food2.jpeg',
  //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  //   content: 'OCR识别成果2',
  //   type: 'img'
  // },
  // {
  //   name: 'hello.mp3',
  //   url: 'http://127.0.0.1:8000/api/media/file/1/%E8%BF%B7%E6%98%9F%E5%8F%AB.mp3',
  //   content: '',
  //   type: 'voice'
  // },
  // {
  //   name: 'test.pdf',
  //   url: 'http://127.0.0.1:8000/api/media/file/1/2024%E5%B0%8F%E5%AD%A6%E6%9C%9F%E9%9C%80%E6%B1%82%E7%AE%80%E8%BF%B0_final%E7%89%88%E6%9C%AC.pdf',
  //   content: '',
  //   type: 'pdf'
  // },
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
  if (!['jpeg', 'jpg', 'gif', 'png', 'svg', 'pdf', 'mp3', 'wav', 'flac'].includes(t)) {
    console.log(111)
    ElMessage.error('接受的图片格式：jpeg, jpg, gif, png, svg')
    ElMessage.error('接受的文档格式：pdf')
    ElMessage.error('接受的音频格式：mp3, wav, flac')
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
  srcList.value = [localAddress + file.url]
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
</script>

<style>

</style>
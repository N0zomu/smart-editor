<template >
  <div v-loading="aiLoading"
      element-loading-text="请不要走开，AI正在处理中...">
    <p>智能润色</p>
    <el-card style="margin:10px 10px 10px 0">
      <el-space direction="vertical" >
        <el-space>
          <el-text>💎特定场景</el-text>
          <el-select
            v-model="env"
            placeholder="Select"
            style="width: 200px"
            :disabled="!uStore.isVIP"
          >
            <el-option
              v-for="item in EnvOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-space>

        <el-space>
          <el-text>💎具体说明</el-text>
          <el-input 
            v-model="input"
            style="width: 200px"
            placeholder="如：文档主题，应用场景等。"
            :disabled="!uStore.isVIP"
            ></el-input>
        </el-space>

        <el-space>
          <el-text>辅助功能</el-text>
          <el-select
            v-model="handle"
            placeholder="Select"
            style="width: 210px"
          >
            <el-option
              v-for="item in handleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-space>
        
        <el-button @click="confirm">确认</el-button>
      </el-space>
    </el-card>

    <el-card style="margin:10px 10px 10px 0" v-if="resultVisible" >
      <p>结果</p>
      <el-input
        v-model="result"
        type="textarea"
        style="margin: 15px 0"
        :rows="18"
      />
      <el-button @click="insert">插入</el-button>
    </el-card>
  </div>
  

  <el-dialog title="确认" v-model="confirmVisible" width="800">
    <div v-if="selection!=''">
      <p style="text-align:left;font-weight:bold;font-size:large">即将处理的段落为：</p>
      <el-scrollbar height="400px">
        <p style="white-space: pre-line;text-align:left">{{selection}}</p>
      </el-scrollbar>
    </div>
    <div v-else style="font-size:large;margin-bottom:15px">
      <p v-if="handle!='1'&&handle!='3'">未选择段落，请返回选择</p>
      <p v-else>未选择段落，即将处理全文</p>
    </div>
    <el-text style="font-size:large">处理类型：</el-text>
    <el-text tag="b" style="font-size:large">{{handleOptions.at(parseInt(handle)-1).label}}</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button type="primary" @click="AiPolish">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from 'vue';
import { useEditorStore } from '@/stores/heading'
import {userPolish, vipPolish} from '@/api/ai';
import { userStore } from '@/stores/user'
import {ElMessage} from 'element-plus';


const uStore = userStore()
const editorStore = useEditorStore()

const env = ref('1')
const handle = ref('1')
const input = ref('')
const selection = ref('')
const confirmVisible = ref(false)
const resultVisible = ref(false)
const result = ref('')
const aiLoading = ref(false)

const EnvOptions = [
  {
    value: '1',
    label: '课程大作业',
  },
  {
    value: '2',
    label: '学术论文',
  },
  {
    value: '3',
    label: '大创项目书文档',
  },
  {
    value: '4',
    label: '竞赛文书',
  },
  {
    value: '5',
    label: '软件开发文档',
  },
]
const testStr = ref("{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"你好\"}]},{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"一级标题\"}]},{\"type\":\"heading\",\"attrs\":{\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"二级标题\"}]},{\"type\":\"heading\",\"attrs\":{\"level\":3},\"content\":[{\"type\":\"text\",\"text\":\"三级标题\"}]},{\"type\":\"heading\",\"attrs\":{\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"四级标题\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"识别结果\"}]},{\"type\":\"paragraph\"}]}")
const handleOptions = [
  {
    value: '1',
    label: '摘要',
  },
  {
    value: '2',
    label: '润色',
  },
  {
    value: '3',
    label: '续写',
  },
  {
    value: '4',
    label: '修改病句',
  },
  {
    value: '5',
    label: '翻译为英语',
  },
  {
    value: '6',
    label: '翻译为中文',
  },
]
function confirm(){
  selection.value = window.getSelection().toString()
  confirmVisible.value = true
}

function AiPolish(){
  confirmVisible.value = false
  
  if(selection.value==''&&['2', '4', '5', '6'].includes(handle.value)){
    return
  }

  
  aiLoading.value = true


  var cont = ""
  if(selection.value=='')
    cont = JSON.stringify(editorStore.editorInstance.getJSON())
  else
    cont = selection.value
  if(cont.length > 3000){
    ElMessage({
      message: "处理的文本过长！",
      type: 'error',
    })
    return
  } 
  var func = ''
  if(handle.value=='1') func = 'summary'
  else if(handle.value=='2') func = 'polish'
  else if(handle.value=='3') func = 'continue'
  else if(handle.value=='4') func = 'revise'
  else if(handle.value=='5') func = 'translateE'
  else if(handle.value=='6') func = 'translateC'


  if(uStore.isVIP){
    var e = EnvOptions.at(parseInt(env.value)-1).label
    var d = input.value
    vipPolish(e, d, cont, func).then((res)=>{
      if(res.code == 1){
        resultVisible.value = true
        result.value = res.answer
      }else{
        ElMessage({
          message: "something goes wrong...",
          type: 'error',
        })
      }
      aiLoading.value = false
    })
    
  }
  else{
    userPolish(cont, func).then((res)=>{
      if(res.code == 1){
        resultVisible.value = true
        result.value = res.answer
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

function insert(){
  var pos = editorStore.editorInstance.view.state.selection.$anchor.pos
  editorStore.editorInstance.commands.insertContentAt(pos, `<p>${result.value}</p>`)
}

function alter(){
  editorStore.editorInstance.commands.setContent(JSON.parse(testStr.value), false)
}
</script>

<style>

</style>
<template>
  <div class="EditHeader">
    <el-row style="height:100%">
      <el-col :span="12" style="display:flex">
        <el-space style="margin:auto 0;">
          <el-button-group style="margin:0 25px">
            <el-button type="primary" icon="ArrowLeftBold" @click="goBack"/>
            <el-button type="primary" @click="saveContent">保存</el-button>
          </el-button-group>
          <el-text tag="b" style="font-size:x-large">{{docName}}</el-text>
          <el-text tag="i" style="margin-left:25px">{{updateTime}}前</el-text>
          <el-tooltip
            effect="dark"
            content="已连接在线服务器"
            placement="bottom"
            v-if="webAcc"
          >
            <el-icon  color="#67C23A"><CircleCheck /></el-icon>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="连接在线服务器失败"
            placement="bottom"
            v-else
          >
            <el-icon color="#F56C6C"><Warning /></el-icon>
          </el-tooltip>
          
        </el-space>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-space>
          <el-tooltip
          effect="dark"
          content="与团队协作"
          placement="bottom"
          >
            <el-button :disabled="!webAcc"
              type="primary" icon="User" style="margin-right:10px;margin-top:10px" v-if="team_id!=0" @click="teamVisible=true">{{teamName}}</el-button>
          </el-tooltip>
          <el-popover
            placement="bottom"
            :width="200"
            trigger="click"
          >
            <div
              class="demo-rich-conent"
              style="display: flex; gap: 16px; flex-direction: column;text-align: center;"
            >
              <el-avatar v-if="!docLoading"
                :size="60"
                :src="'http://152.136.110.235'+iconURL"
                style="margin-bottom: 8px;margin-left: 50px">
                user
              </el-avatar>
              <div>
                <p
                  class="demo-rich-content__name"
                  style="margin: 0; font-weight: bold"
                >
                  {{nickname}}{{uStore.isVIP?"💎":""}}
                </p>
                <p
                  class="demo-rich-content__mention"
                  style="margin: 0; font-size: 14px; color: var(--el-color-info)"
                >
                  {{email}}
                </p>
              </div>
              <el-divider class="press-divider"/>
              <el-link :underline="false" :href="`/user`">个人主页</el-link>
              <el-divider class="press-divider"/>
              <el-link :underline="false" type="danger" @click="logout">退出登录</el-link>
            </div>
            <template #reference>
              <el-avatar :src="'http://152.136.110.235'+iconURL" style="margin-right:15px;margin-top:10px;cursor:pointer;"> user </el-avatar>
            </template>
          </el-popover>
        </el-space>
      </el-col>
    </el-row>
  </div>
  <div class="EditMain" ref="filecont">
    <!-- <ul v-show="visiblemenu" :style="{ left: position.left + 'px', top: position.top + 'px', display: (visiblemenu ? 'block' : 'none') }" class="contextmenu">
      <div class="item"  @click="polish()">
        <el-icon><Service /></el-icon>润色
      </div>
      <div class="item" @click="continuation()">
        <el-icon><Service /></el-icon>续写
      </div>
    </ul> -->
    
    <div class="lefttools">
      <outline></outline>
      <el-card class="func_card" @click="download">
        <p>导出文档</p>
      </el-card>
    </div>

    <div class="editor" >
      <div class="editorcard">
        <div class="toptools">
          <editor-menu :editor="editor"></editor-menu>
        </div>
        <div class="editcont">
          <EditorContent v-loading.fullscreen.lock="docLoading"
            @scroll="hasscroll()"
            @mousemove="mousemove()"
            @mouseup="selecttext($event)"
            style="padding: 8px;  overflow-y: auto; text-align:left"
            :editor="editor"
            />
        </div>
        <div class="bottomcount">
          字数统计:
          {{ editor?.storage.characterCount.characters() }}
        </div>
      </div>
    </div>
    
    <div class="righttools">

      <el-tabs style="margin-top:20px" v-model="activeName">
        <el-tab-pane name="first">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Tools /></el-icon>
              <span>润色</span>
            </span>
          </template>
          <polish-card></polish-card>
        </el-tab-pane >
        <el-tab-pane name="second">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Menu /></el-icon>
              <span>格式</span>
            </span>
          </template>
          <format-card></format-card>
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><HelpFilled /></el-icon>
              <span>可视化</span>
            </span>
          </template>
          <visible-card></visible-card>
        </el-tab-pane>
        <el-tab-pane name="fourth">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><PictureFilled /></el-icon>
              <span>提取</span>
            </span>
          </template>
          <upload-card></upload-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <el-dialog v-model="teamVisible" title="团队协作" width="500">
    <el-scrollbar height="400px" v-loading = "teamMemberLoading">
      <el-row style="margin-top:10%;margin-bottom:10%;cursor:pointer" v-for="member in teamMemberList" :key="member.user_id" 
      v-show="member.user_id!=uStore.user_id" @click="inviteMember(member)">
        <el-col :span="4">
          <el-avatar
            :size="50"
            :src="'http://152.136.110.235'+member.icon"
          >
            user
          </el-avatar>
        </el-col>
        <el-col :span="20">
          <div style="margin-top: 10px;text-align:left">
            <p style="margin: 0; font-weight: bold">{{member.nickname}}</p>
            <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">{{member.email}}</p>
          </div>
        </el-col>
      </el-row>
      
    </el-scrollbar>
  </el-dialog>
</template>


<script setup>
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import { Editor, EditorContent, useEditor, BubbleMenu } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Blockquote from '@tiptap/extension-blockquote'
import Highlight from '@tiptap/extension-highlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { common, createLowlight } from 'lowlight'
import { userStore } from '../stores/user.js'
const lowlight = createLowlight()
lowlight.register({ html, ts, css, js })

import { useEditorStore } from '@/stores/heading'
const editorStore = useEditorStore()
const uStore = userStore()

import EditorMenu from '@/components/editor/EditorMenu.vue'
import Outline from '@/components/editor/Outline.vue'
import { ElMessage } from 'element-plus'
import {docContent, updateDoc} from '@/api/document';
import moment from 'moment';
import {teamMembers} from '@/api/team';
import {sendDocMsg} from '@/api/message';

import PolishCard from '@/components/editor/PolishCard.vue';
import FormatCard from '@/components/editor/FormatCard.vue';
import UploadCard from '@/components/editor/UploadCard.vue';
import VisibleCard from '@/components/editor/VisibleCard.vue';
import {TiptapCollabProvider} from "@hocuspocus/provider";
import * as Y from "yjs";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

import TurndownService from 'turndown';
const store = userStore()


const route = useRoute()
const router = useRouter()

const doc = new Y.Doc()
const hashcode = useRoute().params.docId;


function checkInternetConnectivity(timeout = 5000) { // timeout参数，默认为5秒
    return new Promise((resolve, reject) => {
        const url = 'https://www.google.com/favicon.ico';
        const img = new Image();

        // 设定超时
        const timer = setTimeout(() => {
            img.src = ''; // 取消图像加载
            reject(new Error('Timeout'));
        }, timeout);

        img.onload = () => {
            clearTimeout(timer); // 如果加载成功，清除超时
            resolve(true);
        };

        img.onerror = () => {
            clearTimeout(timer); // 如果加载失败，清除超时
            reject(new Error('Error loading image'));
        };

        img.src = `${url}?t=${new Date().getTime()}`; // 加一个时间戳参数防止缓存
    });
}


// Connect to your Collaboration server
const provider = ref()
provider.value = new TiptapCollabProvider({
  name: hashcode, // Unique document identifier for syncing. This is your document name.
  appId: 'j9yp3691', // Your Cloud Dashboard AppID or `baseURL` for on-premises
  token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjA5Njg0MTIsIm5iZiI6MTcyMDk2ODQxMiwiZXhwIjoxNzIxMDU0ODEyLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJqOXlwMzY5MSJ9.zBzDnYeWhfu91waPM9KmVHmKQUZXwOLo2JMy3yzwbmg', // Your JWT token
  document: doc,
  // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content insertion on editor syncs.
  onSynced() {
    docLoading.value = false
    if( !doc.getMap('config').get('initialContentLoaded') && editor ){
      docLoading.value = true
      doc.getMap('config').set('initialContentLoaded', true);
      docContent(route.params.docId).then((res)=>{
        if(res.content!=''){
          loadHeadings()
          editor.value.commands.clearContent()
          editor.value.commands.setContent(JSON.parse(res.content), false)
          docLoading.value = false
        }
      })
      // editor.value.commands.setContent(`
      // <p>
      //   欢迎使用智能编辑器!
      // </p>
      // `)
      
    }

  }
})

function getColorBasedOnValue(value) {
  if (value % 5 === 0) {
    return '#7cfa17';
  } else if (value % 5 === 1) {
    return '#38b7e8';
  } else if (value % 5 === 2) {
    return '#ff6666';
  } else if (value % 5 === 3) {
    return '#cc33ff';
  } else {
    return '#ffdf3c';
  }
}

const editor = useEditor({
  content: ``,
  extensions: [
    StarterKit,
    TaskList,
    TaskItem,
    Placeholder.configure({
      placeholder: '开始输入文本 …'
    }),
    OrderedList,
    BulletList,
    ListItem,
    CharacterCount.configure({
      limit: 35000
    }),
    Highlight.configure({ multicolor: true }),
    Blockquote,
    // Document,
    // Paragraph,
    // Text,
    Collaboration.configure({
      document:doc,
    }),
    CollaborationCursor.configure({
      provider: provider.value,
      user: {
        name: store.nickname,
        color: getColorBasedOnValue(store.user_id),
      },
    }),
  ],
  onUpdate({ edit }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
  },
  onCreate({ edit }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
  },
  injectCSS: false
})

const turndownService = new TurndownService();
const download = ()=>{
  const blob = new Blob([turndownService.turndown(editor.value.getHTML())], {
    type: 'text/markdown'
  })
  const objectURL = URL.createObjectURL(blob)
  const aTag = document.createElement('a')
  aTag.href = objectURL
  aTag.download = docName.value+'.md'
  aTag.click()
  URL.revokeObjectURL(objectURL)
}
const insert=()=>{
  editor.value.commands.insertContent('Example Text')
}
const undo=()=>{
  editor.value.commands.undo()
}
const redo=()=>{
  editor.value.commands.redo()
}

const loadHeadings = () => {
  const headings = []
  if (!editor.value) return
  const transaction = editor.value.state.tr
  if (!transaction) return
  editor.value?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      const start = pos
      const end = pos + node.content.size
      // const end = pos + node
      const id = `heading-${headings.length + 1}`
      if (node.attrs.id !== id) {
        transaction?.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          id
        })
      }

      headings.push({
        level: node.attrs.level,
        text: node.textContent,
        start,
        end,
        id
      })
    }
  })

  transaction?.setMeta('addToHistory', false)
  transaction?.setMeta('preventUpdate', true)

  editor.value?.view.dispatch(transaction)
  editorStore.setHeadings(headings)
}

//############################ my code #############################
let doc_id = ref(0)
let docLoading = ref(true)
let docName = ref('')
let updateTime = ref('')
let team_id = ref(0)
let teamName = ref('')
let iconURL = ref(uStore.icon)
let nickname = ref(uStore.nickname)
let email = ref(uStore.email)
const activeName = ref('fourth')
const teamVisible = ref(false)
let teamMemberList = ref([])
let teamMemberLoading = ref(true)
const tiptapLoading = ref(true)
const webAcc = ref(false)

// 绑定ctrl+S
window.addEventListener('keydown', handleSave);

function handleSave(event){
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    if(route.name=="doc"){
      saveContent()
    }
  }
}

onMounted(() => {
  checkInternetConnectivity(5000) // 设置超时时间为3秒
    .then(() => {
      console.log('Internet is reachable.')
      webAcc.value = true
    })
    .catch(error => {
      console.log(`Internet is not reachable. Reason: ${error.message}`)
      webAcc.value = false
      docContent(route.params.docId).then((res)=>{
        if(res.content!=''){
          editor.value.commands.clearContent()
          editor.value.commands.setContent(JSON.parse(res.content), false)
          loadHeadings()
          docLoading.value = false
        }
      })
    });
  doc_id.value = parseInt(route.params.docId)
  docContent(doc_id.value).then((res)=>{
    docName.value = res.doc_name
    // if(res.content!=''){
    //   editor.value.commands.setContent(JSON.parse(res.content), false)
    // }
    loadHeadings()
    team_id.value = res.team_id
    teamName.value = res.team_name
    let m1 = moment(res.update_time)
    let now = moment()
    let duration = moment.duration(now.diff(m1))
    updateTime.value = duration.humanize()
    // docLoading.value = false


    teamMembers(team_id.value).then((res)=>{
      teamMemberList.value = res.res
      teamMemberLoading.value = false
    })
  })

});

function logout(){
  uStore.logout()
  ElMessage({
    message: "已退出登录！",
    type: 'success',
  })
  router.push({ path: "/login" })
}

function analyseTime(duration){
  let retStr = '编辑于'
  if(duration.years!=0){
    retStr = retStr.concat(`${duration.years}年前`)
    return retStr
  }
  if(duration.months!=0){
    retStr = retStr.concat(`${duration.months}月前`)
    return retStr
  }
  if(duration.days!=0){
    retStr = retStr.concat(`${duration.days}日前`)
    return retStr
  }
  if(duration.hours!=0){
    retStr = retStr.concat(`${duration.hours}小时`)
  }
  if(duration.minutes!=0){
    retStr = retStr.concat(`${duration.minutes}分钟`)
  }if(duration.seconds!=0){
    retStr = retStr.concat(`${duration.seconds}秒`)
  }
  retStr = retStr.concat(`前`)
  return retStr
}

function goBack(){
  router.go(-1)
}

function saveContent(){
  var content = editor.value.getJSON()
  updateDoc(doc_id.value, JSON.stringify(content)).then((res)=>{
    if(res.code==1){
      ElMessage({
        message: "保存成功！",
        type: 'success',
      })
      updateTime.value = 'a few seconds'
    }
  })
}

function inviteMember(member){
  sendDocMsg(member.user_id, team_id.value, doc_id.value).then((res)=>{
    ElMessage({
      message: "已发送协作邀请！",
      type: 'success',
    })
    teamVisible.value = false
  })
}

// 在组件卸载前销毁Editor实例
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSave)
  editor.value?.destroy();
});

// 划词润色
const aipolish = ref("")
const aicontinuation = ref("")
const visiblemenu = ref(false)
const position = ref({
  top: 0,
  left: 0
})
const filecont = ref()
var hasmove=ref(false);
var hisstring;
var selection;
//进行润色的函数
const polish=()=>{
  ailoading.value=true
  visiblemenu.value = false;
  let formData = new FormData();
  formData.append("username","123456");
  formData.append("key","xxxxxxx");
  formData.append("cont",hisstring);
  let url = 'http://127.0.0.1:5000/getpolish' //访问后端接口的url
  let method = 'post'
  axios({
    method,
    url,
    data: formData,
  }).then(res => {
    var tpcard1={"title":"ai辅助评审","cont":hisstring,"review":res.data}
    ailist.value.push(tpcard1)
    navigator.clipboard.writeText(res.data)
    showMessage()
    ailoading.value=false
  });
}

//进行aiaireview
const continuation=()=>{
  ailoading.value=true
  visiblemenu.value = false;
  let formData = new FormData();
  formData.append("username","123456");
  formData.append("key","xxxxxxx");
  formData.append("cont",hisstring);
  let url = 'http://127.0.0.1:5000/getpolish' //访问后端接口的url
  let method = 'post'
  axios({
    method,
    url,
    data: formData,
  }).then(res => {   
    showMessage()
    ailoading.value=false
  });
}

// 获取选中的文字
const selecttext= (e)=>{
  selection = window.getSelection();
  if(selection!=null&&hisstring!=selection){
    
    var content = selection.toString();
    if(content!=""){
        var rect = filecont.value.getBoundingClientRect();
        visiblemenu.value = true
        // alert(e.clientY)
        // alert(e.clientX)
        position.value.top =  e.clientY;
        position.value.left =e.clientX;
        hisstring=content
      }
    // alert(content)
  }
  else{
    hisstring=""
  }
}
  //鼠标移动
const mousemove=()=>{
  hasmove.value=true;
}
  //鼠标点击
 const notsee=()=>{
  visiblemenu.value = false;
  selection=null;
}
  //滚轮滚动
const hasscroll=()=>{
  visiblemenu.value = false;
  // window.getSelection().removeAllRanges()
}


</script>

<style scoped>
.EditHeader{
  width:100vw;
  height: 7vh;
  background: #ecf5ff;
  border:1px solid #DCDFE6;
  text-align: left;
}
.EditMain{
  position: relative;
  width:100vw;
  height: 93vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;

}
.lefttools{
  background: linear-gradient(177deg, rgb(236, 245, 255),rgb(217, 236, 255));
  height: 100%;
  width: 100%;
}
.righttools{
  display: flex;
  flex-direction: column;
  background: linear-gradient(177deg, rgb(236, 245, 255),rgb(217, 236, 255));
  height: 100%;
  width: 100%;
}
.editor{
  background: linear-gradient(177deg, rgb(236, 245, 255),rgb(217, 236, 255));
}
.editorcard{
  position: relative;
  width:95%;
  height: 95%;
  left: 2.5%;
  top:2.5%;
  display: grid;
  grid-template-rows: 5% 92% 3%;
  border: 1px solid #4f5c5765;
  background: #FAFCFF;
}
.editorcard .editor{
  position: relative;
  width:100%;
  height: 100%;
  left: 0;
  top:0;
  display: grid;
  grid-template-rows: 10% 90%;
}
.editorcard .editor{
  position: relative;
  width:100%;
  height: 100%;
  left: 0;
  top:0;
  display: grid;
  grid-template-rows: 10% 90%;
}
.toptools{
  background-color: rgba(207, 220, 245, 0.199);
  border-bottom: 1px dashed #9ca19f65;
}
.bottomcount{
  background-color: rgba(207, 220, 245, 0.199);
  border-top: 1px dashed #9ca19f65;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  justify-items: center;
  align-items: center;
}
.editcont{
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 80vh;
  overflow: auto;
}
</style>

<style lang="scss" scope>
b {
  font-weight: bold;
}
// .ProseMirror {
//   overflow-y: scroll;
// }
.ProseMirror p {
  margin: 0;
}
.ProseMirror:focus {
  outline: none;
}
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul {
    padding: 0 2rem;
    list-style: square;
  }
  ol {
    padding: 0 2rem;
    list-style: decimal;
  }
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
  :first-child {
    margin-top: 0;
  }
  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.contextmenu {
  width: 180px;
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding:5px;
  padding-left: 15px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns:50% 50%;
  .item {
    height: 35px;
    width:100%;
    line-height: 35px;
    color: rgb(29, 33, 41);
    cursor: pointer;
  }
  .item:hover {
    background: rgb(229, 230, 235);
  }
}
.press-divider{
	margin: 1px;
}

.func_card{
  margin:20px 20px 20px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
}

.func_card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  cursor: pointer;
}
</style>
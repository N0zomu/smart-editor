<template>
  <div style="display:flex;">
    <div class="editor">
      <div class="tools" id="tools" v-if="editor" >
        <el-button class="toolbtn" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          粗体
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          斜体
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          删除线
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
          代码风格
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().setHorizontalRule().run()">
          分隔线
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          无序列表
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
          有序列表
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().unsetAllMarks().run()">
          清除格式
        </el-button>
        <br>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          h1
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          h4
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          h5
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          h6
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
          段落
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
          代码段
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
          引用块
        </el-button>
        <br>
        <el-button class="toolbtn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          撤销
        </el-button>
        <el-button class="toolbtn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          重做
        </el-button>
        <el-button class="toolbtn" @click="download">下载</el-button>
        <!--        <el-button class="toolbtn" @click="insert">插入文本</el-button>-->
      </div>
      <div  class="words" id="words" style="flex: 1;overflow-y: scroll">
        <editor-content :editor="editor"/>
      </div>

    </div>
    <div id="smartarea">
<!--<p style="font-size: 22px;font-weight: bold;text-align: center">智能编辑助手</p>-->
<!--      <br>-->
<!--        <el-space wrap :size="20">-->
          <div style="display:block;">
            <el-space direction="vertical">
              <p style="font-size: 18px;text-align: center">文字识别</p>
              <div>
                <el-button class="smartbtn" type="primary" plain round>图像转文字</el-button>
                <el-button class="smartbtn" type="primary" plain round>语音转文字</el-button>
                <el-button class="smartbtn" type="primary" plain round>视频转文字</el-button>
              </div>
            </el-space>
          </div>
          <el-divider border-style="dashed" />
          <div>
            <el-space direction="vertical">
              <p style="font-size: 18px;text-align: center">文本处理</p>
              <div>
                <el-button class="smartbtn" type="primary" plain round>摘要总结</el-button>
                <el-button class="smartbtn" type="primary" plain round>故事润色</el-button>
                <el-button class="smartbtn" type="primary" plain round>语句续写</el-button>
                <el-button class="smartbtn" type="primary" plain round>病句识别</el-button>
                <el-button class="smartbtn" type="primary" plain round>文本翻译</el-button>
              </div>
            </el-space>


          </div>
          <el-divider border-style="dashed" />
          <div>
            <el-space direction="vertical">
              <p style="font-size: 18px;text-align: center">格式排版</p>
              <div>
                <el-button class="smartbtn" type="primary" plain round>代码风格</el-button>
                <el-button class="smartbtn" type="primary" plain round>科研论文</el-button>
                <el-button class="smartbtn" type="primary" plain round>项目文档</el-button>
                <el-button class="smartbtn" type="primary" plain round>总结报告</el-button>
              </div>
            </el-space>
          </div>
          <el-divider border-style="dashed" />
          <div>
            <el-space direction="vertical">
              <p style="font-size: 18px;text-align: center">数据处理</p>
              <div>
                <el-button class="smartbtn" type="primary" plain round>表格生成</el-button>
                <el-button class="smartbtn" type="primary" plain round>思维导图</el-button>
                <el-button class="smartbtn" type="primary" plain round>图表绘制</el-button>
              </div>
            </el-space>
          </div>
      <div style="position:absolute;bottom: 20px;width: 230px">
        <p style="text-align: center">字符统计:{{wordcount}}</p>
      </div>
<!--        </el-space>-->
      </div>
  </div>


</template>

<script>
// import './styles.scss'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import CharacterCount from '@tiptap/extension-character-count'
import Text from '@tiptap/extension-text'
import {BubbleMenu, EditorContent, FloatingMenu, useEditor} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {nextTick, onBeforeUnmount, onDeactivated, onMounted, ref} from "vue";

import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

// Importing the provider
import { TiptapCollabProvider } from '@hocuspocus/provider'
import {useRoute} from "vue-router";
import {TextAlign} from "@tiptap/extension-text-align";
import {tiptapcloudJWT} from "@/assets/js/secretkey"

export default {
  components: {
    FloatingMenu,
    BubbleMenu,
    EditorContent,
  },
  name: "EditorCom",
  setup() {
    const doc = new Y.Doc()
    const hashcode = useRoute().params.hashcode;
    // const editor = ref();
    const content=ref(" ");
    // const provider=ref();
    const provider = new TiptapCollabProvider({
      name: hashcode, // Unique document identifier for syncing. This is your document name.
      appId: '89j48797', // Your Cloud Dashboard AppID or `baseURL` for on-premises
      token: tiptapcloudJWT,
      document: doc,
      //The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content insertion on editor syncs.
      onSynced() {
        if( !doc.getMap('config').get('initialContentLoaded') && editor ){
          doc.getMap('config').set('initialContentLoaded', true);
          editor.value.commands.setContent(`
        <p>
          欢迎使用智能编辑器 🎉
        </p>
        `)
        }

      }
    })
    content.value = "欢迎使用智能编辑器 🎉"
    const editor = useEditor({
      content: content.value,
      autofocus: true,
      onTransaction(transaction) {
        try {
          console.log("Transaction:", transaction);
        } catch (error) {
          console.error("Transaction Error:", error);
        }
      },
      extensions: [
        Document,
        Paragraph,
        Text,
        Heading,
        TextStyle,
          Color.configure({
            types:["textStyle"]
          }),
        Collaboration.configure({
          document:doc,
        }),
        StarterKit,
        CharacterCount.configure({
          mode:'textSize'
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'right','center','justify'],
          defaultAlignment: 'right',
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: 'Ma Zijie',
            color: '#f783ac',
            avatar: 'https://www.itxst.com/img/logov31.png',
          },
        }),
      ],
    })
    const wordcount = ref(0);
    // Connect to your Collaboration server



    const download = ()=>{
      const blob = new Blob([editor.value.getText()], {
        type: 'text/markdown'
      })
      const objectURL = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.href = objectURL
      aTag.download = "new.txt"
      aTag.click()
      URL.revokeObjectURL(objectURL)
    }
    const insert=()=>{
      editor.value.commands.insertContent('Example Text')
    }
    // const complete=()=>{
    //   editor.value.chain().focus().
    // }
    const undo=()=>{
      editor.value.commands.undo()
    }
    const redo=()=>{
      editor.value.commands.redo()
    }

    function wordcountrefresh(){
      wordcount.value = editor.value.storage.characterCount.characters();
    }
    const topElement=ref();
    const bottomElement=ref();
    let lasttopHeight=0;
    function adjustBottomHeight() {
      const topHeight = topElement.value.offsetHeight;
      if(lasttopHeight !== topHeight){
        lasttopHeight = topHeight;
        bottomElement.value.style.setProperty('--top-height', `${topHeight}px`);
      }
    }
    onMounted(()=>{
      window.setInterval(wordcountrefresh, 200);//每0.2秒更新字符计数值
    })

    nextTick(()=>{
      topElement.value = document.getElementById('tools');
      bottomElement.value = document.getElementById('words');

      // Listen for changes in the top element's size
      console.log(topElement.value)
      new ResizeObserver(adjustBottomHeight).observe(topElement.value);
    })
    onDeactivated(()=>{
      // window.clearInterval();
    })
    onBeforeUnmount(()=>{
      editor.value.destroy();
    })

    return {
      editor,
      content,
      download,
      provider,
      insert,
      undo,
      redo,
      wordcount,
    }
  },
}
</script>

<style scoped lang="scss">
.tiptap {
> * + * {
  margin-top: 0.75em;
}
}
.editor {
  margin: 10px 20px;
  width: calc(100% - 290px);
  height:calc(100% - 20px);
  text-align: left;
}
.editor:deep(.ProseMirror) {
  color: #000000;
  border: solid 1px #ddd;
  padding: 0px 6px;
}
#smartarea{
  width: 250px;
  height: available;
  display: block;
  padding: 10px;
  text-align: left;
}
.tools {
  //display: flex;
  background-color: #eee;
  padding: 6px;
  width: 100%;
}
.words{
  height: calc(100vh - 120px - var(--top-height));
}

.tiptap p {
  margin: 1em 0;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0D0D0D;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}

.toolbtn{
  width: 100px;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  display: inline-block
}

.smartbtn{
  width: 100px;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  display: inline-block
}

.bubble-menu {
  display: flex;
  background-color: #0D0D0D;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    color: #FFF;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

.floating-menu {
  display: flex;
  background-color: #0D0D0D10;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

</style>
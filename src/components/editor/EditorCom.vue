<template>
  <div class="editor">
    <div class="tools">
      <button @click="download">下载</button>
      <button @click="insert">插入文本</button>
      <button @click="undo">撤销</button>
      <button @click="redo">重做</button>
      <span>字数:{{wordcount}}</span>
    </div>
    <editor-content :editor="editor" class="menu"/>
  </div>
  <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
  >
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      italic
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      strike
    </button>
  </bubble-menu>
<!--  <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">-->
<!--    left-->
<!--  </button>-->
<!--  <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">-->
<!--    center-->
<!--  </button>-->
<!--  <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">-->
<!--    right-->
<!--  </button>-->
<!--  <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">-->
<!--    justify-->
<!--  </button>-->
<!--  <button @click="editor.chain().focus().unsetTextAlign().run()">-->
<!--    unsetTextAlign-->
<!--  </button>-->


</template>

<script>
// import './styles.scss'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import CharacterCount from '@tiptap/extension-character-count'
import Text from '@tiptap/extension-text'
import {EditorContent,useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onBeforeUnmount, onDeactivated, onMounted, ref} from "vue";
import BubbleMenu from '@tiptap/extension-bubble-menu'

import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

// Importing the provider
import { TiptapCollabProvider } from '@hocuspocus/provider'
import {useRoute} from "vue-router";
import {TextAlign} from "@tiptap/extension-text-align";

export default {
  components: {
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
      token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTc0NjYzMTEsIm5iZiI6MTcxNzQ2NjMxMSwiZXhwIjoxNzE3NTUyNzExLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI4OWo0ODc5NyJ9.m-b_H7B3uH876-HBLirXUpwmpGvGsD1fIPCDqykeivQ', // Your JWT token
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
      extensions: [
        Document,
        Paragraph,
        Text,
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
          alignments: ['left', 'right','center','justify'],
          defaultAlignment: 'left',
        }),
        BubbleMenu.configure({
          element: document.querySelector('.menu'),
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

    onMounted(()=>{
      window.setInterval(wordcountrefresh, 200);//每0.2秒更新字符计数值
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
/*.focus {*/
/*  border-radius: 3px;*/
/*  box-shadow: 0 0 0 3px #68cef8;*/
/*}*/
.tiptap {
> * + * {
  margin-top: 0.75em;
}
}
.editor {
  margin: 10px 20px;
  width: calc(100% - 40px);
}
.editor:deep(.ProseMirror) {
  color: #000000;
  border: solid 1px #ddd;
  padding: 0px 6px;
}
.tools {
  display: flex;
  background-color: #eee;
  padding: 6px;
  justify-items: center;
}

/* Placeholder (at the top) */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
</style>
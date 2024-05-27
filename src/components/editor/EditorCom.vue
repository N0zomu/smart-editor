<template>
  <editor-content :editor="editor"/>
  <button @click="download">下载</button>
  <button @click="insert">插入文本</button>
<!--  <button @click="complete">自动补全</button>-->
  <button @click="undo">撤销</button>
  <button @click="redo">重做</button>
</template>

<script>
// import './styles.scss'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Focus from '@tiptap/extension-focus'
import {ref} from "vue";

import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'

// Importing the provider
import { TiptapCollabProvider } from '@hocuspocus/provider'
import {useRoute} from "vue-router";

export default {
  components: {
    EditorContent,
  },
  name: "EditorCom",
  setup() {
    const doc = new Y.Doc()
    const hashcode = useRoute().params.hashcode;
    // Connect to your Collaboration server
    const provider = new TiptapCollabProvider({
      name: hashcode, // Unique document identifier for syncing. This is your document name.
      appId: '89j48797', // Your Cloud Dashboard AppID or `baseURL` for on-premises
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTY3OTQxNTIsIm5iZiI6MTcxNjc5NDE1MiwiZXhwIjoxNzE2ODgwNTUyLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI4OWo0ODc5NyJ9.lSz2Pi1c5OEExAzk6SpAqfPCIKLRbGV-M3suCDWYbJg', // Your JWT token
      document: doc,
      // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content insertion on editor syncs.
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
    const content = ref("欢迎使用智能编辑器 🎉")
    const editor = useEditor({
      content: content.value,
      extensions: [
          Document,
          Paragraph,
          Text,
          Collaboration.configure({
            document:doc,
          }),
          StarterKit,
        // Focus.configure({
        //   className: 'focus',
        // })
      ],
    })

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

    return {
      editor,
      content,
      download,
      provider,
      insert,
      // complete,
      undo,
      redo
    }
  },
}
</script>

<style scoped>
/*.focus {*/
/*  border-radius: 3px;*/
/*  box-shadow: 0 0 0 3px #68cef8;*/
/*}*/
</style>
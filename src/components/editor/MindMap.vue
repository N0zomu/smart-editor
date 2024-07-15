<template>
  <div style="height:100%">
    <mindmap style="height:100vh"
      v-model="data"
      drag="true"
      zoom="true"
      edit="true"
      add-node-btn="true"
      ctm="true"
      download-btn="true"
      ></mindmap>
  </div>
</template>

<script setup>
import {mindStore} from '@/stores/mindmap';
import {ElNotification} from 'element-plus';
import {defineComponent} from 'vue';
import mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'

const mindMapStore = mindStore()
var data = mindMapStore.data

ElNotification({
    title: '注意',
    message: '您可以在本页面编辑思维导图。当您离开此页面时，您的编辑会丢失。若想保存您的编辑，请使用右下角的下载按钮。',
    duration: 0,
  })

</script>
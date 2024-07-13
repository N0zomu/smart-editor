<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="21" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">回收站</el-text>
        </el-col>
        <el-col :span="3">
          <el-space style="cursor: pointer;" @click="deleteAllC">
            <el-icon><Delete /></el-icon>
            <el-text>清空回收站</el-text>
          </el-space>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="desktop-main">
      <el-table :data="docTable" style="width: 100%" v-loading="docLoading" :key="rendertable">
        <el-table-column label="文件名">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon v-if="scope.row.is_folder"><folder /></el-icon>
              <el-icon v-if="!scope.row.is_folder"><document /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.doc_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="doc_creator" label="创建者"/>
        <el-table-column prop="update_time" label="删除时间" :formatter="formatDate2" sortable/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" plain @click=regain(scope.row)>
              <el-icon><RefreshRight /></el-icon>
            </el-button>
            <el-button type="danger"  @click=deleteC(scope.row)>
              <el-icon ><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {allDelete, regainDoc, completeDelete, completeDeleteAll} from '@/api/document';
import moment from 'moment'
import { ElMessage, ElNotification } from 'element-plus';

let docTable = reactive([])
let docLoading = ref(true)
let rendertable = ref(true)

onMounted(()=>{
  allDelete().then((res=>{
    docTable = res.res
    docLoading.value = false
  }))
})

function formatDate2(row, column){
  let duration = moment.duration(moment().diff(moment(row.update_time)))
  return duration.humanize()+' 前';
}

function regain(row) {
  for(var i in docTable){
    if(docTable[i].doc_id==row.doc_id){
      docTable.splice(i, 1)
      rendertable.value = !rendertable.value
    }
  }
  var promise = regainDoc(row.doc_id, row.is_folder)
  promise.then((res => {
    ElMessage({
        message: "恢复成功",
        type: 'success',
      })
  }))
}

function deleteC(row) {
  for(var i in docTable){
    if(docTable[i].doc_id==row.doc_id){
      docTable.splice(i, 1)
      rendertable.value = !rendertable.value
    }
  }
  var promise = completeDelete(row.doc_id)
  promise.then((res => {
    ElMessage({
        message: "已彻底删除",
        type: 'success',
      })
  }))
}

function deleteAllC(){
  if(docTable.length!=0){
    docTable = reactive([])
    rendertable.value = !rendertable.value
    var promise = completeDeleteAll()
    promise.then((res => {
      ElMessage({
          message: "已彻底删除",
          type: 'success',
        })
    }))
    }
}
</script>

<style lang="less" scoped>
.desktop-layout{
  height: 100%;
  .desktop-header{
    height: 5%;
    .desktop-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .desktop-main{
    height: 95%;
  }
}
</style>
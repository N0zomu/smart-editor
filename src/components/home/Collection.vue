<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">我的收藏</el-text>
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
              <el-link :href="`/home/folder/${scope.row.doc_id}`" v-if="scope.row.is_folder">
                <span style="margin-left: 10px">{{ scope.row.doc_name }}</span>
              </el-link>
              <el-link :href="`/doc/${scope.row.doc_id}`" v-else>
                <span style="margin-left: 10px">{{ scope.row.doc_name }}</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="doc_creator" label="创建者"/>
        <el-table-column prop="created_time" label="创建时间" :formatter="formatDate" sortable/>
        <el-table-column prop="update_time" label="更新时间" :formatter="formatDate2" sortable/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="warning"  plain @click=cancelCollectDoc(scope.row)>
              <el-icon><StarFilled /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {allCollect, cancelCollect} from '@/api/document';
import { ElMessage, ElNotification } from 'element-plus';
import moment from 'moment'

let docTable = reactive([])
let docLoading = ref(true)
let rendertable = ref(true)
onMounted(()=>{
  allCollect().then((res=>{
    docTable = res.res
    docLoading.value = false
  }))
})

function formatDate(row, column){
  return moment(row.created_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}

function formatDate2(row, column){
  return moment(row.update_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}

function cancelCollectDoc(row) {
  for(var i in docTable){
    if(docTable[i].doc_id==row.doc_id){
      docTable.splice(i, 1)
      rendertable.value = !rendertable.value
    }
  }
  var promise = cancelCollect(row.doc_id)
  promise.then((res => {
    ElMessage({
        message: "已取消收藏",
        type: 'success',
      })
  }))
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
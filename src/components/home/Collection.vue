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
      <el-scrollbar height="80vh" v-if="!docLoading">
        <el-empty description="暂无收藏" v-if="docTable.length==0"/>
        <el-space wrap style="float:left" v-else>
          <el-card v-for="doc in docTable" :key="doc.doc_id" shadow="hover"
            style="height:200px;width: 150px; margin:10px;background-color:#FAFCFF;">
            <div style="text-align:right;">
              <el-icon color="#E6A23C" :size="25" @click="cancelCollectDoc(doc)" style="cursor:pointer"><StarFilled /></el-icon>
            </div>
            <el-space @click="goDoc(doc.is_folder, doc.doc_id)" style="cursor:pointer" direction="vertical">
              <el-icon :size="90" color="#303133" v-if="doc.is_folder"><folder /></el-icon>
              <el-icon :size="90" color="#303133" v-else><document /></el-icon>
              <el-text size="large" tag="b">{{doc.doc_name}}</el-text>
            </el-space>
          </el-card>
        </el-space>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {allCollect, cancelCollect} from '@/api/document';
import { ElMessage, ElNotification } from 'element-plus';
import {useRouter} from 'vue-router';
import moment from 'moment'

const router = useRouter()
let docTable = ref([])
let docLoading = ref(true)
let rendertable = ref(true)
onMounted(()=>{
  allCollect().then((res=>{
    docTable.value = res.res
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
  for(var i in docTable.value){
    if(docTable.value[i].doc_id==row.doc_id){
      docTable.value.splice(i, 1)
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

function goDoc(is_folder, doc_id){
  if(is_folder){
    router.push(`/home/folder/${doc_id}`)
  }else{
    router.push(`/doc/${doc_id}`)
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
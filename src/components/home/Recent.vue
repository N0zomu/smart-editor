<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">最近文件</el-text>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="desktop-main">
      <el-scrollbar height="80vh" v-if="!docLoading">
        <el-empty description="暂无文件" v-if="docTable.length==0"/>
        <div style="float:left;text-align:left;width:100%"
          v-else v-for="i in docTable" :key="i">
          <div>
            <p>{{`${i.year}年${i.month}月${i.day}日`}}</p>
          </div>
          <el-space wrap>
            <el-card v-for="doc in i.docs" :key="doc.doc_id" shadow="hover"
              style="height:100px;width: 300px; margin:10px;cursor: pointer;" @click="goDoc(doc.doc_id)">
              <el-row>
                <el-col :span="4">
                  <el-icon size="50"><Document /></el-icon>
                </el-col>
                <el-col :span="20" style="text-align:left; padding: 5px 20px;" >
                  <p style="font-weight:bold;font-size:large">{{doc.doc_name}}</p>
                  <p style="font-size:small;color: #909399;">{{formatDate(doc.update_time)}}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-space>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {allRecent} from '@/api/document';
import moment from 'moment'
import {useRouter} from 'vue-router';

const router = useRouter()
let docTable = reactive([])
let docLoading = ref(true)
onMounted(()=>{
  allRecent().then((res=>{
    docTable = res.res
    docLoading.value = false
  }))
})

function goDoc(doc_id){
  router.push(`/doc/${doc_id}`)
}

function formatDate(update_time){
  return moment(update_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
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
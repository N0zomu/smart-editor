<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">搜索结果</el-text>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="desktop-main">
      <el-scrollbar height="80vh" style="text-align:left;" v-if="!searchLoading">
        <p>文档</p>
        <el-empty description="暂无结果" v-if="docRes.length==0" :image-size="80"/>
        <el-space wrap v-else>
          <el-card v-for="doc in docRes" :key="doc.doc_id" shadow="hover"
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

        <p>文件夹</p>
        <el-empty description="暂无结果" v-if="folderRes.length==0" :image-size="80"/>
        <el-space wrap v-else>
          <el-card v-for="doc in folderRes" :key="doc.doc_id" shadow="hover"
            style="height:100px;width: 300px; margin:10px;cursor: pointer;" @click="goFolder(doc.doc_id)">
            <el-row>
              <el-col :span="4">
                <el-icon size="50"><Folder /></el-icon>
              </el-col>
              <el-col :span="20" style="text-align:left; padding: 5px 20px;" >
                <p style="font-weight:bold;font-size:large">{{doc.doc_name}}</p>
                <p style="font-size:small;color: #909399;">{{formatDate(doc.update_time)}}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-space>

        <p>团队空间</p>
        <el-empty description="暂无结果" v-if="teamRes.length==0" :image-size="80"/>
        <el-space wrap v-else>
          <el-card v-for="team in teamRes" :key="team.team_id" shadow="hover"
            style="height:100px;width: 300px; margin:10px; cursor: pointer;" @click="goTeam(team.team_id)">
            <el-row>
              <el-col :span="4">
                <el-icon size="50"><user /></el-icon>
              </el-col>
              <el-col :span="20" style="text-align:left; padding: 5px 20px;" >
                <p style="font-weight:bold;font-size:large">{{team.team_name}}</p>
                <p style="font-size:small;color: #909399;">{{team.creator}}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-space>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {allRecent} from '@/api/document';
import moment from 'moment'
import {useRoute, useRouter} from 'vue-router';
import {search} from '@/api/document';

const router = useRouter()
const route = useRoute()
let docRes = reactive([])
let folderRes = reactive([])
let teamRes = reactive([])
let searchLoading = ref(true)
onMounted(()=>{
  search(route.query.key).then((res=>{
    docRes = res.doc_res
    folderRes = res.folder_res
    teamRes = res.team_res
    searchLoading.value = false
  }))
})

function goDoc(doc_id){
  router.push(`/doc/${doc_id}`)
}

function goFolder(doc_id){
  router.push(`/home/folder/${doc_id}`)
}

function goTeam(team_id){
  router.push(`/home/space/${team_id}`)
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
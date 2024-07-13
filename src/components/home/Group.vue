<template>
  <el-container class="group-layout">
    <el-header class="group-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">团队空间</el-text>
        </el-col>
        <el-col :span="16"><div class="grid-content ep-bg-purple" /></el-col>
        <el-col :span="4">
          <div class="group-btn">
            <el-input
              v-model="searchKey"
              style="max-width: 200px; max-height:25px"
              ref="searchInputRef"
              placeholder="搜索空间……"
              class="input-with-select"
            >
              <template #append>
                <el-button icon="Search" @click="userSearchTeam"/>
              </template>
            </el-input>
          </div>
          
        </el-col>
        <el-col :span="2">
          <div class="group-btn" @click="dialogFormVisible=true">
            <el-icon style="margin-right: 10px"><CirclePlus /></el-icon>
            <el-text>创建空间</el-text>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="group-main">
      <el-scrollbar height="80vh" v-if="!teamLoading">
        <el-empty description="暂无团队" v-if="teamTable.length==0"/>
        <el-space wrap style="float:left" v-else>
          <el-card v-for="team in teamTable" :key="team.team_id" shadow="hover"
            style="height:100px;width: 300px; margin:10px;">
            <el-row>
              <el-col :span="4">
                <el-icon size="50"><user /></el-icon>
              </el-col>
              <el-col :span="16" style="text-align:left; padding: 5px 20px;cursor: pointer;" @click="goTeam(team.team_id)">
                <p style="font-weight:bold;font-size:large">{{team.team_name}}</p>
                <p style="font-size:small;color: #909399;">{{team.creator}}</p>
              </el-col>
              <el-col :span="4" style="display:flex">
                <el-tooltip v-if="team.creator_id==store.user_id"
                  effect="dark"
                  content="删除"
                  placement="bottom"
                >
                  <div style="margin:auto 0;cursor: pointer;" @click=openDeleteDialog(team)>
                    <el-icon color="#F56C6C"><DeleteFilled /></el-icon>
                  </div>
                </el-tooltip>
                <el-tooltip v-else
                  effect="dark"
                  content="退出"
                  placement="bottom"
                >
                <div style="margin:auto 0;cursor: pointer;" @click=quitTeam(team)>
                  <el-icon color="#F56C6C"><ArrowRightBold /></el-icon>
                </div>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>
        </el-space>
      </el-scrollbar>
    </el-main>
  </el-container>

  <el-dialog v-model="dialogFormVisible" title="新建团队空间" width="500" align-center @close="form.teamName=''">
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.teamName" placeholder="请输入团队名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="userCreateTeam" :disabled="form.teamName==''">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="deleteFormVisible" title="注意" width="500">
    <span>
      您确定要删除此团队吗？团队与内部文档将即刻删除，无法恢复！
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteFormVisible = false">取消</el-button>
        <el-button type="primary" @click="userDeleteTeam">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { userStore } from '../../stores/user'
import {ref, reactive, onMounted, toRaw} from 'vue'
import {createTeam, allTeam, deleteTeam, searchTeam, quitSelf} from "../../api/team.js"
import moment from 'moment'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router';

const router = useRouter()
const store = userStore()
let dialogFormVisible= ref(false)
let deleteFormVisible = ref(false)
let form = reactive({
        teamName:""
      })
let teamTable = ref([])
let teamCount = ref(0)
let teamLoading = ref(true)
let deleteId = ref(0)
let searchKey = ref('')
let tableKey = ref(true)

onMounted(() => {
  getAllTeam()
});

function goTeam(team_id){
  router.push(`/home/space/${team_id}`)
}

function formatDate(row, column){
  return moment(row.created_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}

function userCreateTeam(){
  var promise = createTeam(form.teamName)
  promise.then((res => {
    if(res.code==1){
      ElMessage({
        message: res.message,
        type: 'success',
      })
      teamLoading.value = true
      getAllTeam()
    }else{
      ElMessage.error('Oops, this is a error message.')
    }
  }))
  dialogFormVisible.value = false
}

function getAllTeam(){
  var promise = allTeam()
  promise.then((res => {
    teamTable.value = res.res
    teamCount.value = res.count
    teamLoading.value = false
  }))
}

function openDeleteDialog(t){
  deleteFormVisible.value=true
  deleteId = toRaw(t).team_id
}

function userDeleteTeam() {
  var promise = deleteTeam(deleteId)
  promise.then((res => {
    if(res.code==1){
      ElMessage({
        message: res.message,
        type: 'success',
      })
      teamLoading.value = true
      getAllTeam()
    }else{
      ElMessage({
        message: res.message,
        type: 'warning',
      })
    }
  }))
  deleteFormVisible.value = false
}

function userSearchTeam(){
  teamLoading.value = true
  if(searchKey.value===''){
    getAllTeam()
  }else{
    var promise = searchTeam(searchKey.value)
    promise.then((res => {
      teamTable.value = res.users
      teamCount.value = res.count
      teamLoading.value = false
  }))
  }
}

function quitTeam(t){
  var team = toRaw(t)
  for(var i in teamTable.value){
    if(teamTable.value[i].team_id==team.team_id){
      teamTable.value.splice(i, 1)
      tableKey.value = !tableKey.value
      break
    }
  }
  var promise = quitSelf(team.team_id)
  promise.then((res =>{
    if(res.code==1){
      ElMessage({
        message: res.message,
        type: 'success',
      })
    }else{
      ElMessage({
        message: res.message,
        type: 'warning',
      })
    }
  }))
}
</script>

<style lang="less" scoped>
.group-layout{
  height: 100%;
  .group-header{
    height: 5%;
    .group-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .group-main{
    height: 95%;
  }
}
</style>
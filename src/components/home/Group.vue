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
      <el-table :data="teamTable" style="width: 100%" v-loading="teamLoading">
        <el-table-column label="团队名称" width="180" sortable>
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><user /></el-icon>
              <el-link :href="`/home/space/${scope.row.team_id}`">
                <span style="margin-left: 10px">{{ scope.row.team_name }}</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" width="180" />
        <el-table-column prop="created_time" label="创建时间" :formatter="formatDate" sortable/>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="danger"  @click=openDeleteDialog(scope.row)>
              <el-icon ><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
import {ref, reactive, onMounted, toRaw} from 'vue'
import {createTeam, allTeam, deleteTeam, searchTeam} from "../../api/team.js"
import moment from 'moment'
import { ElMessage } from 'element-plus'
let dialogFormVisible= ref(false)
let deleteFormVisible = ref(false)
let form = reactive({
        teamName:""
      })
let teamTable = reactive([])
let teamCount = ref(0)
let teamLoading = ref(true)
let deleteId = ref(0)
let searchKey = ref('')

onMounted(() => {
  getAllTeam()
});

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
    teamTable = res.res
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
      teamTable = res.users
      teamCount.value = res.count
      teamLoading.value = false
  }))
  }
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
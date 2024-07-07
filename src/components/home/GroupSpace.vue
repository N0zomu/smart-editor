<template>
  <el-container class="desktop-layout" v-loading="docLoading">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="18" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap; margin-right:10px">{{team_name}}</el-text>
          <el-popover
						:width="300"
						popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
						trigger="click" v-if="!docLoading"
						>
						<template #reference>
							<el-icon style="cursor: pointer;" @click="getTeamMembers"><UserFilled /></el-icon>
						</template>
						<template #default>
              <el-text size="large" tag="b">创建者</el-text>
              <el-divider style="margin: 1px;"/> 
              <el-row style="margin-top:10%;margin-bottom:10%">
                <el-col :span="4">
                  <el-avatar
                    :size="50"
                    :src="'http://152.136.110.235:8000'+team_creator.icon"
                  >
                    user
                  </el-avatar>
                </el-col>
                <el-col :span="20">
                  <div style="margin-top: 5%; margin-left: 10%">
                    <p style="margin: 0; font-weight: bold">{{team_creator.nickname}}</p>
                    <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">{{team_creator.email}}</p>
                  </div>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col :span="22">
                  <el-text size="large" tag="b">团队成员</el-text>
                </el-col>
                <el-col :span="2">
                  <el-icon style="cursor: pointer;" @click="addMemberVisible=true;" v-if="store.user_id==team_creator.user_id"><CirclePlus /></el-icon>
                </el-col>
              </el-row>              
              <el-divider style="margin: 1px;"/> 
              <el-scrollbar height="400px"  v-loading="teamMemberLoading">
                <el-row style="margin-top:10%;margin-bottom:10%" v-for="member in memberList" :key="member.user_id">
                  <el-col :span="4">
                    <el-avatar
                      :size="50"
                      :src="'http://152.136.110.235:8000'+member.icon"
                    >
                      user
                    </el-avatar>
                  </el-col>
                  <el-col :span="14">
                    <div style="margin-top: 5%; margin-left: 10%">
                      <p style="margin: 0; font-weight: bold">{{member.nickname}}</p>
                      <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">{{member.email}}</p>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="danger" icon="Delete" style="margin-top: 20%;" v-if="store.user_id==team_creator.user_id" @click="userQuitMember(member.user_id)"/>
                  </el-col>
                </el-row>
              </el-scrollbar>
						</template>
					</el-popover>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col :span="8">
              <el-popover
                :width="150" 
                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                trigger="click">
                <template #reference>
                  <div class="desktop-btn" @click="dialogFormVisible=true">
                    <el-icon style="margin-right: 10%"><CirclePlus /></el-icon>
                    <el-text>创建到此处</el-text>
                  </div>
                </template>
                <template #default>
                  <div style="display: flex; align-items: center">
                    <el-icon><Document /></el-icon>
                    <el-link :underline="false" @click="docDialogVisible=true">
                      <span style="margin-left: 10px" >文档</span>
                    </el-link>
                  </div>
                  <el-divider style="margin: 10px;"/>
                  <div style="display: flex; align-items: center">
                    <el-icon><Folder /></el-icon>
                    <el-link :underline="false" @click="folderDialogVisible=true">
                      <span style="margin-left: 10px" >文件夹</span>
                    </el-link>
                  </div>
                </template>
              </el-popover>
            </el-col>
            <el-col :span="8">
              <div class="desktop-btn" @click="moveAll">
                <el-icon style="margin-right: 10%"><TopRight /></el-icon>
                <el-text>移动</el-text>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="desktop-btn" @click="deleteAll">
                <el-icon style="margin-right: 10%"><Delete /></el-icon>
                <el-text>删除</el-text>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="desktop-main">
      <el-table :data="docTable" style="width: 100%" v-loading="docLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="文件名" width="180">
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
        <el-table-column prop="doc_creator" label="创建者" width="180" />
        <el-table-column prop="created_time" label="创建时间" :formatter="formatDate" sortable/>
        <el-table-column prop="update_time" label="更新时间" :formatter="formatDate2" sortable/>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="warning"  plain @click=cancelCollectDoc(scope.row) v-if="scope.row.is_collect">
              <el-icon><StarFilled /></el-icon>
            </el-button>
            <el-button type="warning" plain @click=collect(scope.row) v-if="!scope.row.is_collect">
              <el-icon ><Star /></el-icon>
            </el-button>
            <el-button type="danger"  @click=deleteDF(scope.row)>
              <el-icon ><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <el-dialog v-model="docDialogVisible" title="新建文档" width="500" align-center @close="docForm.docName=''">
    <el-form :model="docForm">
      <el-form-item>
        <el-input v-model="docForm.docName" placeholder="请输入文件名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="docDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="userCreateDoc" :disabled="docForm.docName==''">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="folderDialogVisible" title="新建文件夹" width="500" align-center @close="folderForm.folderName=''">
    <el-form :model="folderForm">
      <el-form-item>
        <el-input v-model="folderForm.folderName" placeholder="请输入文件夹名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="folderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="userCreateFolder" :disabled="folderForm.folderName==''">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog :model-value="moveDialogVisible" title="移动" width="500">
    <doc-tree @message-to-parent="receiveMessageFromChild" :is_team=true :team_id=team_id :team_name=team_name></doc-tree>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="moveDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="moveDocs">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog :model-value="addMemberVisible" title="添加团队成员" width="500" :before-close="handleClickX">
    <el-input
      v-model="searchKey"
      style=""
      ref="searchInputRef"
      placeholder="使用邮箱搜索想添加的成员，确保输入准确的邮箱"
    >
      <template #append>
        <el-button icon="Search" @click="userSearchUser"/>
      </template>
    </el-input>
    <el-card style="max-width: 480px;margin-top: 5%;margin-bottom:5%" shadow="never" v-loading="searchLoading">
      <p v-if="searchResultUser.id==null">无数据</p>
      <el-row v-else>
        <el-col :span="4">
          <el-avatar
            :size="50"
            :src="'http://152.136.110.235:8000'+searchResultUser.icon"
          >
            user
          </el-avatar>
        </el-col>
        <el-col :span="16" style="display:flex">
          <div style="align-self: center;margin-left:30%">
            <p style="margin: 0; font-weight: bold">{{searchResultUser.nickname}}</p>
            <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">{{searchResultUser.email}}</p>
          </div>
        </el-col>
        <el-col :span="4" style="display:flex">
          <el-button type="info" plain disabled style="align-self: center;" v-if="searchResultUser.has_in_team">已加入</el-button>
          <el-button type="info" plain disabled style="align-self: center;" v-else-if="searchResultUser.has_send">等待接受</el-button>
          <el-button type="primary" style="align-self: center;" v-else @click="userAddMember">添加</el-button>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script setup>
import { userStore } from '../../stores/user'
import {ref, reactive, onMounted, toRaw} from 'vue'
import {allTeamRootDoc, deleteDoc, collectDoc, cancelCollect, allCollect, teamRootDoc, teamRootFolder, moveDoc} from "../../api/document.js"
import {teamInfo, teamMembers, quitMember} from '../../api/team'
import {searchUser} from '../../api/user';
import {sendTeamMsg} from '../../api/message';
import moment from 'moment'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import {useRoute} from 'vue-router'
import DocTree from '../DocTree';
import { useRouter } from "vue-router";
const router = useRouter()
const route = useRoute()
const store = userStore()
let team_id = ref(0)
let team_name = ref('')
let team_creator = ref('')
let moveDialogVisible = ref(false)
let addMemberVisible = ref(false)
let memberList = reactive([])
let teamMemberLoading = ref(false)

let dst_doc = ref(0)
function receiveMessageFromChild(message){
  dst_doc.value = message
}
onMounted(() => {
  team_id.value = parseInt(route.params.teamId)
  var promise = teamInfo(team_id.value)
  promise.then((res =>{
    team_name.value = res.team_name
    var promise2 = teamMembers(team_id.value)
    promise2.then((res =>{
      if(res.code==0){
        ElMessageBox.alert('This is a message', 'Title', {
        confirmButtonText: 'OK',
        callback: () => {
          router.go(-1)
        },
      })
      }else{
        for(var m of res.res){
          if(m.perm===1){
            team_creator = m
          }else{
            memberList.push(m)
          }
          teamMemberLoading.value = false
          getRootDoc()
        }
      }
    }))
  }))
});

let docDialogVisible = ref(false)
let folderDialogVisible = ref(false)

let docForm = reactive({
        docName:""
      })

let folderForm = reactive({
        folderName:""
      })

let docTable = reactive([])
let collectTable = reactive([])
let docCount = ref(0)
let docLoading = ref(true)
let searchLoading = ref(false)

let selectDoc = reactive([])

let searchKey = ref('')
let searchResultUser = reactive({})

function handleClickX(){
  addMemberVisible.value = false
  searchKey.value = ''
  searchResultUser = {}
}

function handleSelectionChange(val){
  selectDoc = []
  for(var d in val){
    selectDoc.push(toRaw(val[d]))
  }
}

function formatDate(row, column){
  return moment(row.created_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}

function formatDate2(row, column){
  return moment(row.update_time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
}

function userCreateDoc(){
  var promise = teamRootDoc(docForm.docName, team_id.value)
  promise.then((res => {
    if(res.code==1){
      ElMessage({
        message: res.message,
        type: 'success',
      })
      docLoading.value = true
      getRootDoc()
    }else{
      ElMessage.error(res.message)
    }
  }))
  docDialogVisible.value = false
}

function userCreateFolder(){
  var promise = teamRootFolder(folderForm.folderName, team_id.value)
  promise.then((res => {
    if(res.code==1){
      ElMessage({
        message: "创建文件夹成功！",
        type: 'success',
      })
      docLoading.value = true
      getRootDoc()
    }else{
      ElMessage.error(res.message)
    }
  }))
  folderDialogVisible.value = false
}

function getRootDoc(){
  var promise = allTeamRootDoc(team_id.value)
  promise.then((res => {
    docTable = res.res
    docTable.sort(function(a, b){
      if(a.is_folder<=b.is_folder) return 1
      else return -1
    })
    docCount.value = res.count
    docLoading.value = false
  }))
}

function cancelCollectDoc(row) {
  row.is_collect = false
  var promise = cancelCollect(row.doc_id)
  promise.then((res => {
    ElMessage({
        message: "已取消收藏",
        type: 'success',
      })
  }))
}
function collect(row){
  row.is_collect = true
  var promise = collectDoc(row.doc_id)
  promise.then((res => {
    ElMessage({
        message: "收藏成功",
        type: 'success',
      })
  }))
}

function deleteDF(row){
  var promise = deleteDoc(row.doc_id, row.is_folder)
  promise.then((res => {
    if(res.code==1){
      ElMessage({
        message: res.message,
        type: 'success',
      })
      docLoading.value = true
      getRootDoc()
    }else{
      ElMessage.error('Oops, this is a error message.')
    }
  }))
}

function deleteAll(){
  if(selectDoc.length==0){
    ElMessage({
        message: "未选择文件！",
        type: 'warning',
      })
  }else{
    var allAPI = []
    for(var d in selectDoc){
      allAPI.push(deleteDoc(selectDoc[d].doc_id, selectDoc[d].is_folder))
    }
    Promise.all(allAPI).then((res =>{
      ElMessage({
        message: "删除成功！",
        type: 'success',
      })
      docLoading.value = true
      getRootDoc()
    }))
  }
}
function moveAll(){
  if(selectDoc.length==0){
    ElMessage({
        message: "未选择文件！",
        type: 'warning',
      })
  }else{
    moveDialogVisible.value = true
  }
}

function moveDocs(){
  var allAPI = []
    for(var d of selectDoc){
      allAPI.push(moveDoc(d.doc_id, dst_doc.value))
    }
    Promise.all(allAPI).then((res =>{
      ElMessage({
        message: "移动成功！",
        type: 'success',
      })
      docLoading.value = true
      getRootDoc()
    }))
  moveDialogVisible.value = false
}

function getTeamMembers(){
  memberList.splice(0, memberList.length)
  teamMemberLoading.value = true
  var promise = teamMembers(team_id.value)
  promise.then((res =>{
    for(var m of res.res){
      if(m.perm===1){
        team_creator = m
      }else{
        memberList.push(m)
      }
    }
    teamMemberLoading.value = false
  }))
}

function userSearchUser(){
  searchLoading.value = true
  var promise = searchUser(searchKey.value, team_id.value)
  promise.then((res =>{
    searchResultUser = res
    searchLoading.value = false
  }))
}

function userAddMember(){
  var promise = sendTeamMsg(searchResultUser.id, team_id.value)
  promise.then((res =>{
    console.log(res)
    ElMessage({
      message: "已发送邀请信息！",
      type: 'success',
    })
  }))
  addMemberVisible.value = false
}

function userQuitMember(user_id){
  var promise = quitMember(team_id.value, user_id)
  promise.then((res =>{
    ElMessage({
      message: "成功删除此成员！",
      type: 'success',
    })
  }))
  for(var i in memberList){
    if(memberList[i].user_id==user_id){
      memberList.splice(i, 1)
      break
    }
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


<!-- import {useRoute} from 'vue-router'
const route = useRoute()
let team_id = ref(0)
onMounted(() => {
  team_id.value = route.params.teamId
}); -->
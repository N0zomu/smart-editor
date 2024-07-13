<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="18" style="text-align: left">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">我的桌面</el-text>
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
    <doc-tree @message-to-parent="receiveMessageFromChild"></doc-tree>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="moveDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="moveDocs">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted, toRaw} from 'vue'
import {rootDoc, deleteDoc, collectDoc, cancelCollect, allCollect, createRootDoc, createRootFolder, moveDoc} from "../../api/document.js"
import moment from 'moment'
import { ElMessage, ElNotification } from 'element-plus';
import DocTree from '../DocTree';

let moveDialogVisible = ref(false)

let dst_doc = ref(0)
function receiveMessageFromChild(message){
  dst_doc.value = message
}
onMounted(() => {
  getRootDoc()
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

let selectDoc = reactive([])

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
  var promise = createRootDoc(docForm.docName)
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
  var promise = createRootFolder(folderForm.folderName)
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
  var promise = rootDoc()
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

// function getCollectDoc(){
//   var promise = allCollect()
//   promise.then((res => {
//     collectTable = res.id_group
//     docLoading.value = false
//   }))
// }

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
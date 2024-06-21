<template>
  <el-row style="margin-bottom: 5%">
    <el-col :span="4">
      <span>移动到：</span>
    </el-col>
    <el-col :span="20">
      <el-input
        v-model="pathName"
        style="width: 360px; height: 25px"
        disabled
        placeholder="Please input"
      />
    </el-col>
  </el-row>
  <el-tree
      :props="treeProps"
      :load="loadNode"
      v-loading="docLoading"
      lazy
      @node-click="getCheckedNodes">
    <template #default="{ node }">
      <span class="custom-tree-node">
        <el-icon v-if="!node.data.is_folder&&node.level!=1"><Document /></el-icon>
        <el-icon v-else><Folder /></el-icon>
        <span style="margin-left: 10px">{{ node.label }}</span>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
import {ref, onMounted, reactive, defineEmits} from 'vue'
import {rootDoc, folderDoc, allTeamRootDoc} from "../api/document.js"
import {useRoute} from 'vue-router'
const route = useRoute()
const emit = defineEmits(['message-to-parent'])
const props = defineProps({
  is_team: Boolean,
  team_id: Number,
  team_name: String,
})
let docLoading = ref(true)
let treeProps = reactive({
  label: 'doc_name',
  children: 'zones',
  isLeaf: 'leaf',
})
let docTable = reactive([])
let pathName = ref('')

function loadNode(node, resolve) {
  if (node.level === 0) {
    if(props.is_team) return resolve([{ doc_name: props.team_name }])
    else return resolve([{ doc_name: 'desktop' }])
  }
  if(node.level === 1){
    return resolve(docTable)
  }
  var promise = folderDoc(node.data.doc_id)
  promise.then((res => {
    let ret = []
    for(var d of res.res){
      d['leaf'] = !d.is_folder
      ret.push(d)
    }
    ret.sort(function(a, b){
      if(a.is_folder<=b.is_folder) return 1
      else return -1
    })
    return resolve(ret)
  }))
}
function getRootDoc(){
  var promise = rootDoc()
  promise.then((res => {
    for(var d of res.res){
      d['leaf'] = !d.is_folder
      docTable.push(d)
    }
    docTable.sort(function(a, b){
      if(a.is_folder<=b.is_folder) return 1
      else return -1
    })
    docLoading.value = false
  }))
}

function teamRootDoc(){
  var promise = allTeamRootDoc(props.team_id)
  promise.then((res => {
    for(var d of res.res){
      d['leaf'] = !d.is_folder
      docTable.push(d)
    }
    docTable.sort(function(a, b){
      if(a.is_folder<=b.is_folder) return 1
      else return -1
    })
    docLoading.value = false
  }))
}
function getCheckedNodes(node, e) {
  if(node.doc_id!=null){
    pathName.value = node.doc_name
  }else{
    pathName.value = "desktop"
  }
  emit('message-to-parent', node.doc_id);
}

onMounted(() => {
  console.log(props.is_team, props.team_id)
  // team_id.value = route.params.teamId
  if(props.is_team){
    teamRootDoc()
  }else{
    getRootDoc()
  }
  
});
</script>

<style>

</style>
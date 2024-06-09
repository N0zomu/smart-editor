<template>
  <el-container class="home-container" v-if="true">
    <el-header>
      <el-row style="height:100%">
        <el-col :span="3"><h1>LOGO</h1></el-col>
        <el-col :span="19">
          <div class="home-header-search">
            <el-input
                v-model="input3"
                style="max-width: 600px"
                placeholder="Please input"
                class="input-with-select"
            >
              <template #prepend>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="home-header-notification">
            <el-badge :value="12	" class="item">
              <el-button icon="Bell" circle />
            </el-badge>
          </div>
        </el-col>
        <el-col :span="1"><div class="home-header-avatar">
          <div class="home-header-avatar">
            <el-avatar> user </el-avatar>
          </div>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container class="lower-container">
      <el-aside>
        <div class="btn">
          <el-button type="primary" class="cbtn">创建</el-button>
        </div>
        <el-divider />
        <div class="up-menu">
          <el-menu
              :default-active="activePath"
              class="el-menu-vertical-demo"
              background-color="#ecf5ff"
              :router="true">
            <el-menu-item :index=recentPath @click="saveNavState(recentPath)">
              <el-icon><Clock /></el-icon>
              <span>最近文件</span>
            </el-menu-item>
            <el-menu-item :index=collectionPath @click="saveNavState(collectionPath)">
              <el-icon><CollectionTag /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item :index=desktopPath @click="saveNavState(desktopPath)">
              <el-icon><Monitor /></el-icon>
              <span>我的桌面</span>
            </el-menu-item>
            <el-menu-item :index=groupPath @click="saveNavState(groupPath)">
              <el-icon><User /></el-icon>
              <span>团队空间</span>
            </el-menu-item>
          </el-menu>
        </div>
        <el-divider />
        <div class="down-menu">
          <el-menu
              :default-active="activePath"
              class="el-menu-vertical-demo"
              background-color="#ecf5ff"
              :router="true">
            <el-menu-item :index=trashPath @click="saveNavState(trashPath)">
              <el-icon><Delete /></el-icon>
              <span>回收站</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <editor-com></editor-com>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  Bell
} from '@element-plus/icons-vue'
import EditorCom from "@/components/editor/EditorCom.vue";
export default {
  components: {EditorCom},
  data() {
    return{
      recentPath: '/home/recent',
      desktopPath: '/home/desktop',
      groupPath: '/home/group',
      collectionPath: '/home/collection',
      trashPath: '/home/trash',
      activePath: '',
    }
  },
  created() {
    // window.sessionStorage.setItem('activePath', this.recentPath)
    this.activePath = window.location.pathname
  },
  watch: {
    $route(to, from) {
      this.activePath = to.path
      // console.log(to.path)
      // console.log(from.path)
    }
  },
  methods: {
    saveNavState(path) {
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  height: 100%;
}
.el-header {
  background-color: #ecf5ff;
  border:1px solid #DCDFE6;
  .home-header-search{
    width: 30%;
    height: 80%;
    margin-top: 12px;
    margin-left: 3%;
  }
  .home-header-avatar{
    margin-top: 8px;
  }
  .home-header-notification{
    margin-top: 13px;
  }
}
.el-aside {
  background-color: #ecf5ff;
  width: 15%;
  .btn {
    .cbtn {
      margin-top: 10%;
      padding-left: 35%;
      padding-right: 35%;
    }
  }
  .up-menu{
    height: 73%;

  }
  border:1px solid #DCDFE6;
}
.el-main {
  background-color: #FAFCFF;
}
</style>

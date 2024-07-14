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
					<el-popover
						:width="500"
						popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
						trigger="click"
						>
						<template #reference>
							<div class="home-header-notification">
								<el-button icon="Bell" circle @click="getAllMsg"/>
							</div>
						</template>
						<template #default>
							<el-tabs v-model="activeName" >
							<el-tab-pane label="待处理" name="first" v-loading="msgListLoading">
								<el-scrollbar height="400px">
									<el-row v-for="msg in msgList0" :key="msg.msg_id" style="margin-bottom: 15px;" >
										<el-col :span="16" >
											<p style="float:left; font-weight:bold">{{msg.sender}}</p> <p style="float:left">邀请您加入</p><p style="float:left; font-weight:bold">{{msg.ref_name}}</p>
										</el-col>
										<el-col :span="4">
											<el-button type="success" plain @click="enterTeam(msg.msg_id, msg.ref_id)">接受</el-button>
										</el-col>
										<el-col :span="4">
											<el-button type="info" plain @click="neglect(msg.msg_id)">忽略</el-button>
										</el-col>
									</el-row>
									<p v-if="msgList0.length==0" style="width: 100%;height: 45px;display: block;line-height: 45px;text-align: center;">暂无数据！</p>
								</el-scrollbar>
							</el-tab-pane>
							<el-tab-pane label="已处理" name="second" v-loading="msgListLoading">
								<el-scrollbar height="400px">
									<el-row v-for="msg in msgList1" :key="msg.msg_id" style="margin-bottom: 15px;">
										<el-col :span="20" >
											<p style="float:left; font-weight:bold">{{msg.sender}}</p> <p style="float:left">邀请您加入</p><p style="float:left; font-weight:bold">{{msg.ref_name}}</p>
										</el-col>
										<el-col :span="4">
											<el-button type="danger" plain @click="userDeleteMsg(msg.msg_id)">删除</el-button>
										</el-col>
									</el-row>
									<p v-if="msgList1.length==0" style="width: 100%;height: 45px;display: block;line-height: 45px;text-align: center;">暂无数据！</p>
								</el-scrollbar>
							</el-tab-pane>
						</el-tabs>
						</template>
					</el-popover>
				</el-col>
				<el-col :span="1"><div class="home-header-avatar">
					<el-popover
						:width="200"
						popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
						trigger="click"
						>
						<template #reference>
							<div>
								<el-avatar :src="'http://152.136.110.235:8000'+iconURL" :fit="fit"> user </el-avatar>
							</div>
						</template>
						<template #default>
							<div
								class="demo-rich-conent"
								style="display: flex; gap: 16px; flex-direction: column;text-align: center;"
							>
								<el-avatar
									:size="60"
									:src="'http://152.136.110.235:8000'+iconURL"
									style="margin-bottom: 8px;margin-left: 50px">
									user
								</el-avatar>
								<div>
									<p
										class="demo-rich-content__name"
										style="margin: 0; font-weight: bold"
									>
										{{this.nickname}}
									</p>
									<p
										class="demo-rich-content__mention"
										style="margin: 0; font-size: 14px; color: var(--el-color-info)"
									>
										{{this.email}}
									</p>
								</div>
								<el-divider class="press-divider"/>
								<el-link :underline="false" @click="toUser">个人主页</el-link>
           			<el-divider class="press-divider"/>
								<el-link :underline="false" type="danger" @click="logout">退出登录</el-link>
							</div>
						</template>
					</el-popover>
					
				</div></el-col>
			</el-row>
		</el-header>
		<el-container class="lower-container">
			<el-aside>
				<el-popover
						:width="250"
						placement="right-start"
						popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
						trigger="click">
						<template #reference>
							<div class="btn">
								<el-button type="primary" class="cbtn">创建</el-button>
							</div>
						</template>
						<template #default>
							<el-button icon="Document" round style="width: 200px; height: 50px" @click="docDialogVisible=true"> 文档 </el-button>
							<el-divider/>
							<el-button icon="Folder" round style="width: 200px; height: 50px" @click="folderDialogVisible=true">文件夹</el-button>
							<el-divider/>
							<el-button icon="User" round style="width: 200px; height: 50px" @click="teamDialogVisible=true">团队空间</el-button>
						</template>
					</el-popover>
				<!-- <el-divider /> -->
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
				<router-view></router-view>
			</el-main>
		</el-container>
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
        <el-button type="primary" @click="menuCreateDoc" :disabled="docForm.docName==''">
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
        <el-button type="primary" @click="menuCreateFolder" :disabled="folderForm.folderName==''">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

	<el-dialog v-model="teamDialogVisible" title="新建团队空间" width="500" align-center @close="teamForm.teamName=''">
    <el-form :model="teamForm">
      <el-form-item>
        <el-input v-model="teamForm.teamName" placeholder="请输入团队名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="teamDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="menuCreateSpace" :disabled="teamForm.teamName==''">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { userStore } from '../stores/user.js'
import {all0Msg, all1Msg, handleMsg, deleteMsg} from '../api/message'
import { ElMessage } from 'element-plus'
import {selfInfo} from '../api/user.js'
import {addMember, createTeam} from '../api/team'
import {createRootDoc, createRootFolder, createFolderDoc, createFolderFolder, teamRootDoc, teamRootFolder} from '@/api/document';
const store = userStore()
export default {
	data() {
		return{
			recentPath: '/home/recent',
			desktopPath: '/home/desktop',
			groupPath: '/home/group',
			collectionPath: '/home/collection',
      trashPath: '/home/trash',
			activePath: '',
			nickname: '',
			email: '',
			iconURL: '',
			isVIP: false,
			activeName: 'first',
			msgListLoading: true,
			msgList0: [],
			msgList1: [],
			docDialogVisible: false,
			folderDialogVisible: false,
			teamDialogVisible: false,
			docForm: {
				docName:""
			},
			folderForm: {
				folderName:""
			},
			teamForm: {
				teamName:""
			}
		}
	},
	created() {
		// window.sessionStorage.setItem('activePath', this.recentPath)
		this.activePath = window.location.pathname
		if(window.location.pathname.includes("/home/space")){
			this.activePath = '/home/group'
		}
		if(store.isLogin==false&&store.token!=""){
			console.log(JSON.parse(window.sessionStorage.getItem('user')).token)
			var promise = selfInfo()
			promise.then((res => {
				console.log(res)
				store.login(res.id, res.nickname, res.email, res.icon, res.is_VIP, 
				JSON.parse(window.sessionStorage.getItem('user')).token)
				this.nickname = store.nickname
				this.email = store.email
				this.iconURL = store.icon
				this.isVIP = store.isVIP
				this.getAllMsg()
			}))
		}else{
			this.nickname = store.nickname
			this.email = store.email
			this.iconURL = store.icon
			this.isVIP = store.isVIP
			this.getAllMsg()
		}
	},
	watch: {
    $route(to, from) {
      this.activePath = to.path
      // console.log(to.path)
      // console.log(from.path)
			if(to.name=="space"){
				this.activePath = this.groupPath
			}
    }
  },
	methods: {
		menuCreateDoc(){
			var flag = this.$route.name
			if(flag=='space'){
				var team_id = this.$route.path.split('/').at(-1)
				teamRootDoc(this.docForm.docName, team_id).then((res=>{
					location.reload()
				}))
			}
			else if(flag=='folder'){
				var folder_id = this.$route.path.split('/').at(-1)
				createFolderDoc()
			}
			else{

			}
		},
		menuCreateFolder(){
			var flag = this.$route.name
			console.log(this.$route.name)
		},
		menuCreateSpace(){
			var flag = this.$route.name
			console.log(this.$route.name)
		},
		saveNavState(path) {
      this.activePath = path
    },
		logout(){
			store.logout()
			ElMessage({
				message: "已退出登录！",
				type: 'success',
			})
			this.$router.push({ path: "/login" })
		},
		toUser() {
			this.$router.push({ path: "/user" })
		},
		getAllMsg(){
			this.msgListLoading=true
			var APIList = [all0Msg(), all1Msg()]
			Promise.all(APIList).then((res =>{
				for(var r of res){
					if(r.status==0){
						this.msgList0 = r.messages
					}else{
						this.msgList1 = r.messages
					}
				}
				this.msgListLoading = false
			}))
			
		},
		enterTeam(msg_id, team_id){
			var promise = handleMsg(msg_id)
			promise.then((res =>{
				ElMessage({
					message: "成功加入团队！",
					type: 'success',
				})
			}))
			addMember(team_id, store.user_id)
			for(var i in this.msgList0){
				if(this.msgList0[i].msg_id==msg_id){
					this.msgList1.push(this.msgList0[i])
					this.msgList0.splice(i, 1)
					break
				}
			}
		},
		neglect(msg_id){
			var promise = handleMsg(msg_id)
			promise.then((res =>{
				ElMessage({
					message: "已处理！",
					type: 'info',
				})
			}))
			for(var i in this.msgList0){
				if(this.msgList0[i].msg_id==msg_id){
					this.msgList1.push(this.msgList0[i])
					this.msgList0.splice(i, 1)
					break
				}
			}
		},
		userDeleteMsg(msg_id){
			var promise = deleteMsg(msg_id)
			promise.then((res =>{
				ElMessage({
					message: "已删除！",
					type: 'info',
				})
			}))
			for(var i in this.msgList1){
				if(this.msgList1[i].msg_id==msg_id){
					this.msgList1.splice(i, 1)
					break
				}
			}
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
		cursor: pointer;
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
			margin-bottom: 10%;
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
	width: 85%;
	background-color: #FAFCFF;
}
.press-divider{
	margin: 1px;
}
</style>

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
								<el-link :underline="false">个人主页</el-link>
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
							<el-button icon="Document" round style="width: 200px; height: 50px"> 文档 </el-button>
							<el-divider/>
							<el-button icon="Folder" round style="width: 200px; height: 50px">文件夹</el-button>
							<el-divider/>
							<el-button icon="User" round style="width: 200px; height: 50px">团队空间</el-button>
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
</template>

<script>
import { userStore } from '../stores/user.js'
import { ElMessage } from 'element-plus'
import {selfInfo} from '../api/user.js'
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
			}))
		}else{
			this.nickname = store.nickname
			this.email = store.email
			this.iconURL = store.icon
			this.isVIP = store.isVIP
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

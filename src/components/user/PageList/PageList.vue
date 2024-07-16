<template>
    <div class="body_pageList">
        <el-card class="info_PL">
            <el-avatar shape='circle' :size="70" style="font-size: 22px" :src="serverAddress + store.$state.icon">{{ store.$state.nickname.slice(-2) }}</el-avatar>
<!--            <el-avatar shape='circle' :size="70" style="font-size: 22px">{{ store.$state.ava }}</el-avatar>-->
<!--            <el-avatar shape='circle' :size="70" style="font-size: 22px; background-color: rgba(168,23,23,0.88)">-->
<!--                {{ userName.slice(-2) }}-->
<!--            </el-avatar>-->
            <el-divider>
                <el-icon><star-filled color="#C0C4CC"/></el-icon>
            </el-divider>
            <p style="font-size: 18px; margin-bottom: 4px; font-weight: 400">{{ store.$state.nickname}}{{store.$state.isVIP?"💎":""}}</p>
            <p style="font-size: 12px; color: #a0a5a8">{{ store.$state.email }}</p>
        </el-card>
<!--        <el-card class="calendar_PL">-->
<!--            <el-calendar v-model="value" style="justify-content: center; align-items: center;"/>-->
<!--        </el-card>-->

    </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {userStore} from "@/stores/user";
import {selfAva, selfInfo} from "@/api/user";
import {ElMessage} from "element-plus";

export default {
    name: "PageList",

    setup() {
        const serverAddress = "http://152.136.110.235"
        const store = userStore()
        let url_avatar = ref();
        let userName = ref("星空下的暴走奶昔");
        let userEmail = ref("I'mGoingTo@Drink.Milkshake");
        let value = ref(new Date());
        // let ava = ref("");

        const getUserInfo = () => {
            var promise = selfInfo();
            promise.then((result => {
                if(result.code === 0){
                    // ElMessage({
                    //     message: result.error,
                    //     type: 'warning',
                    // });
                }
                else {
                    // ElMessage({
                    //     message: result.message,
                    //     type: 'success',
                    // });
                    store.$state.nickname = result.nickname;
                    store.$state.email = result.email;
                }
            }))
            var getAva = selfAva();
            getAva.then((result2 => {
                if(result2.code === 0){
                    // ElMessage({
                    //     message: result2.error,
                    //     type: 'warning',
                    // });
                }
                else {
                    // ElMessage({
                    //     message: result2.msg,
                    //     type: 'success',
                    // });
                    store.$state.icon = result2.icon_url;
                }
            }))
        }

        onMounted(() => {
            getUserInfo();
        })

        return {
            url_avatar,
            userName,
            userEmail,
            value,
            store,
            serverAddress
        }
    }
}
</script>

<style scoped>

.body_pageList {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #f2f2f3;
}

.info_PL {
    margin: 35px 15px 10px 15px;
}

.calendar_PL {
    margin-right: 15px;
    margin-left: 15px;
}

</style>
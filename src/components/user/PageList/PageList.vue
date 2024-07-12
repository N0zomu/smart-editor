<template>
    <div class="body_pageList">
        <el-card class="info_PL">
            <el-avatar shape='circle' :size="70" style="font-size: 22px">{{ userName.slice(-2) }}</el-avatar>
<!--            <el-avatar shape='circle' :size="70" style="font-size: 22px; background-color: rgba(168,23,23,0.88)">-->
<!--                {{ userName.slice(-2) }}-->
<!--            </el-avatar>-->
            <el-divider>
                <el-icon><star-filled color="#C0C4CC"/></el-icon>
            </el-divider>
            <p style="font-size: 18px; margin-bottom: 4px; font-weight: 400">{{ userName }}</p>
            <p style="font-size: 12px; color: #a0a5a8">{{userEmail}}</p>
        </el-card>
    </div>
</template>

<script>
import {ref} from "vue";

export default {
    name: "PageList",

    setup() {
        let url_avatar = ref();
        let userName = ref("星空下的暴走奶昔");
        let userEmail = ref("I'mGoingTo@Drink.Milkshake")

        return {
            url_avatar,
            userName,
            userEmail
        }
    }
}
</script>

<style>

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

</style>
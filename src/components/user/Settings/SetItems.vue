<template>

    <el-dialog
            v-model="changePWDVisible"
            title="修改密码"
            width="33%"
    >
        <el-input
                v-model="oldPWD"
                style="width: 90%; height: 40px"
                placeholder="原密码"
        >
        </el-input>
        <el-input
                v-model="newPWD"
                style="width: 90%; height: 40px; margin-top: 20px"
                placeholder="新密码"
        >
        </el-input>
        <el-input
                v-model="cPWD"
                style="width: 90%; height: 40px; margin-top: 20px"
                placeholder="确认新密码"
        >
        </el-input>
        <div class="dialog-footer" style="margin-top: 20px; display: flex; flex-direction: row; justify-content: flex-end; align-items: flex-end">
            <el-button type="primary" @click="updatePWD()">确认</el-button>
            <el-button @click="canclePWD()">取消</el-button>
        </div>
    </el-dialog>

    <div class="body_setItems">
        <p style="width: 85%; text-align: left; margin-top: 20px">账号信息</p>
        <el-card class="card_ST" shadow="never">
            <p class="card_p_ST">
                <div class="card_content_ST">{{ userMethod }}</div>
                <div class="card_space_ST"></div>
<!--                <v-for >privileges</v-for>-->
                <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="暂未开通付费功能"
                        placement="top-start"
                >
                    <el-button
                            class="card_button_ST"
                            :key="button.text"
                            :type="button.type"
                            text
                            @click="upgrade()"
                            disabled
                    >
                        升级
                    </el-button>
                </el-tooltip>

            </p>

        </el-card>
        <el-card class="card_ST" shadow="never">
            <p class="card_p_ST">
                <div class="card_title_ava_ST">头像</div>
                <el-upload
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="updateAVA"
                        :limit="1"
                        accept=".bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp,.avif,.apng">
                    <el-avatar :size="65" style="font-size: 20px" :src="store.$state.icon">{{ store.$state.nickname.slice(-2) }}</el-avatar>
                </el-upload>
            </p>
            <div class="card_n_ST"></div>
            <p class="card_p_ST">
                <div class="card_title_ST">昵称</div>
                <el-input
                        v-if="showInput"
                        v-model="userName"
                        style="width: auto; justify-content: center; align-items: center"
                >

                </el-input>
                <div v-else class="card_content_ST">{{ store.$state.nickname }}</div>
                <div class="card_button_ST" v-if="showInput">
                    <el-button
                            class="card_button_ST"
                            type="info"
                            @click="updateNick()"
                    >
                        保存
                    </el-button>
                    <el-button
                            class="card_button_ST"
                            type="info" plain
                            @click="cancelNick()"
                    >
                        取消
                    </el-button>
                </div>
                <el-button
                        v-else
                        class="card_button_ST"
                        :key="button.text"
                        :type="button.type"
                        text
                        @click="showInput=true"
                >
                    编辑
                </el-button>
            </p>
        </el-card>
        <el-card class="card_ST" shadow="never">
            <p class="card_p_ST">
                <div class="card_title_ST">密码</div>
                <div class="card_content_ST" style="font-weight: bolder">··········</div>
                <el-button
                        class="card_button_ST"
                        :key="button.text"
                        :type="button.type"
                        text
                        @click="changePWDVisible=true"
                >
                    修改
                </el-button>
            </p>
            <div class="card_n_ST"></div>
            <p class="card_p_ST">
                <div class="card_title_ST">邮箱</div>
                <div class="card_content_ST">{{ store.$state.email }}</div>
<!--                <el-button-->
<!--                        class="card_button_ST"-->
<!--                        :key="button.text"-->
<!--                        :type="button.type"-->
<!--                        text-->
<!--                >-->
<!--                    绑定-->
<!--                </el-button>-->
            </p>
        </el-card>
    </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {userStore} from "@/stores/user";
import {selfAva, selfInfo, updateNickName, updatePassword, uploadAvatar} from "@/api/user";
import {ElMessage} from "element-plus";

export default {
    name: "SetItems",

    setup() {
        const store = userStore();
        let userName = ref("星空下的暴走奶昔");
        let userEmail = ref("I'mGoingTo@Drink.Milkshake");
        const button = { type: 'primary', text: 'primary' };
        let userMethod = ref("普通账户");
        let showInput = ref(false);
        let changePWDVisible = ref(false);
        let oldPWD = ref("");
        let newPWD = ref("");
        let cPWD = ref("");

        const updateNick = () => {
            var promise = updateNickName(userName.value);
            promise.then((result => {
                if(result.code === 0){
                    ElMessage({
                        message: result.error,
                        type: 'warning',
                    });
                }
                else {
                    ElMessage({
                        message: result.message,
                        type: 'success',
                    });
                    store.$state.nickname = userName.value;
                }
            }))
            console.log(userName);
            showInput.value = false;
        }

        const cancelNick = () => {
            showInput.value = false;
            console.log(showInput);
        }

        const updatePWD = () => {
            var promise = updatePassword(oldPWD, newPWD, cPWD);
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
                }
            }))
            clearPWDdialog();
        }

        const canclePWD = () => {
            clearPWDdialog();
        }

        const clearPWDdialog = () => {
            oldPWD.value = "";
            newPWD.value = "";
            cPWD.value = "";
            changePWDVisible.value = false;
        }

        const upgrade = () => {
            // TODO: upgrade
        }

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
                    userName.value = result.nickname;
                }
            }))
            var getAva = selfAva();
            getAva.then((result2 => {
                if(result2.code === 0){
                }
                else {
                    store.$state.icon = result2.icon_url;
                    console.log("##" + store.$state.icon)
                }
            }))
        }

        const updateAVA = (file, fileList) => {
            if (file && file.raw) {
                let promise = uploadAvatar(file);
                promise.then((result) => {
                    if(result.code === 0){
                        ElMessage({
                            message: "头像已更新",
                            type: "success",
                        });
                    }
                    getUserInfo();
                })
            }
            else {
                // ElMessage({
                //     message: "上传失败，请重试",
                //     type: "error",
                // });
            }
        }

        onMounted(() => {
            getUserInfo();
        })

        return {
            userName,
            userEmail,
            button,
            userMethod,
            showInput,
            changePWDVisible,
            oldPWD,
            newPWD,
            cPWD,
            store,
            updateNick,
            cancelNick,
            updatePWD,
            canclePWD,
            upgrade,
            updateAVA
        }
    }
}
</script>

<style scoped>

.body_setItems {
    /*background-color: #4b70e2;*/
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    background-color: #f7f7f8;
}

.card_ST {
    width: 85%;
    margin: 20px 5px 5px;
    padding: 10px;
}

.card_p_ST {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.card_title_ava_ST {
    font-weight: bold;
    margin-right: 40px;
}

.card_title_ST {
    display: flex;
    flex-direction: row;
    font-weight: bold;
    margin-right: 40px;
    justify-content: center;
    align-items: center;
}

.card_n_ST {
    height: 30px;
}

.card_content_ST {
    align-content: center;
}

.card_button_ST {
    justify-content: center;
    align-content: center;
    margin-left: auto;
    margin-right: 10px;
    padding: 10px;
}

.card_space_ST {
    width: 10px;
}

</style>
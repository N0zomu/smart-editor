<template>
    <div class="body_userHome">
        <div class="header_userHome">
            <el-icon style="margin-right: 8px" @click="jumpBack_userHome"><ArrowLeft /></el-icon>
            个人设置
        </div>
        <section class="section_userHome">
            <d-splitter class="splitter-border_UH" :orientation="orientation" :splitBarSize="splitBarSize">
                <template v-slot:DSplitterPane>
                    <d-splitter-pane minSize="15%">
                        <div class="pane-content">
                            <PageList/>
                        </div>
                    </d-splitter-pane>
                    <d-splitter-pane
                            collapseDirection="after"
                            :size="size"
                            :minSize="minSize"
                            :collapsible="false"
                            @sizeChange="sizeChange"
                            @collapsedChange="collapsedChange"
                    >
                        <div class="pane-content">
                            <SetItems/>
                        </div>
                    </d-splitter-pane>
                </template>
            </d-splitter>
        </section>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import PageList from "@/components/user/PageList/PageList.vue";
import SetItems from "@/components/user/Settings/SetItems.vue";
import router from "@/router";

export default defineComponent ({
    name: "userHome",
    components: {SetItems, PageList},

    setup() {
        const orientation = ref('horizontal');
        const splitBarSize = '2px';
        // splitter pane input
        const size = ref('77%');
        const minSize = ref('30%');
        const maxSize = ref('70%');
        const sizeChange = (size) => {
        };
        const collapsedChange = (event) => {
        };
        const jumpBack_userHome = () => {
            router.push('home')
        }

        return {
            orientation,
            splitBarSize,
            size,
            minSize,
            maxSize,
            sizeChange,
            collapsedChange,
            jumpBack_userHome
        };
    },
});
</script>

<style scoped>
.body_userHome {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.header_userHome {
    padding-left: 30px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.splitter-border_UH {
    border: 1px solid #dfe1e6;
    height: 100%;
}

.section_userHome {
    border: 4px;
}
</style>

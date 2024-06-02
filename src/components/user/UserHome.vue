<template>
    <div class="body_userHome">
        <section>
            <d-splitter class="splitter-border_UH" :orientation="orientation" :splitBarSize="splitBarSize">
                <template v-slot:DSplitterPane>
                    <d-splitter-pane minSize="23%">
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
            console.log(size);
        };
        const collapsedChange = (event) => {
            console.log(event);
        };

        return {
            orientation,
            splitBarSize,
            size,
            minSize,
            maxSize,
            sizeChange,
            collapsedChange,
        };
    },
});
</script>

<style>
.pane-content {
    padding: 0 5px;
}

.body_userHome {
    height: calc(100vh - 70px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.splitter-border_UH {
    border: 1px solid #dfe1e6;
    height: 100%;
}
</style>

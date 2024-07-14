<template>
  <div style="height:100%">
    <mindmap style="height:100vh"
      v-model="data"
      drag="true"
      zoom="true"
      edit="true"
      add-node-btn="true"
      ctm="true"
      download-btn="true"
      ></mindmap>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'

export default defineComponent({
  components: { mindmap },
  setup () {
    const data = [  
    {  
        "name": "分等级和中空纳米结构的氧化物气体传感器综述",  
        "children": [  
            {  
                "name": "文献总结",  
                "children": [  
                    {  
                        "name": "中空结构和分等级结构在气体传感方面的应用"  
                    },  
                    {  
                        "name": "中空结构和分等级结构能实现高灵敏度和快速的响应时间"  
                    },  
                    {  
                        "name": "为气体传感方面提供新思路"  
                    }  
                ]  
            },  
            {  
                "name": "中空结构和分等级结构的传感材料",  
                "children": [  
                    {  
                        "name": "中空结构（hollow structure）",  
                        "children": [  
                            {  
                                "name": "空心球"  
                            },  
                            {  
                                "name": "气敏特性与壳层厚度、渗透性和壳层表面形貌相关"  
                            }  
                        ]  
                    },  
                    {  
                        "name": "分等级结构(hierarchica structure)",  
                        "children": [  
                            {  
                                "name": "低维纳米材料组成高维（三维）材料"  
                            },  
                            {  
                                "name": "低维纳米结构（0D纳米点、1D纳米线/纳米棒、2D纳米片、3D纳米块）"  
                            },  
                            {  
                                "name": "中空结构和分等级结构属于包含关系"  
                            }  
                        ]  
                    }  
                ]  
            },  
            {  
                "name": "气敏特性的影响因素",  
                "children": [  
                    {  
                        "name": "中空结构",  
                        "children": [  
                            {  
                                "name": "壳层厚度"  
                            },  
                            {  
                                "name": "壳层渗透性"  
                            },  
                            {  
                                "name": "壳层表面形貌"  
                            }  
                        ]  
                    },  
                    {  
                        "name": "分等级结构",  
                        "children": [  
                            {  
                                "name": "组成单元的尺寸"  
                            },  
                            {  
                                "name": "分等级结构的孔隙度"  
                            }  
                        ]  
                    }  
                ]  
            },  
            {  
                "name": "中空结构气敏特性改善的原因",  
                "children": [  
                    {  
                        "name": "增加了参与反应的比表面积"  
                    },  
                    {  
                        "name": "反应物增多"  
                    },  
                    {  
                        "name": "表面形貌增加反应面积"  
                    },  
                    {  
                        "name": "响应时间显著提高"  
                    }  
                ]  
            }  
        ]  
    }  
]

    return { data }
  }
})
</script>
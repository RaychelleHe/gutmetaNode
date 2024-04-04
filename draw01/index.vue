<template>
    <div>
        <div id="canvas"></div>
        <n-modal v-model:show="showModal" preset="card" title="GeneInfo" style="width: 50%">
            <div v-if="alertContent != ''" style="background-color: white">
                <n-space vertical :size="12">
                    <n-descriptions bordered>
                        <n-descriptions-item label="Chr">
                            {{ alertContent.Chr }}
                        </n-descriptions-item>
                        <n-descriptions-item label="Name">
                            {{ alertContent.Name }}
                        </n-descriptions-item>
                        <n-descriptions-item label="Start">
                            {{ alertContent.Start }}
                        </n-descriptions-item>
                        <n-descriptions-item label="End">
                            {{ alertContent.End }}
                        </n-descriptions-item>
                        <n-descriptions-item label="Strand">
                            {{ alertContent.Strand }}
                        </n-descriptions-item>
                        <n-descriptions-item label="Description">
                            {{ alertContent.Description }}
                        </n-descriptions-item>
                        <n-descriptions-item label="Sequence">
                            {{ alertContent.Sequence }}
                        </n-descriptions-item>
                    </n-descriptions>
                </n-space>
            </div>
            <div v-else><p></p></div>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import _ from 'lodash'
import Crux from 'crux'
//import { segSequence,originalSeg,segsDepthArray, avgArr, genesArr, variantsArr} from './data'
//import { hap,newSegInfo,segsDepthArray, avgArr, genesArr, variantsArr} from './data'
import { hap,newSegInfo,segsDepthArray, avgArr, genesArr, variantsArr} from './S7'
// import { genesData } from './genesData'
// import { variantsData} from './variantsData'
import  SegBlock  from './SegBlock'
import GeneArea from './geneArea'
import { useModal } from 'naive-ui'

// 0.function to parse hap
function translateHap(seq){
    const res = []
    const a1 = seq.match(/[A-Z]+[0-9]+[+-]+/g)
    a1.forEach((d)=>{
        res.push({type:d.match(/[A-Z]+/)[0],num:parseInt(d.match(/[0-9]+/)[0]),direction:d.match(/[+-]+/)[0]})
    })
    console.log(res)
    return res
}

// 1.function to parse original *SEG* info into new format
// function newSegParse(data:{Length:number,Name:string,Source:string}):Seg[]{
//     let res =  data.filter(d=> d.Name.slice(0,3) == "SEG").map(d=> {
//         let pattern1 = /[.\w]+(?=:)/
//         let pattern2 = /[0-9]+(?=-)/
//         let pattern3 = /(?<=-)[0-9]+/
//         let source = d.Source.match(pattern1)[0]
//         let start = parseInt(d.Source.match(pattern2)[0])
//         let end = parseInt(d.Source.match(pattern3)[0])
//         return {name:d.Name,length:d.Length,source:source,start:start,end:end,genes:[],variants:[]}
//     })
//     return res
// }

// 2.function integrate all depth points and avg depth into one arr.
function depthDrawData(depthArr:number[],avgArr:number[]){
    var depth = []
    depthArr.forEach(d=>{depth.push({points:d})})
    avgArr.forEach((d,i)=>{depth[i].avg = d})
    return depth
}

// 3.function to import template ,a template variant declaration is needed
const template = ref('')
async function importTextFile() {
    const fileURL = new URL('./template.bvt', import.meta.url)
    const response = await fetch(fileURL)
    const content = await response.text()
    template.value = content
}

// 4.function to load genes data into newSegInfo array.time out.!!has been moved to backend,can be deleted safely.
function genesLoaded(genes:Gene[],segs:Seg[]){
	segs.forEach((s,i)=>{
		var start = s.start
		var end = s.end
		genes.forEach((g,j)=>{
			if(g.Start>=start&&g.End<=end){
				s.genes.push(g)
			}else if(g.Start>=start&&g.Start<=end){
			    let item = {...g}
			    item.End = end
                s.genes.push(item)
            }else if(g.End>=start&&g.End<=end){
                let item = {...g}
                item.Start = start
                s.genes.push(item)
            }
		})
	})
}

// 5.function to load variants data into newSegInfo array.time out!!has been moved to backend,can be deleted safely.
function variantsLoaded(variants:Variant[],segs:Seg[]){
	segs.forEach((s,i)=>{
		var start = s.start
		var end = s.end
		variants.forEach((v,j)=>{
			if(v.Pos>=start&&v.Pos<=end){
				s.variants.push(v)
			}
		})
	})
}

// 6.function to update genes range dislayed
function updateRange(range){
    genesStart.value = range[0]
    genesEnd.value = range[1]
    genesData.value = getRangeGeneData(range)
    variantsData.value = getRangeVariantData(range)
    this.$parent.redraw()
}

//function updateContent(content){alertContent.value=content}
// 7.alert
// function alertInfo() {
//     const modal = useModal()
//     // const info = alertContent.value
//     // const content = `Chr:${info.Chr}\n
//     //     Start:${info.Start}\n
//     //     End:${info.End}\n
//     //     Strand:${info.Strand}\n
//     //     Name:${info.Name}\n
//     //     Description:${info.Description}\n
//     //     Sequence:${info.Sequence}`
//     // window.alert(content)
//     const modalInst = modal.create({
//         title: 'Gene Info:',
//         content: content,
//         preset: 'dialog',
//         show="showModal"
//       })
//     // const info = alertContent.value
//     // message.info(
//     //     `Chr:${info.Chr}\n
//     //     Start:${info.Start}\n
//     //     End:${info.End}\n
//     //     Strand:${info.Strand}\n
//     //     Name:${info.Name}\n
//     //     Description:${info.Description}\n
//     //     Sequence:${info.Sequence}`,
//     //     {
//     //         closable: true,
//     //         duration: 5000,
//     //     }
//     // )
//     // window.$message.info(`Chr:${info.Chr}\n
//     //     Start:${info.Start}\n
//     //     End:${info.End}\n
//     //     Strand:${info.Strand}\n
//     //     Name:${info.Name}\n
//     //     Description:${info.Description}\n
//     //     Sequence:${info.Sequence}`,{
//     //         closable: true,
//     //         duration: 5000,
//     //     })
// }

// 8.true scale text
function textHandler(newSegInfo){
    var arr = []
    newSegInfo.forEach((v,i)=>{
        arr.push(v.start,v.end)
    })
    return arr
}

// 9.get RangeGeneData
function getRangeGeneData(range){
    const res = []
    // genesArr[segDisplayIndex.value].forEach((d,i)=>{
    dragGenes.value.forEach((d,i)=>{
        if((range[1]>d.Start&&d.Start>range[0])||(range[1]>d.End&&d.End>range[0])){
            res.push(d)
        }
    })
    return res
}

// 10.get RangeVariantData
function getRangeVariantData(range){
    const res = []
    // variantsArr[segDisplayIndex.value].forEach((d,i)=>{
    dragVariants.value.forEach((d,i)=>{
        if(range[1]>d.Pos&&d.Pos>range[0]){
            res.push(d)
        }
    })
    return res
}

// 11.clickSegFun
function clickSeg(i,that,el){
    segDisplayIndex.value = i
    genesStart.value = newSegInfo[i].start
    genesEnd.value = newSegInfo[i].end
    dragStart.value = newSegInfo[i].start
    dragEnd.value = newSegInfo[i].end
    genesData.value = genesArr[i]
    variantsData.value = variantsArr[i]
    that.$parent.$ref.geneArea.$ref.brush.reset()
    that.$parent.$ref.geneArea.$ref.brush.range = ([dragStart.value,dragEnd.value])
}
console.log(hap)
const segSequence = translateHap(hap)
//var newSegInfo:Seg[] = newSegParse(originalSeg)   // get new array containing only 'SEG' data in new format,throw away 'INS' data
const textArr = textHandler(newSegInfo) //true scale txt annotation array
const segLength = newSegInfo.length
const segDisplayIndex = ref(0)
const start = newSegInfo[0]?newSegInfo[0].start:0   
const end = newSegInfo[0]?newSegInfo[segLength-1].end:0
const genesStart = ref(start)
const genesEnd = ref(newSegInfo[0]?newSegInfo[0].end:0)
const dragStart = ref(genesStart.value)
const dragEnd = ref(genesEnd.value)
const hoverArr = ref(Array(segLength).fill(null))
const depth:{points:number[],avg:number} = depthDrawData(segsDepthArray,avgArr)
const variantHover = ref(variantsArr[0]&&Array(variantsArr[0].length).fill(null))
const alertContent = ref("")
const genesData = ref(genesArr[0]) // genes data affected by drag action
const dragGenes = ref(genesArr[0]) // drag bar genes data changed by seg clicked
const dragVariants = ref(variantsArr[0]) // drag bar Variants data changed by seg clicked
const variantsData = ref(variantsArr[0])
const showModal = ref(false)
watch(segDisplayIndex,(n,o)=>{
    variantHover.value = Array(variantsArr[n].length).fill(null)
    dragGenes.value = genesArr[n]
    dragVariants.value = variantsArr[n]
})
watch(alertContent,(n,o)=>{
    console.log(n)
})
const range = ref([dragStart.value,dragEnd.value])
Crux.use.theme("hp-light", {
    extends: "light",
    colors: {
        variantLine:"#f4ad4d",
        spotLine: "#ccc",
        areaBg: "#ddd",
        brushBg: "#ccc",
        variantMark:"red",
        genePos: "#39c",
        geneNeg: "#f55",
    },
});
// onMounted(async () => {
//     await importTextFile()
//     console.log("in onMounted")
//     Crux.visualize({
//         el: '#canvas',
//         template: template.value,
//         theme: "hp-light",
//         components:{SegBlock,GeneArea},
//         data: { 
//             newSegInfo ,
//             depth, 
//             segSequence, 
//             avgArr, 
//             start, 
//             end, 
//             hoverArr,
//             segLength,
//             segDisplayIndex,
//             //genesArr,
//             //variantsArr,
//             genesData,
//             variantsData,
//             updateRange,
//             genesEnd,
//             genesStart,
//             //alertInfo,
//             alertContent,
//             dragStart,
//             dragEnd,
//             textArr,
//             showModal,
//             variantHover,
//             clickSeg,
//             range,
//             dragGenes,
//             dragVariants
//             //updateContent,
//         },
//     })
// })
</script>
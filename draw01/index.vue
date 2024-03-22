<template>
    <div>
        <div id="canvas"></div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import _ from 'lodash'
import Crux from 'crux'
import { segSequence,originalSeg,segsDepthArray, avgArr, genesArr, variantsArr} from './data'
// import { genesData } from './genesData'
// import { variantsData} from './variantsData'
import SegBlock from './segBlock'
import GeneArea from './geneArea'
import { useMessage } from 'naive-ui'

// 1.function to parse original *SEG* info into new format
function newSegParse(data:{Length:number,Name:string,Source:string}):Seg[]{
    let res =  data.filter(d=> d.Name.slice(0,3) == "SEG").map(d=> {
        let pattern1 = /[.\w]+(?=:)/
        let pattern2 = /[0-9]+(?=-)/
        let pattern3 = /(?<=-)[0-9]+/
        let source = d.Source.match(pattern1)[0]
        let start = parseInt(d.Source.match(pattern2)[0])
        let end = parseInt(d.Source.match(pattern3)[0])
        return {name:d.Name,length:d.Length,source:source,start:start,end:end,genes:[],variants:[]}
    })
    return res
}

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
    //console.log(start.value,this.redraw)
    // console.log("parent.redraw",this.$parent.redraw)
    // console.log("parent.render",this.$parent.$ref)
    // console.log("parent.render",this.$parent.$ref.geneArea.$ref.gene.draw)
    this.$parent.redraw()
    // this.$parent.$ref.gene.draw()
}

//function updateContent(content){alertContent.value=content}
// 7.alert
function alertInfo() {
    const message = useMessage()
    const info = alertContent.value
    window.alert(`Chr:${info.Chr}\n
        Start:${info.Start}\n
        End:${info.End}\n
        Strand:${info.Strand}\n
        Name:${info.Name}\n
        Description:${info.Description}\n
        Sequence:${info.Sequence}`)
    // const info = alertContent.value
    // message.info(
    //     `Chr:${info.Chr}\n
    //     Start:${info.Start}\n
    //     End:${info.End}\n
    //     Strand:${info.Strand}\n
    //     Name:${info.Name}\n
    //     Description:${info.Description}\n
    //     Sequence:${info.Sequence}`,
    //     {
    //         closable: true,
    //         duration: 5000,
    //     }
    // )
    // window.$message.info(`Chr:${info.Chr}\n
    //     Start:${info.Start}\n
    //     End:${info.End}\n
    //     Strand:${info.Strand}\n
    //     Name:${info.Name}\n
    //     Description:${info.Description}\n
    //     Sequence:${info.Sequence}`,{
    //         closable: true,
    //         duration: 5000,
    //     })
}
var newSegInfo:Seg[] = newSegParse(originalSeg)   // get new array containing only 'SEG' data in new format,throw away 'INS' data
const segLength = newSegInfo.length
const segDisplayIndex = ref(0)
//const start = newSegInfo[0].start
const start = newSegInfo[0]?newSegInfo[0].start:0   
const end = newSegInfo[0]?newSegInfo[segLength-1].end:0
// console.log(start,end)
const genesStart = ref(start)
const genesEnd = ref(newSegInfo[0]?newSegInfo[0].end:0)
const dragStart = ref(genesStart.value)
const dragEnd = ref(genesEnd.value)
const hoverArr = ref(Array(segLength).fill(null))
const depth:{points:number[],avg:number} = depthDrawData(segsDepthArray,avgArr)
const alertContent = ref("")
watch(dragEnd,(newValue,oldValue)=>{
    // genesStart.value = newSegInfo[newValue].start
    // genesEnd.value = newSegInfo[newValue].end
    // dragStart.value = newSegInfo[newValue].start
    // dragEnd.value = newSegInfo[newValue].end
    console.log(dragStart.value,dragEnd.value)
})
watch(genesStart,(n,o)=>{
    console.log(genesStart.value,genesEnd.value)
})

// var newSegInfo:Seg[] = newSegParse(originalSeg)   // get new array containing only 'SEG' data in new format,throw away 'INS' data
// console.log(newSegInfo)
// genesLoaded(genesData,newSegInfo)   // load genesData into newSegInfo,time out!!
// variantsLoaded(variantsData,newSegInfo)     // load variantsData into newSegInfo,time out!!
// const start = ref(newSegInfo[0].start)
// const end = ref(newSegInfo[segLength-1].end)


Crux.use.theme("hp-light", {
    extends: "light",
    colors: {
        spotLine: "#ccc",
        areaBg: "#ddd",
        brushBg: "#ccc",
        stPos: "#39c",
        stNeg: "#f55",
    },
});

onMounted(async () => {
    await importTextFile()
    Crux.visualize({
        el: '#canvas',
        template: template.value,
        theme: "hp-light",
        components:{SegBlock,GeneArea},
        data: { 
            newSegInfo ,
            depth, 
            segSequence, 
            avgArr, 
            start, 
            end, 
            hoverArr,
            segLength,
            segDisplayIndex,
            genesArr,
            variantsArr,
            updateRange,
            genesEnd,
            genesStart,
            alertInfo,
            alertContent,
            dragStart,
            dragEnd
            //updateContent,
        },
    })
})
// **a replace of backend data handling function which can be deleted safely.**
// function getSegsDepthArray(newSegInfo){
//     let avgNum = 100
//     return newSegInfo.map(d => {
//         let windowSize = Math.ceil(d.Length/avgNum)
//         let segDepthArray = geneDepthArray.slice(d.start-1,d.end)
//         _.chunk(segDepthArray,windowSize)
//         segDepthArray.unshift(segDepthArray[0])
//         let last = segDepthArray.pop()
//         segDepthArray.push(last,last)
//         return segDepthArray.map(d => Number.parseFloat((d.reduce((sum,d) => (sum+d))/d.length).toFixed(4)))
//     })
// }
</script>

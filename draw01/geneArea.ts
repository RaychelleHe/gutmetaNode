import Crux from 'crux'
// import { useMessage } from 'naive-ui'
//
const { Component } = Crux
// interface MyComponentOption {
//     // props
//     start: number
//     end: number
//     segDisplayIndex: number | string
//     variantsArr: []
//     genesArr: []
//     colorMap: any
//     updateRange: (range: any) => void
// }

class GeneArea extends Component {
    render() {
        return this.t`Component {
            @let segDisplayIndex = prop.segDisplayIndex
            @let variantsArr = prop.variantsArr
            @let genesArr = prop.genesArr
            @let testColor = @colorMap(5,["#0ac492","#ffff80","#8585e0","#ff6666","#3a91a5"])
            // @let colorMap = prop.map
            // @let updateRange = ((range)=>{
            //     this.xScale = range
            //     this.draw()
            //     console.log(this)
            // })
            height = 200
            width = 100%
            //xScale = @scaleLinear(prop.start,prop.end)
            // xScale = prop.geneRange
            // Text("lovvvv"+prop.start+prop.end){}
            // top rectangle background and variant arrow
            Rows{
                
                // ref = "geneArea"
                width = 100%
                Component{
                    xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    ref = "variant"
                    // components in rows need height setting to show.Relate height with displayedSpotLayers here.
                    height = variantsArr[segDisplayIndex].length * 12
                    // background rect
                    Rect.full {
                        // detached = true
                        fill = @color("areaBg")
                    }
                    // upper line
                    Line {
                        //detached = true // same as the effect of float in css
                        x2 = 100% // set end point to 100%
                        stroke = "#666"
                        shapeRendering = "crispEdges"
                    }
                    // variant arrow
                    Component {
                        y = 100%
                        @for (variant, i) in variantsArr[segDisplayIndex] {
                            // @if (variant.Type=="SNP"){

                            // }
                            // @elsif(variant.Type=="DEL"){

                            // }
                            // @else{

                            // }
                            Path {
                                key = i
                                x = @scaledX(variant.Pos); y = i * -12
                                // array path orbit,x right is +,y downis +.
                                d = "M0,0 L3,-4 L1.5,-4 L1.5,-8 L-1.5,-8 L-1.5,-4 L-3,-4 z"
                                fill =  "blue"
                                behavior:tooltip {
                                    content = ("variant_Chr:"+variant.Chr+"<br>variant_Pos:"+variant.Pos+"<br>variant_Variants:"+variant.Variants+"<br>variant_Type:"+variant.Type+"<br>variant_Decription:"+variant.Decription)
                                }
                            }
                        }
                    }
                }
                Component{
                    ref= "gene"
                    height = 100
                    width = 100%
                    xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    // variant line
                    Component {
                        // detached = true
                        height = 100%
                        @for (variant, i) in variantsArr[segDisplayIndex] {
                            Line {
                                key = i
                                x1 = @scaledX(variant.Pos); x2 = @scaledX(variant.Pos);
                                y1 = 0; y2 = 100%
                                stroke = @color("spotLine")
                                shapeRendering = "crispEdges"
                            }
                        }
                    }
                    Rows {
                        width = 100%
                        height = 100% // ** I temporarily set the static height,should detached
                        // xScale = @scaleLinear(seg.start,seg.end)
                        // *positive area
                        Container {
                            height = 50% // ** I am not sure here
                            width = 100%
                            // xScale = @scaleLinear(seg.start,seg.end)
                            Rect.full { fill = "rgba(160,160,255,.1)" ;detached = true}
                            @for (gene,i) in genesArr[segDisplayIndex]{
                                @if (gene.Strand=="+"){
                                    Component{
                                        y = 50%
                                        Polygon {
                                            @let l = @scaledX(gene.End)-@scaledX(gene.Start)
                                            points = [
                                                [@scaledX(gene.Start),-10],[@scaledX(gene.Start)+l*0.7,-10],[@scaledX(gene.Start)+l*0.7,-20],[@scaledX(gene.End),0],
                                                [@scaledX(gene.Start)+l*0.7,20],[@scaledX(gene.Start)+l*0.7,10],[@scaledX(gene.Start),10]
                                            ]
                                            fill = prop.colorMap.get(i%5)
                                            //stroke = "black"
                                            behavior:tooltip{
                                                content = ("gene_Name:"+gene.Name+"<br>gene_Description:"+gene.Decription+"<br>gene_Start:"+gene.Start+"<br>gene_End"+gene.End)
                                            }
                                            on:click = (()=>{
                                                prop.updateContent(gene)
                                                prop.alertInfo()})
                                        }
                                        // Arrow {
                                        //     @let l = @scaledX(gene.End)-@scaledX(gene.Start)
                                        //     x = @scaledX(gene.Start); x2 = @scaledX(gene.Start)+l*0.9;
                                        //     shaft.strokeWidth = 30
                                        //     head.width = 50
                                        //     head.height = l*0.1
                                        //     fill = prop.colorMap.get(i)
                                        //     stroke = "black"
                                        //     behavior:tooltip{
                                        //         content = ("gene_Name:"+gene.Name+"<br>gene_Description:"+gene.Decription+"<br>gene_Start:"+gene.Start+"<br>gene_End"+gene.End)
                                        //     }
                                        //     on:click = this.alertInfo(gene)
                                        // }
                                    }
                                }
                            }
                            Axis("bottom") {
                                detached = true
                                roundEndTicks = true
                            }
                        }
                        //annotation left
                        Component {
                            height = 1
                            Text {
                                x = -6; anchor = @anchor("right", "middle")
                                y = -12; text = "+"
                            }
                            Text {
                                x = -6; anchor = @anchor("right", "middle")
                                y = 12; text = "-"
                            }
                            Line {
                                x2 = 100%; shapeRendering = "crispEdges"
                            }
                        }
                        // negtive area
                        Container {
                            height = 50%
                            width = 100%
                            // padding-b = 13
                            Rect.full { fill = "rgba(255,255,160,.1)" } // **I temporarily delete the detached = true; 
                            @for (gene,i) in genesArr[segDisplayIndex]{
                                @if (gene.Strand=="-"){
                                    Component{
                                        y = 50%
                                        Polygon {
                                            @let l  = @scaledX(gene.End)-@scaledX(gene.Start)
                                            points = [
                                                [@scaledX(gene.End),-10],[@scaledX(gene.Start)+0.3*l,-10],[@scaledX(gene.Start)+0.3*l,-20],[@scaledX(gene.Start),0],
                                                [@scaledX(gene.Start)+0.3*l,20],[@scaledX(gene.Start)+0.3*l,10],[@scaledX(gene.End),10]
                                            ]
                                            fill = prop.colorMap.get(i%5)
                                            behavior:tooltip{
                                                content = ("gene_Name:"+gene.Name+"<br>gene_Description:"+gene.Description+"<br>gene_Start:"+gene.Start+"<br>gene_End"+gene.End)
                                            }
                                            //stroke = "black"
                                            on:click = (()=>{
                                                prop.updateContent(gene)
                                                prop.alertInfo()
                                                
                                            })
                                        }
                                        // Arrow {
                                        //     @let l  = @scaledX(gene.End)-@scaledX(gene.Start)
                                        //     x2 = @scaledX(gene.Start)+0.1*l; x = @scaledX(gene.End);
                                        //     shaft.strokeWidth = 30
                                        //     stroke = "black"
                                        //     fill = prop.colorMap.get(i)
                                        //     head.width = 40
                                        //     head.height = l*0.1
                                        //     // head.fill = "blue"
                                        //     behavior:tooltip{
                                        //         content = ("gene_Name:"+gene.Name+"<br>gene_Description:"+gene.Decription+"<br>gene_Start:"+gene.Start+"<br>gene_End"+gene.End)
                                        //     }
                                        //     on:click = this.alertInfo(gene)
                                        // }
                                    }
                                }
                            }
                            Axis("top") {
                                detached = true
                                y = 100%
                                roundEndTicks = true
                            }
                        }
                    }
                }
                // drag area
                Component{
                    y = 30; height = 30
                    //xScale = @scaleLinear(prop.dragStart,prop.dragEnd)
                    xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    // draw external rect shape
                    Rect {
                        width = 100%; height = 100%; fill = @color("brushBg")
                    }
                    // draw middle horizontal line
                    Line {
                        y1 = 50%; y2 = 50%; x2 = 100%; stroke = "#aaa"
                    }
                    //Component{
                        //xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                        // draw internal geneBar
                        Component.full {
                            // clip rect to show geneBar,cannot clip same area twice!!
                            clip = @clip("bound")
                            // Pos
                            @for (gene,i) in genesArr[segDisplayIndex] {
                                @if (gene.Strand==="+"){
                                    Rect {
                                        y =0
                                        key = i
                                        x = @scaledX(gene.Start)
                                        width = @scaledX(gene.End - gene.Start+1)
                                        height = 14; fill = @color("stPos"); fillOpacity = 0.8
                                        behavior:tooltip{content = gene.Start+"+"+gene.End}
                                    }
                                }
                                @else{
                                    Rect {
                                        key = i
                                        x = @scaledX(gene.Start); 
                                        y = 16
                                        width = @scaledX(gene.End - gene.Start+1)
                                        height = 14; fill =  @color("stNeg"); fillOpacity = 0.8
                                    }
                                }
                            }
                        }
                        // draw variant triangle
                        @for (variant, i) in variantsArr[segDisplayIndex] {
                            Path {
                                key = i
                                d =   "M4,0 L0,10 L-4,0 z"
                                // top triangle "M4,0 L0,-10 L-4,0 z" :
                                x = @scaledX(variant.Pos)
                                y = 0
                                fill = @color("stPos")
                            }
                        }  
                    //}
                    //Component{
                        // xScale = @scaleLinear(prop.dragStart,prop.dragEnd)
                        // Brush {
                        //     ref = "brush"
                        //     height = 30
                        //     cornerRadius = 4
                        //     // range = [prop.dragStart,prop.dragEnd]
                        //     range = [prop.dragStart,prop.dragEnd]
                        //     onBrushEnd = @bind(prop.updateRange)
                        //     brush.stroke = "#ffbb4d"
                        //     brush.strokeWidth = 2
                        // }
                    // brush which can choose specific area
                  //  }
                }
            }   
        }`
    }
    // updateDispayedGenes(range){
    //     this.prop.updateGenesDispayedRange(range)
    //     this.redraw()
    // }
}
export default GeneArea

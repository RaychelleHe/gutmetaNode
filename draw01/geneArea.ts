import Crux from 'crux'

const { Component } = Crux
class GeneArea extends Component {
    render() {
        return this.t`Component {
            height = 200
            width = 100%
            Rows{
                // ref = "geneArea"
                width = 100%
                // 1.top rectangle background and variant marks
                Component{
                    @let vl = prop.variantsData.length
                    @let hUnit =6 // 默认取6个突变时的高度
                    xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    ref = "variant"
                    // components in rows need height setting to show.Relate height with displayedSpotLayers here.
                    height = hUnit*12 // 默认取6个突变时的高度
                    // background rect
                    Rect.full {
                        fill = @color("areaBg")
                    }
                    Component {
                        @let flag = vl%2==0
                        @let deg = 180/(vl+4)
                        @let mid = flag? vl/2-1+0.5:Math.floor(vl/2)
                        @let vw = 10  // the width of variant flag-circle,triangle
                        @for (variant, i) in prop.variantsData {        
                            Component{
                                @let drawX = i>mid? hUnit*8*Math.tan(Math.ceil(i-mid)*deg*Math.PI/180)-vw/2+@scaledX(variant.Pos):hUnit*8*Math.tan(Math.floor(i-mid)*deg*Math.PI/180)-vw/2+@scaledX(variant.Pos)
                                @if (variant.Type=="SNP"){
                                    Circle{
                                        x = drawX
                                        r = vw/2
                                        stroke = "black"
                                        fill = "red"
                                        behavior:tooltip{
                                            content = ("variant_Chr:"+variant.Chr+"<br>variant_Pos:"+variant.Pos+"<br>variant_Variants:"+variant.Start+"<br>variant_Type"+variant.End+"<br>variant_Description"+variant.Description)
                                        }
                                    }
                                }
                                @elsif(variant.Type=="DEL"){
                                    Triangle {
                                        x = drawX
                                        width = vw
                                        height = vw
                                        stroke = "black"
                                        fill = "red"
                                        behavior:tooltip{
                                            content = ("variant_Chr:"+variant.Chr+"<br>variant_Pos:"+variant.Pos+"<br>variant_Variants:"+variant.Start+"<br>variant_Type"+variant.End+"<br>variant_Description"+variant.Description)
                                        }
                                    }
                                }
                                @else{
                                    Triangle{
                                        x = drawX
                                        width = vw
                                        height = vw
                                        orientation = "bottom"
                                        fill = "red"
                                        stroke = "black"
                                        behavior:tooltip{
                                            content = ("variant_Chr:"+variant.Chr+"<br>variant_Pos:"+variant.Pos+"<br>variant_Variants:"+variant.Start+"<br>variant_Type"+variant.End+"<br>variant_Description"+variant.Description)
                                        }
                                    }
                                }
                                Line{
                                    x1 = drawX+vw/2
                                    x2 = drawX+vw/2
                                    y1 = vw
                                    y2 = 4*hUnit
                                    stroke = @color("variantLine")
                                    strokeWidth = 2
                                    stage:active {
                                        stroke = "#00e1ff"
                                    }
                                    stage = prop.variantHover[i]
                                    on:mouseenter = ((ev,el)=>{
                                        el.stage = "active"
                                        prop.variantHoverFun("active",i)
                                        el.$parent.redraw() 
                                    })
                                    on:mouseleave = ((ev,el)=>{
                                        el.stage = null
                                        prop.variantHoverFun(null,i)
                                        el.$parent.redraw() 
                                    })
                                }
                                Line{
                                    x1 = drawX+vw/2
                                    x2 = @scaledX(variant.Pos)
                                    y1 = 4*hUnit
                                    y2 = 12*hUnit
                                    stroke = @color("variantLine")
                                    strokeWidth = 2
                                    stage:active {
                                        stroke = "#00e1ff"
                                    }
                                    stage = prop.variantHover[i]
                                    on:mouseenter = ((ev,el)=>{
                                        el.stage = "active"
                                        prop.variantHoverFun("active",i)
                                        el.$parent.redraw() 
                                    })
                                    on:mouseleave = ((ev,el)=>{
                                        el.stage = null
                                        prop.variantHoverFun(null,i)
                                        el.$parent.redraw() 
                                    })
                                }
                            }
                        }
                    }
                }
                // 2.gene-variantLine area
                Component{
                    ref= "gene"
                    height = 100
                    width = 100%
                    xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    // 2.1 variant line
                    Component {
                        // detached = true
                        height = 100%
                        @for (variant, i) in prop.variantsData {
                            Line {
                                key = i
                                x1 = @scaledX(variant.Pos); x2 = @scaledX(variant.Pos);
                                y1 = 0; y2 = 100%
                                stroke = @color("variantLine")//** 
                                strokeWidth = 2
                                shapeRendering = "crispEdges"
                                stage:active {
                                    stroke = "#00e1ff"
                                }
                                stage = prop.variantHover[i]
                                on:mouseenter = ((ev,el)=>{
                                    el.stage = "active"
                                    prop.variantHoverFun("active",i)
                                    el.$parent.redraw() 
                                })
                                on:mouseleave = ((ev,el)=>{
                                    el.stage = null
                                    prop.variantHoverFun(null,i)
                                    el.$parent.redraw() 
                                })
                            }
                        }
                    }
                    // 2.2 gene area
                    Rows {
                        width = 100%
                        height = 100% 
                        // 2.2.1 positive area
                        Container {
                            height = 50%
                            width = 100%
                            Rect.full { fill = "rgba(160,160,255,.1)"}
                            @for (gene,i) in prop.genesData{
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
                                                prop.clickGene(gene)})
                                                //prop.alertInfo()})
                                        }
                                    }
                                }
                            }
                            Axis("bottom") {
                                detached = true
                                roundEndTicks = true
                            }
                        }
                        //2.2.2 annotation left
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
                        // 2.2.3 negtive area
                        Container {
                            height = 50%
                            width = 100%
                            Rect.full { fill = "rgba(255,255,160,.1)" }
                            @for (gene,i) in prop.genesData{
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
                                                prop.clickGene(gene)
                                                //prop.alertInfo()
                                                
                                            })
                                        }
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
                // 3.drag area
                Component{
                    y = 30; height = 30
                    xScale = @scaleLinear(prop.dragStart,prop.dragEnd)
                    // xScale = @scaleLinear(prop.genesStart,prop.genesEnd)
                    // draw external rect shape
                    Rect {
                        width = 100%; height = 100%; fill = @color("brushBg")
                    }
                    // draw middle horizontal line
                    Line {
                        y1 = 50%; y2 = 50%; x2 = 100%; stroke = "#aaa"
                    }
                    Component{
                        //@for (gene,i) in prop.genesArr[prop.segDisplayIndex] {
                        @for (gene,i) in prop.dragGenes {
                            @if (gene.Strand==="+"){
                                Rect {
                                    x = @scaledX(gene.Start)
                                    fill = @color("genePos")
                                    height = 14
                                    width = @scaledX(gene.End)-@scaledX(gene.Start)+1
                                }
                            }
                            @else{
                                Rect {
                                    y = 16
                                    x = @scaledX(gene.Start)
                                    fill = @color("geneNeg")
                                    height = 14
                                    width = @scaledX(gene.End)-@scaledX(gene.Start)+1
                                }
                            }
                        }
                    }
                        // draw variant triangle
                    // @for (variant, i) in prop.variantsArr[prop.segDisplayIndex] {
                    @for (variant, i) in prop.dragVariants {
                        Path {
                            key = i
                            d =   "M4,0 L0,10 L-4,0 z"
                            // top triangle "M4,0 L0,-10 L-4,0 z" :
                            x = @scaledX(variant.Pos)
                            y = 0
                            fill = @color("variantMark")
                        }
                    }  
                    Component{
                        // brush which can choose specific area
                        Brush {
                            ref = "brush"
                            height = 30
                            cornerRadius = 4
                            range = [prop.dragStart,prop.dragEnd]
                            onBrushEnd = @bind(prop.updateRange)
                            brush.stroke = "#ffbb4d"
                            brush.strokeWidth = 2
                        }
                    
                   }
                    // Component{
                    //     Rect{
                    //         @let rangeL = @scaledX(prop.range[1])-@scaledX(prop.range[0])
                    //         x = @scaledX(prop.range[0])
                    //         width = rangeL
                    //         height = 30
                    //         fill = "white"
                    //         fillOpacity = 0.2
                    //         cornerRadius = 5
                    //         behavior:drag {
                    //             direction = "x"
                    //             validRangeX = [rangeL, @scaledX(prop.dragEnd)-rangeL]
                    //             onDrag = ((ev, el, delta) => {
                    //                 updateRange("both",(prop.dragEnd-prop.dragStart)/660*delta[0])
                    //                 //el.$parent.redraw()
                    //             })
                    //         }
                    //     }
                    //     Rect{
                    //         x = @scaledX(prop.range[0])
                    //         y = 5
                    //         height = 20
                    //         width = 1
                    //         behavior:drag {
                    //             direction = "x"
                    //             validRangeX = [prop.dragStart, prop.range[1]]
                    //             onDrag = ((ev, el, delta) => {
                    //                 updateRange("left",(prop.dragEnd-prop.dragStart)/660*delta[0])
                    //                 //el.$parent.redraw()
                    //             })
                    //         }
                    //     }
                    //     Rect{
                    //         x = @scaledX(prop.range[0])
                    //         y = 5
                    //         height = 20
                    //         width = 1
                    //         behavior:drag {
                    //             direction = "x"
                    //             validRangeX = [prop.range[0], prop.dragEnd]
                    //             onDrag = ((ev, el, delta) => {
                    //                 updateRange("right",(prop.dragEnd-prop.dragStart)/segW*segLength*delta[0])
                    //                 //el.$parent.redraw()
                    //             })
                    //         }
                    //     }
                    // }
                }
            }   
        }`
    }

    // eslint-disable-next-line
}
export default GeneArea

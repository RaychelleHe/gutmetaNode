import Crux from 'crux'

// const { Component } = Crux

// define a customized component named SegBlock to draw rect block of a seg
// Crux.c only can be used to define a component without functions and variants
const SegBlock = Crux.c(`Component {
    //Text.centered{text=prop.index+1;x=prop.width/2;y=prop.height/2;}
    //Text.centered{text=i+1;x=i*segW+segW/2;y=segW/2;}
    Rect{
        // x = @scaledX(prop.data.start)
        width = prop.width
        height = prop.height
        fill = prop.color
        stage:active {
            stroke = "red"
            fillOpacity=0.4
        }
        // set stage
        behavior:tooltip{
            content = ("Seg_Name:"+prop.data.name+"<br>Seg_Start:"+prop.data.start+"<br>Seg_End:"+prop.data.end+"<br>Seg_Source:"+prop.data.source)
        } 
        stage = prop.hoverArr[prop.index]
        on:mouseenter = ((ev,el)=>{
            el.stage = "active"
            prop.hoverFun("active",prop.index)
            el.$parent.$parent.redraw()
            })
        on:mouseleave = ((ev,el)=>{
            el.stage = null
            prop.hoverFun(null,prop.index)
            el.$parent.$parent.redraw()
        })
        on:click = ((ev,el)=>{
            prop.clickSeg(prop.index,this,el)
            //el.$parent.$parent.redraw()
        })
        stroke = "black"
    }
}`)

// class myBrush extends Component {
//     render() {
//         return this.t`Component{
//             Rect{
//                 width = prop.range[0]-prop.range[1]
//                 height = prop.height
//                 fill = "white"
//                 fillOpacity = 0.2
//                 cornerRadius = 5
//             }
//             Line{
//                 x1 = prop.range[0]
//                 x2 = prop.range[0]
//                 y1 = 2
//                 y2 = prop.height-2
//             }
//             Line{
//                 x1 = prop.range[1]
//                 x2 = prop.range[1]
//                 y1 = 2
//                 y2 = prop.height-2
//                 behavior:drag {
//                     direction = "x"
//                     validRangeX = [20, 320]
//                     onDrag = ((ev, el, delta) => {
//                         dragPos += delta[0]
//                         el.$parent.redraw()
//                     })
//                 }
//             }
//         }`
//     }
// }
export default SegBlock

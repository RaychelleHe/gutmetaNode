import Crux from 'crux'

// define a customized component named SegBlock to draw rect block of a seg
// Crux.c only can be used to define a component without functions and variants
const SegBlock = Crux.c(`Component {
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
            // el.$parent.$parent.$ref["trueScale"].redraw()
            // el.$parent.$parent.$ref["rescale"].redraw()
            // el.$parent.$parent.$ref["newSeq"].redraw()
            })
        on:mouseleave = ((ev,el)=>{
            el.stage = null
            prop.hoverFun(null,prop.index)
            el.$parent.$parent.redraw()
            // el.$parent.$parent.$ref["trueScale"].redraw()
            // el.$parent.$parent.$ref["rescale"].redraw()
            // el.$parent.$parent.$ref["newSeq"].redraw()
        })
        on:click = ((ev,el)=>{
            prop.clickedFun(prop.index)
            //el.$parent.$parent.$ref.trueScale.redraw()
            //el.$parent.$parent.$ref.rescale.redraw()
            //el.$parent.$parent.$ref.newSeq.redraw()
            //el.$parent.$parent.$ref.geneArea.redraw()
            el.$parent.$parent.redraw()
            // console.log(el.$parent)
            // console.log(el.$parent.$parent)
            // console.log(el.$parent.$parent.$ref.geneArea)
            // el.$parent.$parent.$ref.geneArea.redraw()
        })
        stroke = "black"
    }
}`)
export default SegBlock

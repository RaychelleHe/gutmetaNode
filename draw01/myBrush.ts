import Crux from 'crux'

const { Component } = Crux

class myBrush extends Component{
    render(){
        return this.t`
            Component{
                Rect.fill{
                    stroke = "#eead44"
                    strokeWidth = 2
                    cornerRadius = 5
                    fill = "white"
                    fillOpacity = 0.1
                }
            }
        `
    }
}
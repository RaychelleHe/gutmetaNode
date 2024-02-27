# oviz绘图

1. https://docs.oviz.org/#/
2. https://chart.oviz.org/#/charts
3. https://ncbi.nlm.nih.gov/pmc/articles/PMC9550834/figure/Fig2/
4. https://dillinger.io/ // md editor
5. https://stackedit.io/ // md editor
6. https://www.programiz.com/javascript/online-compiler/ //js editor

## 数据
1. 深度图数据

![深度图数据](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth.png?raw=true)
[{"name":"NZ_CP05217.1","dep":[51,52]}]

2. 片段详细信息

![片段详细信息](https://github.com/RaychelleHe/images/blob/main/oviz/gene_info.png?raw=true)
需要处理成:
[{"name":"INS1","type":"INS","length":100,"source\_pre":"NZ\_CP058217.1","source\_start":1,"source\_end":100,"dep":[3,4,5]}]
***dep存储5000个深度点，怎么分***
3. 片段顺序

SEG1+SEG3+SEG5+SEG7+INS1+SEG8+SEG10+INS2+SEG11+SEG13+INS3+SEG14+SEG15+INS4+SEG16+SEG17+SEG17+SEG18+SEG19-SEG20+INS5+SEG22+
需要处理成：
[{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num"=2,"direction":"+"}]
4. 草稿图

![alt](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth_script.jpg?raw=true "test")
## 前期js数据处理代码

## oviz drawing logic

1. Rect{}+Text{}

2. new SEG

    @let pointX=0
    @let pointY=0
    1. preBlock is +
        1. not changeDirection && seg.num-preNum==1,draw a rect at right directly.
        ```
        @if !changeDirection && seg.num-preNum==1{
            Rect{
                x=pointX;y=pointY;width=geneW;height=geneW;fill=map.get(seg.num)
            }
            pointX=seg.num*geneW
        }
        ```
        2. not changeDirection && seg.num>preNum+1,draw a line at right and a rect at right.
        ```
        @elsif !changeDirection && seg.num>preNum+1 {
            Line{
                x1=pointX;x2=(seg.num-1)*geneW;y1=pointY+geneW/2;y2=pointY+geneW/2;
            }
            React{
                x=(seg.num-1)*geneW;y=pointY;width=geneW;height=geneW;fill=map.get(seg.num)
            }
            pointX=seg.num*geneW
        }
        ```
        3. not changeDirection && seg.num<=preNum,draw a line -width geneW and half a circle,
        and a line x1=(preNum+1)\*geneW;x2=(seg.num-1)\*geneW;y1=point1;y2=point1,and half a circle.
        @elsif !changeDirection && seg.num<=preNum {
            Line{
                x1=pointX;x2=pointX+geneW;y1=pointY+geneW/2;y2=pointY+geneW/2;
            }
            Arcline{
                x=pointX+geneW
                y=pointY+geneW/2
                r=geneW/2
                x1=0;x2=180
            }
            // pointY=pointY+geneW
            Line{
                x1=pointX+geneW
                x2=(seg.num-1)*geneW
                y1=pointY+geneW*1.5
                y2=pointY+geneW*1.5
            }
            Arcline{
                x=(seg.num-1)*geneW
                y=pointY+2*geneW
                x1=180
                x2=360
                r=geneW/2
            }
            pointX=seg.num*geneW
            pointY=pointY+2*geneW
        }
        4. changeDirection && seg.num>=preNum+1,draw a line (x1=preNum\*i;x2=seg.num\*i;y1=point1;y2=point1) and half a circle.
        @elsif changeDirection && seg.num>=preNum+1 {
            Container{
                Line{
                    x1=pointX
                    x2=(seg.num-1)*geneW
                    y1=pointY+geneW/2
                    y2=pointY+geneW/2
                }
                Arcline{
                    x=seg.num*geneW
                    y=pointY+1.5geneW
                    x1=0
                    x2=180
                    r=geneW
                }
            }
        }
        5. changeDirection && seg.num<preNum,draw a circle and a line(x1=preNum\*i;x2=seg.num\*i,y1=point1;y2=point1)
        @else{
            Arcline{
                x=pointX
                y=pointY+1.5*geneW
                x1=0
                x2=180
                r=geneW
            }
            Line{
                x1=pointX
                x2=seg.num*geneW
                y1=pointY+2.5*geneW
                y2=y1=pointY+2.5*geneW
            }
            pointX=(seg.num-1)*geneW
            pointY=pointY+2*geneW
        }
    2. preBlock is -
        same
    pointX=seg.num*geneW
    
## oviz图片代码
```
// definition only in componnet
svg{
    x = 10
    y = 10
    // 深度信息图
    // 原始基因片段图
    // 基因方块
    Component{
        @let seg_info = [{"name":"SEG1","length":190,"source":"1-3000"},{"name":"SEG2","length":200,"source":"3001-5000"}]
        @let new_seg = [{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num":2,"direction":"+"}]
        @let map = @colorMap(22) // ** 22 = seg_info.length
        @let geneW = 40 // 方块大小
         Component{
            @for (seg,i) in seg_info {
                // 方块
                Rect{
                	x=i*geneW
                	width=geneW
                	height=geneW
                    fill=map.get(i) // **
                }
                // 文字 原子组件内不允许创建子组件
                Text.centered{
            		text=i+1
                    x=i*geneW+geneW/2
                    y=geneW/2
                }
            }
        }
        Component{
            y = geneW+10
            @let pointX = 0
            @let pointY = 0
            @let preNum = 0 // previous SEG number
            @let direction = '+'
            @let changeDirection = false
            @for (seg,i) in new_seg{
                changeDirection = direction==seg.direction
                @if seg.type=="SEG"{
                    @if !changeDirection && seg.num>=preNum+1 {
                        Line{
                            x1=pointX;x2=(seg.num-1)*geneW;y1=pointY+geneW/2;y2=pointY+geneW/2;
                        }
                        Rect{
                            x=(seg.num-1)*geneW;y=pointY;width=geneW;height=geneW;fill=map.get(seg.num)
                        }
                        pointX=seg.num*geneW
                    }
                    @elsif !changeDirection && seg.num<=preNum {
                        Line{
                            x1=pointX;x2=pointX+geneW;y1=pointY+geneW/2;y2=pointY+geneW/2;
                        }
                        Arcline{
                            x=pointX+geneW
                            y=pointY+geneW
                            r=geneW/2
                            x1=0;x2=180
                        }
                        Line{
                            x1=pointX+geneW
                            x2=(seg.num-1)*geneW
                            y1=pointY+geneW*1.5
                            y2=pointY+geneW*1.5
                        }
                        Arcline{
                            x=(seg.num-1)*geneW
                            y=pointY+2*geneW
                            x1=180
                            x2=360
                            r=geneW/2
                        }
                        pointX=seg.num*geneW
                        pointY=pointY+2*geneW
                    }
                    @elsif changeDirection && seg.num>=preNum+1 {
                        Container{
                            Line{
                                x1=pointX
                                x2=(seg.num-1)*geneW
                                y1=pointY+geneW/2
                                y2=pointY+geneW/2
                            }
                            Arcline{
                                x=seg.num*geneW
                                y=pointY+1.5geneW
                                x1=0
                                x2=180
                                r=geneW
                            }
                            pointX=(seg.num-1)*geneW
                            pointY=pointY+geneW*2
                        }
                    }
                    @else{
                        Arcline{
                            x=pointX
                            y=pointY+1.5*geneW
                            x1=0
                            x2=180
                            r=geneW
                        }
                        Line{
                            x1=pointX
                            x2=seg.num*geneW
                            y1=pointY+2.5*geneW
                            y2=y1=pointY+2.5*geneW
                        }
                        pointX=(seg.num-1)*geneW
                        pointY=pointY+2*geneW
                    }
                }
                @else{
                // 插入基因片，三角标记
                    Triangle {
                        x=pointX-0.5*geneW
                        y=pointY-0.25*geneW
                        width = geneW; height = 0.25*geneW;
                        orientation = "bottom"
                    }
                }
            }
        }
    }
   
}
```

# oviz绘图

1. https://docs.oviz.org/#/
2. https://chart.oviz.org/#/charts
3. https://ncbi.nlm.nih.gov/pmc/articles/PMC9550834/figure/Fig2/
4. https://dillinger.io/ // md editor
5. https://stackedit.io/ // md editor
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

## oviz图片代码
```
svg{
    x = 10
    y = 10
    // 深度信息图
    // 原始基因片段图
    @let seg_info = [{"name":"SEG1","length":190,"source":"1-3000"},{"name":"SEG2","length":200,"source":"3001-5000"}]
    @let new_seg = [{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num":2,"direction":"+"}]
    @let map = @colorMap(22) // ** 22 = seg_info.length
    @let geneW = 40 // 方块大小
    // 基因方块
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
    Component{
        y = geneW+10
        @let pointX = 0
        @let pointY = y
        @let preNum = 0 // previous SEG number
        @for (seg,i) in new_seg{
            @if seg.type=="SEG"{
                @let flag = seg.num-preNum 
                @if flag=1{
                // 右方邻居基因片
                    Rect{
                        x=(seg.num-1)*geneW
                    	width=geneW
                    	height=geneW
                        fill=map.get(seg.num) // **
                    }
                    preNum = seg.num
                }
                @elsif flag>1{
                // 右方远邻基因 需要画直线
                    Line{
                        x1=preNum*geneW;x2=(seg.Num-1)*geneW;y1=1/2*geneW;y2=1/2*geneW;
                    }
                    Rect{
                        x=(seg.Num-1)*geneW
                    	width=geneW
                    	height=geneW
                        fill=map.get(seg.num) // **
                    }
                    preNum = seg.num
                }
                @else{
                // 左方基因或重复基因，需要换行
                    Arc{
                        
                    }
                }
                Rect{
                    
                }
            }
            @else{
            // 插入基因片，三角标记
                
            }
        }
    	y = geneW+10
    	@let drawSeg = 
    	segPre = 0
    	segNow = int(name.substring(0,3))
    	if(name.substring(0,3)==”SEG”){
    		// line
    		if((segNow-sgePre)=!1){
    			Line{y1=5;x1=segPre*10+10;x2=segNow*10}
            }
    		Rect{
    		x = segNow*10
    		width = 10
    		height = 10
            color = // **
            }else{
    
            }
        }
    }
}
```

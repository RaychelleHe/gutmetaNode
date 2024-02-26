# oviz绘图

https://docs.oviz.org/#/
https://chart.oviz.org/#/charts
https://ncbi.nlm.nih.gov/pmc/articles/PMC9550834/figure/Fig2/
## 数据
1.深度图数据
![深度图数据](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth.png?raw=true)
[{"name":"NZ_CP05217.1","dep":[51,52]}]
2.片段详细信息
![片段详细信息](https://github.com/RaychelleHe/images/blob/main/oviz/gene_info.png?raw=true)
需要处理成:
[{"name":"INS1","type":"INS","length":100,"source\_pre":"NZ\_CP058217.1","source\_start":1,"source\_end":100}]
3.片段顺序
SEG1+SEG3+SEG5+SEG7+INS1+SEG8+SEG10+INS2+SEG11+SEG13+INS3+SEG14+SEG15+INS4+SEG16+SEG17+SEG17+SEG18+SEG19-SEG20+INS5+SEG22+
需要处理成：
[{"type":"SEG","name":"SEG1","direction":"+"}...]
4.草稿图
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
    	@let drawSeg = name.substring(0,3)==”SEG”
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
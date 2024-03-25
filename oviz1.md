# oviz绘图

## 工具
1. https://docs.oviz.org/#/
2. https://chart.oviz.org/#/charts
3. https://ncbi.nlm.nih.gov/pmc/articles/PMC9550834/figure/Fig2/
4. https://dillinger.io/ // md editor
5. https://stackedit.io/ // md editor
6. https://www.programiz.com/javascript/online-compiler/ //js editor
7. https://codesandbox.io/ //online editor
8. https://products.aspose.app/cells/zh-hant/conversion/csv-to-json
## 数据
1. 深度图数据

![深度图数据](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth.png?raw=true)
[{"name":"NZ_CP05217.1"}]
2. 片段详细信息

![片段详细信息](https://github.com/RaychelleHe/images/blob/main/oviz/gene_info.png?raw=true)
前端处理成:
[{"name":"INS1","length":100,"source":"NZ\_CP058217.1","start":1,"end":100}]
3. 片段顺序
SEG1+SEG3+SEG5+SEG7+INS1+SEG8+SEG10+INS2+SEG11+SEG13+INS3+SEG14+SEG15+INS4+SEG16+SEG17+SEG17+SEG18+SEG19-SEG20+INS5+SEG22+
前端处理成：
[{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num"=2,"direction":"+"}]  
4. 基因数据  
[{"Chr":,"Start":,"End","Strand","Description":,"Sequence":,"Name":}]
5. 突变数据  
[{"Pos":,"Type":,"Chr","Variants":,"Description":}]
6. 草稿图

![alt](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth_script.jpg?raw=true "test")
## 前期js数据处理代码
1.**python 处理深度代码**  
处理逻辑：遍历新处理的newSegInfo数组，将深度平均分成n个点，简单将length/n,如果是整数平分，如果不是整数，例如1.3，每份1个，最后一份多n*0.3个点。
```
import pandas as pd
import numpy as np
import math
data = pd.read_csv("S8.depth.gz", sep="\t",header=None,names=["gene","position","depth"],compression='gzip')
data
data.sort_values("position",inplace=True)
depth = data["depth"].values

with open('newSegInfo.json') as file1:
  segs = json.load(file1)
n = 100
def getDepthArr(start,end,length):
    ar = depth[start-1:end]
    flag = length%n
    windowSize = int(length/n)
    if flag!=0:
        res = [np.mean(ar[i:i + windowSize]) for i in range(0, (n-1)*windowSize, windowSize)]
        res.append(np.mean(ar[(n-1)*windowSize:]))
    else:
        res = [np.mean(ar[i:i + windowSize]) for i in range(0, length, windowSize)]
    res.append(res[-1])
    res.insert(0,res[0])
    return res
segsDepthArr = []
avg = []
for i in segs:
    start = int(i["start"])
    end = int(i["end"])
    length = (end-start+1)
    segDepthArr = getDepthArr(start,end,length)
    segsDepthArr.append(segDepthArr)
    avg.append(np.mean(segDepthArr))
# np.savetxt("segsDepthArr.csv",segsDepthArr,delimiter=",",header = " ")
# np.savetxt("segsDepthAvg.csv",avg,delimiter=",",header = " ")
```
**2.python 处理genes、variants数据代码**
```
import pandas as pd
import numpy as np
import math
import json

with open('newSegInfo.json') as file1:
  newSegInfo = json.load(file1)
with open('genesData.json') as file2:
    genes = json.load(file2)
with open('S8.variants.json') as file3:
    variants = json.load(file3)
print(newSegInfo[0])
print(genes[-1])
print(variants[0])

genesArr = []
variantsArr = []
def genesLoaded(genes,segs):
    for i in segs:
        start = i["start"]
        end = i["end"]
        arr = []
        for j in genes:
            if (j["Start"])>=start and j["End"]<=end :
                arr.append(j)
            elif j["Start"]>=start and j["Start"]<=end:
                item = j
                item["End"] = end
                arr.append(item)
            elif j["End"]>=start and j["End"]<=end:
                item = j
                item["Start"] = start
                arr.append(item)
        genesArr.append(arr)
def variantsLoaded(variants,segs):
    for i in segs:
        start = i["start"]
        end = i["end"]
        arr = []
        for j in variants:
            if j["Pos"]>=start and j["Pos"]<end:
                arr.append(j)
        variantsArr.append(arr)
genesLoaded(genes,newSegInfo)
variantsLoaded(variants,newSegInfo)
with open('genesArr.json', 'w') as file:
    json.dump(genesArr, file, indent=4)
with open('variantsArr.json', 'w') as file:
    json.dump(variantsArr, file, indent=4)
```

## gene picture
*logic* :put gene and variant information into seg array.
1. gene handler function
2. variant handler function

## oviz drawing logic
1.**top seg part**  

**structure**:  
    1.true scale seg block  
    2.depth area  
    3.rescale seg block  
    4.new seg sequence area  
    
**data needed**:  
    [start,end,newSegInfo,depth,drag,segSequence,clickedArr]  
    **start**:first seg's start  
    **end**:last seg's end  
    **newSegInfo**:[{start:,end:,length:,source:,name:,genes:[],variants:[]},{},...]  
    **depth**:depth picture data,format:[{points:[],avg:67}]  
    **drag**:ref([x1,x2])  
    **segSequence**:new seg sequence picture  
    **clickedArr**:n segs status-clicked  or not,format:[null,"active",...]  
    
**original data**:  
    [originalSeg,segSequence,segsDepthArr,avgArr]  
    
**data handler function**:  
    [newSegParse,depthDrawData]  
    
**own variants**:  
    [segW,clickedFun]  
    **segW**:seg block's width  
    **clickedFun**:react to clicking action  
    
**components**:  
    [SegBlock]  
    
2.**bottom gene part**  

**structure**:  
    1.top variant area  
    2.positive gene area  
    3.negtive gene area  
    4.drag bar  
    
**data needed**:  
    [newSegInfo,drag,clickedArr]  
    
**data handler function**:  
    [genesLoaded,variantsLoaded]  
    **genesLoaded**:load genes data into newSegInfo  
    **variantsLoaded**:load variants data into newSegInfo 
**variant part logic** 
```
@let flag = vl%2==0 
@let deg = 180/(vl+4)
@let mid = flag? vl/2-1+0.5:Math.floor(vl/2)
@let vw = 10  // the width of variant flag-circle,triangle
@let drawX = i>mid? vl*8*Math.tan(Math.ceil(i-mid)*deg*Math.PI/180)-vw/2+@scaledX(variant.Pos):vl*8*Math.tan(Math.floor(i-mid)*deg*Math.PI/180)-vw/2+@scaledX(variant.Pos)
vl代表要绘制的variant的数量，flag用来表示数量是否是偶数。deg代表单位偏斜角度，相对于90度垂直线来说，向右偏斜为正，向左偏斜为负，+4是让点位不要变成0度和180度，以及点位不需要考虑如果variant数量是偶数如何除出deg，可以增加4，不要减小4，4越增，variant越居中聚拢。mid用来计算需要偏斜多少个deg。
vw代表一个variant的三角形、圆形的宽度（直径）。drawX代表三角形、圆形开始绘制的x坐标。
drawX->如果i>mid,i在右边，需要正偏斜，vl*8是是斜线的高度h, Math.tan(Math.ceil(i-mid)*deg*Math.PI/180)是偏斜角度的tan正切值，h*tan = 距离真实variant.Pos的距离，-vw+2去突变标记图形的中间点，+@scaledX(variant.Pos)得到当前的实际绘图坐标。三元表达式，判断正负，如果在右边需要取Math.ceil,如果在左边需要取Math.floor得到正确偏斜deg的份数。
```
在rows里面，只有container可以不预先指定高度，根据子组件确定高度，实现auto效果。Component不可以。@let声明必须在Component...其他组件的第一个括号内，不可以在@if(){}内。自定义组件this.$el.$parent是自定义组件，this.$el.$parent.$parent是模板。vue里的函数不可以通过template传进自定义组件，只能在template中重新定义函数调用vue函数，再传进自定义组件。交互刷新通过双向绑定ref。
    
   

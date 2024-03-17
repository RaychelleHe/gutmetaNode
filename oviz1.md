# oviz绘图

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
[{"name":"NZ_CP05217.1","dep":[51,52]}]
data handled by python
```
[60.84980629858631,
 0.0011707595659623071,
 60.95721497646851,
 0.0,
 60.529254520076954,
 0.0,
 60.35006451149271,
 60.558694212310165,
 0.0,
 59.3891564378357,
 57.88968065709217,
 0.0005446623093681917,
 59.588996582664386,
 60.695036354878496,
 60.09729649435533,
 59.87216657003896,
 70.88255624830578,
 61.20990102623311,
 53.94211017740429,
 62.16095596686125,
 0.0014005602240896359,
 61.87944614225016]

lenAr = [359665, 2083, 73360, 2699, 541796, 1440, 545743, 243748, 2298, 183329, 989420, 1026, 440844, 329057, 1815, 237399, 1448, 337982, 304, 111481, 1419, 647050]
```
2. 片段详细信息

![片段详细信息](https://github.com/RaychelleHe/images/blob/main/oviz/gene_info.png?raw=true)
需要处理成:
[{"name":"INS1","type":"INS","length":100,"source\_pre":"NZ\_CP058217.1","source\_start":1,"source\_end":100,"dep":[3,4,5]}]
3. 片段顺序
SEG1+SEG3+SEG5+SEG7+INS1+SEG8+SEG10+INS2+SEG11+SEG13+INS3+SEG14+SEG15+INS4+SEG16+SEG17+SEG17+SEG18+SEG19-SEG20+INS5+SEG22+
需要处理成：
[{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num"=2,"direction":"+"}]
4. 草稿图

![alt](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth_script.jpg?raw=true "test")
## 前期js数据处理代码
python 处理深度代码
```
import pandas as pd
import numpy as np
import math
data = pd.read_csv("S8.depth.gz", sep="\t",header=None,names=["gene","position","depth"],compression='gzip')
data
data.sort_values("position",inplace=True)
depth = data["depth"].values

segs = [
  { "name": 'SEG1', "start": '1', "end": '359665' },
  { "name": 'SEG2', "start": '359666', "end": '361748' },
  { "name": 'SEG3', "start": '361749', "end": '435108' },
  { "name": 'SEG4', "start": '435109', "end": '437807' },
  { "name": 'SEG5', "start": '437808', "end": '979603' },
  { "name": 'SEG6', "start": '979604', "end": '981043' },
  { "name": 'SEG7', "start": '981044', "end": '1526786' },
  { "name": 'SEG8', "start": '1526787', "end": '1770534' },
  { "name": 'SEG9', "start": '1770535', "end": '1772832' },
  { "name": 'SEG10', "start": '1772833', "end": '1956161' },
  { "name": 'SEG11', "start": '1956162', "end": '2945581' },
  { "name": 'SEG12', "start": '2945582', "end": '2946607' },
  { "name": 'SEG13', "start": '2946608', "end": '3387451' },
  { "name": 'SEG14', "start": '3387452', "end": '3716508' },
  { "name": 'SEG15', "start": '3716509', "end": '3718323' },
  { "name": 'SEG16', "start": '3718324', "end": '3955722' },
  { "name": 'SEG17', "start": '3955723', "end": '3957170' },
  { "name": 'SEG18', "start": '3957171', "end": '4295152' },
  { "name": 'SEG19', "start": '4295153', "end": '4295456' },
  { "name": 'SEG20', "start": '4295457', "end": '4406937' },
  { "name": 'SEG21', "start": '4406938', "end": '4408356' },
  { "name": 'SEG22', "start": '4408357', "end": '5055406' }
]
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
    
   

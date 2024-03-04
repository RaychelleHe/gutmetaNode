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

2. 片段详细信息

![片段详细信息](https://github.com/RaychelleHe/images/blob/main/oviz/gene_info.png?raw=true)
需要处理成:
[{"name":"INS1","type":"INS","length":100,"source\_pre":"NZ\_CP058217.1","source\_start":1,"source\_end":100,"dep":[3,4,5]}]
***dep存储5000个深度点，怎么分***
3. 片段顺序

SEG1+SEG3+SEG5+SEG7+INS1+SEG8+SEG10+INS2+SEG11+SEG13+INS3+SEG14+SEG15+INS4+SEG16+SEG17+SEG17+SEG18+SEG19-SEG20+INS5+SEG22+
需要处理成：
[{"type":"SEG","num":1,"direction":"+"},{"type":"SEG","num"=2,"direction":"+"}]
*插入数据方向，插入数据有多个怎么排列？*
4. 草稿图

![alt](https://github.com/RaychelleHe/images/blob/main/oviz/gene_depth_script.jpg?raw=true "test")
## 前期js数据处理代码
python 处理深度代码

import pandas as pd
import math
data = pd.read_csv("S8.depth", sep="\t",nrows=20,header=None,names=["gene","position","depth"])
data.sort_values("position",inplace=True)
depth = data["depth"].values
depth

n = 100
segs = []
def getDepthArr(start,end):
    ar = depth[start-1,end]
    res = [np.mean(ar[i:i + n]) for i in range(0, len(ar), n)]
segsDepthArr = []
for i in segs:
    segDepthArr = getDepthArr(i.start,i.end)
    segsDepthArr.apped(segDepthArr)
getDepthArr
## oviz drawing logic

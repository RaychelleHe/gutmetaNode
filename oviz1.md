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
```
import pandas as pd
import math
data = pd.read_csv("S8.depth", sep="\t",header=None,names=["gene","position","depth"])
data
data.sort_values("position",inplace=True)
depth = data["depth"].values
len(depth)

n = 100
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
def getDepthArr(start,end):
    start = int(start)
    end = int(end)
    ar = depth[start-1:end]
    res = [np.mean(ar[i:i + n]) for i in range(0, len(ar), n)]
segsDepthArr = []
for i in segs:
    # print(i)
    segDepthArr = getDepthArr(i["start"],i["end"])
    segsDepthArr.append(segDepthArr)
segsDepthArr
```
## oviz drawing logic

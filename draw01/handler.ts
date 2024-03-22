function genesLoaded(genes:Gene[],segs:Seg[]){
	segs.forEach((s,i)=>{
		var start = s.start
		var end = s.end
		genes.forEach((g,j)=>{
			if(g.Start>=start&&g.End<=end){
				s.genes.push(g)
			}else if(g.Start>=start&&g.Start<=end){
			    let item = {...g}
			    item.End = end
                s.genes.push(item)
            }else if(g.End>=start&&g.End<=end){
                let item = {...g}
                item.Start = start
                s.genes.push(item)
            }
		})
	})
}
function variantsLoaded(variants:Variant[],segs:Seg[]){
	segs.forEach((s,i)=>{
		var start = s.start
		var end = s.end
		variants.forEach((v,j)=>{
			if(v.Pos>=start&&v.Pos<=end){
				s.variants.push(v)
			}
		})
	})
}
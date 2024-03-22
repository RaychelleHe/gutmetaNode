declare type Base = {
    start:string
    end:string
}
declare type Gene = {
    Chr:string
    Start:number
    End:number
    Strand:string
    Name:string
    Description:string
    Sequence:string
}
declare type Variant = {
    Chr:string
    Pos:number
    Variants:string
    Type:string
    Description:string
}
declare type Seg = {
    name:string
    length:number
    start:number
    end:number
    source:string
    genes:Gene[]
    variants:Variant[]
}
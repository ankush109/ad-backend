class ApiFeatures{
    constructor(query,queryStr){
        // console.log("came1")
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        // console.log("came2")
        let keyword=this.queryStr.keyword;
        keyword=keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }
        :
        {}
        this.query=this.query.find({...keyword});
        return this;
    }


    filter(){
        const queryCopy={...this.queryStr};
        const removeFeilds=["keyword","page","Limit"];
        
        removeFeilds.forEach(key=>delete queryCopy[key])
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        queryStr=JSON.parse(queryStr)
        this.query=this.query.find(queryStr);
        return this;
    }


    pagination(resultPerPage){
        const curPage=Number(this.queryStr.page)||1;
        const sk=resultPerPage*(curPage-1);
        this.query=this.query.limit(resultPerPage).skip(sk);
        return this;
    }
}

module.exports=ApiFeatures
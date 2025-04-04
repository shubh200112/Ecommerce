class APIFeatures {
    constructor(query , queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex : this.queryStr.keyword,
                $options: 'i' // i means case insensitive
            }
        } : {}
        
        this.query = this.query.find({...keyword})
        return this
    }

    filter() {
        const queryCopy = {...this.queryStr}

        // console.log(queryCopy);

        //Remmoving fields from query 
        const removeFields = ['keyword','limit','page']
        removeFields.forEach((param) => delete queryCopy[param])

        // console.log(queryCopy);

        //Advance Filter for price and rating etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage-1)

        this.query = this.query.limit(resPerPage).skip(skip)

        return this
    }
    
}

module.exports = APIFeatures
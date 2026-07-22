
import mongoose from 'mongoose'

const tokenBlackListSchema=mongoose.Schema({

    token:
    {
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})


tokenBlackListSchema.index({
    createdAt:1
},{
    expireAfterSeconds: 60 * 60 * 24 * 3
})

const TokenBlackList=mongoose.model("TokenBlackList",tokenBlackListSchema)

export default TokenBlackList

import bcrypt from 'bcrypt'
import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
   name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      default: "Costumer",
    },
     email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    systemUser:
    {
      type:Boolean,
      default:false,
      immutable:true,
      select:false
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,//by defau;t password get nhi hoga uske liye.select(+"password krna pdega agr chahiye to")
      match: [
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    "Password must contain uppercase, lowercase, number and be at least 8 characters."
  ]
    },
})

userSchema.pre("save",async function hashPassword()
{
  if(!this.isModified("password"))
    return ;

  
this.password=await bcrypt.hash(this.password,10);

})

userSchema.methods.comparePassword =async function (password) {

    return bcrypt.compare(password,this.password)
}

export const User= mongoose.model("User",userSchema)
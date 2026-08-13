import mongoose, {Schema} from "mongoose";

export interface Iuser{
  name:string,
  email:string,
  password:string,
  refreshToken?:string | null,
  createdAt?:Date,
  updatedAt?:Date,
  // isVerified: boolean,
  // verificationToken: string | undefined,
  // verificationTokenExpires: Date | undefined,
  // passwordResetToken?: string | undefined;
  // passwordResetExpires?: Date | undefined;
  
}

export const UserModel = new Schema<Iuser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength:3,
    maxLength:50,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true
  },

  refreshToken: {
    type: String,
    default: null
  },

  // isVerified: {
  //   type: Boolean,
  //   default: false
  // },

  // verificationToken: {
  //   type: String, 
  //   default: null
  // },

  // verificationTokenExpires: {
  //   type: Date,
  //   default: null
  // },

  // passwordResetToken: {
  //   type: String,
  //   default: null,
  // },

  // passwordResetExpires: {
  //   type: Date,
  //   default: null,
  // },

},
  {
    timestamps: true
  }
)

export const authModel = mongoose.model("Users", UserModel);
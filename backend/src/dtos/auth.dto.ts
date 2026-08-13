export interface UserDto{
  name: string,
  email: string,
  password: string,
  // verificationToken: string,
  // verificationTokenExpires: Date
}

export interface UserDtoRespone {
  userId: string,
  name: string,
  email: string,
  // password: string,
  // verificationToken: string,
  // verificationTokenExpires: Date,
}

export interface LoginDtoResponse {
  userId: string,
  email: string,
  password: string,
  accessToken: string,
  refreshToken: string
}
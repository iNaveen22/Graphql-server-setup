import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

const JWT_SECRET = '$uperm@n@123'

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

class UserService {

    private static generateHash(salt: string, password: string){
        return createHmac("sha256", salt).update(password).digest("hex");
    }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);
    try {
      return await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          salt,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed.");
    }
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: {email}})
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const {email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if(!user) throw new Error('user not found');

    const userSalt = user.salt;
    const userHashedPassword = UserService.generateHash(userSalt, password);

    if(userHashedPassword !== user.password)
        throw new Error('Incorrect Password')

    //Gen token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

public static decodeJWTToken(token: string){
    return JWT.verify(token, JWT_SECRET);
}

}

export default UserService;

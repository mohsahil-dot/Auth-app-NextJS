import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody);

        //checking if user exists
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({error: "User does not exist"}, {status:400})
        }
        console.log("User exists");

        //checkinng if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword) {
            return NextResponse.json({error:"Invalid Password"}, {status:400})
        }
        console.log(user);

        //once everything verified then we create a token, by jsonwebtoken, we send this token in cookie not in storage, because in storage he can manipulate that. It helps as a bridger to verify a user whenever you want. But it can have a lot of payload.
        //createing a token data

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        //creating token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login Successful",
            success: true
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
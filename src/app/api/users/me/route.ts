import { connect } from "@/app/dbConfig/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest) {
    try {
        const userId = await getTokenData(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            message: "User Found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status:400});
    }
}
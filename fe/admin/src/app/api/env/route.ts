import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    PHONE_SHOP_SERVER_HOST: process.env.PHONE_SHOP_SERVER_HOST,
    IMAGE_SERVER_HOST: process.env.IMAGE_SERVER_HOST,
    ZALO_PAY_REDIRECT_URL: process.env.ZALO_PAY_REDIRECT_URL,
  });
}

import { NextRequest } from "next/server";

export function middleware(request: NextRequest){
    const isAuth = request.cookies.has('laravel_session');
    const path = request.nextUrl.pathname;

    //if(isAuth && (path))
}
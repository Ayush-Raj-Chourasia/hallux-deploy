import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });
    return NextResponse.json({
        method: 'POST',
        headers,
        body,
    });
}

export async function GET(request: Request) {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });
    return NextResponse.json({
        method: 'GET',
        headers,
        message: 'Demo endpoint',
    });
}

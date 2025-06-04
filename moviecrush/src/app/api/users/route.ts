import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/users.json');

export async function POST(req: Request) {
    const user = await req.json();

    const raw = await readFile(filePath, 'utf-8');
    const users = JSON.parse(raw);

    users.push(user);

    await writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
}

export async function GET() {
    const raw = await readFile(filePath, 'utf-8');
    const users = JSON.parse(raw);
    return NextResponse.json(users);
}

import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/users.json');

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const updatedData = await req.json();

    const raw = await readFile(filePath, 'utf-8');
    const users = JSON.parse(raw);

    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[index] = { ...users[index], ...updatedData };

    await writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
}

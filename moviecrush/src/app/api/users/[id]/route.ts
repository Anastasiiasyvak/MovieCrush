import { NextResponse } from 'next/server';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/users.json');

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const raw = await readFile(filePath, 'utf-8');
        const users = JSON.parse(raw);
        const user = users.find((u: any) => u.id === id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error reading user:', error);
        return NextResponse.json({ error: 'Failed to read user' }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const updateData = await req.json();

        const raw = await readFile(filePath, 'utf-8');
        const users = JSON.parse(raw);

        const userIndex = users.findIndex((user: any) => user.id === id);

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updateData
        };

        await writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

        return NextResponse.json({ success: true, user: users[userIndex] });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

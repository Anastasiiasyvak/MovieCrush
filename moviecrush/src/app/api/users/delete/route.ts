import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/users.json');

export async function DELETE(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const raw = await readFile(filePath, 'utf-8');
        const users = JSON.parse(raw);

        const userIndex = users.findIndex((user: any) => user.email === email);
        
        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        users.splice(userIndex, 1);

        await writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
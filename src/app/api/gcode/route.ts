import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Get the list of G-code files in the test folder
    const testGcodeDir = join(process.cwd(), 'public', 'test', 'gcode');
    const files = await readdir(testGcodeDir);
    const gcodeFiles = files.filter(file => file.endsWith('.gcode'));
    
    if (gcodeFiles.length === 0) {
      return NextResponse.json({ error: 'No G-code files found' }, { status: 404 });
    }
    
    // Randomly select one of the G-code files
    const randomFile = gcodeFiles[Math.floor(Math.random() * gcodeFiles.length)];
    const filePath = join(testGcodeDir, randomFile);
    
    // Read the selected file
    const content = await readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error loading random G-code file:', error);
    return NextResponse.json({ error: 'Failed to load G-code file' }, { status: 500 });
  }
} 
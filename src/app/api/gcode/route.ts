import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    //const filePath = path.join(process.cwd(), 'public', 'test', 'gcode', 'bambu_2.0.2.57_cube.gcode');
    //const filePath = path.join(process.cwd(), 'public', 'test', 'gcode', 'bambu_2.0.2.57_scraper.gcode');
    const filePath = path.join(process.cwd(), 'public', 'test', 'gcode', 'bambu_2.0.2.57_tower.gcode');
    //console.log('Reading G-code file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('G-code file not found at:', filePath);
      return new NextResponse('G-code file not found', { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    //console.log('Successfully read G-code file, length:', fileContent.length);
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error reading G-code file:', error);
    return new NextResponse('Error reading G-code file', { status: 500 });
  }
} 
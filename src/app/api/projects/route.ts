import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const projectsPath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    const data = fs.readFileSync(projectsPath, 'utf8');
    const projects = JSON.parse(data);
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, status } = await request.json();
    const data = fs.readFileSync(projectsPath, 'utf8');
    const projects = JSON.parse(data);
    
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      status,
      documents: []
    };
    
    projects.push(newProject);
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const data = fs.readFileSync(projectsPath, 'utf8');
    const projects = JSON.parse(data);
    
    const filteredProjects = projects.filter((p: { id: string }) => p.id !== id);
    fs.writeFileSync(projectsPath, JSON.stringify(filteredProjects, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const projectsPath = path.join(process.cwd(), 'src/data/projects.json');

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const documentId = searchParams.get('documentId');

    if (!projectId || !documentId) {
      return NextResponse.json({ error: 'Project ID and Document ID required' }, { status: 400 });
    }

    const data = fs.readFileSync(projectsPath, 'utf8');
    const projects = JSON.parse(data);
    
    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].documents = projects[projectIndex].documents.filter(
        (doc: any) => doc.id !== documentId
      );
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
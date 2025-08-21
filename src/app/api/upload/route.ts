import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const projectsPath = path.join(process.cwd(), 'src/data/projects.json');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const clientName = formData.get('clientName') as string;
    const programType = formData.get('programType') as string;
    const featureType = formData.get('featureType') as string;
    const projectId = formData.get('projectId') as string;
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Prepare data for external API
    const uploadFormData = new FormData();
    
    const clientInfo = {
      clientName,
      programType,
      featureType,
      uploadTime: new Date().toISOString(),
      matchScore: "89.1%"
    };
    
    const documentInfo = [{
      documentName: file.name,
      documentType: file.name.split('.').pop() || '',
      documentSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
    }];

    uploadFormData.append('clientInfo', JSON.stringify(clientInfo));
    uploadFormData.append('documentInfo', JSON.stringify(documentInfo));
    uploadFormData.append('files', file);

    // Call external API
    const response = await fetch('https://ziv9tm501c.execute-api.us-east-1.amazonaws.com/test/upload', {
      method: 'POST',
      headers: {
        'x-api-key': '1f3yK2q4wb76FH8LAnep77JvUMu3vwVy6MkWxzUH'
      },
      body: uploadFormData
    });

    const result = await response.json();
    console.log('Upload API Response:', result);

    if (response.ok) {
      // Update local project with document info
      const data = fs.readFileSync(projectsPath, 'utf8');
      const projects = JSON.parse(data);
      
      const projectIndex = projects.findIndex((p: { id: string }) => p.id === projectId);
      if (projectIndex !== -1) {
        const uploadId = result.uploadId || result.upload_id || Date.now().toString();
        const document = {
          id: uploadId,
          name: file.name,
          clientName,
          programType,
          featureType,
          uploadTime: new Date().toISOString(),
          size: documentInfo[0].documentSize
        };
        
        console.log('Storing document with ID:', uploadId);
        projects[projectIndex].documents.push(document);
        fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
      }

      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
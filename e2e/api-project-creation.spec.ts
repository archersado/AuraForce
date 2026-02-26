import { test, expect } from '@playwright/test';

test.describe('API Project Creation Test', () => {
  test('create project with Chinese name via API', async ({ request }) => {
    // Test creating a project with Chinese name
    const projectName = `测试-${Date.now()}`;

    // Create project via API
    const createResponse = await request.post('http://localhost:3005/api/workspaces', {
      data: {
        name: projectName,
        description: 'Test project with Chinese name',
      },
    });

    expect(createResponse.ok()).toBeTruthy();

    const createData = await createResponse.json();
    console.log('Create response:', JSON.stringify(createData, null, 2));

    // Verify project was created with correct name
    expect(createData.success).toBe(true);
    expect(createData.project.name).toBe(projectName);

    // Verify project path contains the Chinese name
    expect(createData.project.path).toContain(projectName);

    // Now test with workflow template
    const projectNameWithTemplate = `测试模板-${Date.now()}`;

    // Get available workflow templates
    const templatesResponse = await request.get('http://localhost:3005/api/workflows/templates?visibility=public');
    const templatesData = await templatesResponse.json();

    let workflowTemplateId = null;
    if (templatesData.templates && templatesData.templates.length > 0) {
      workflowTemplateId = templatesData.templates[0].id;
      console.log('Using template:', workflowTemplateId);

      const createWithTemplateResponse = await request.post('http://localhost:3005/api/workspaces', {
        data: {
          name: projectNameWithTemplate,
          description: 'Test with template',
          workflowTemplateId: workflowTemplateId,
        },
      });

      expect(createWithTemplateResponse.ok()).toBeTruthy();
      const createWithTemplateData = await createWithTemplateResponse.json();
      console.log('Create with template response:', JSON.stringify(createWithTemplateData, null, 2));

      expect(createWithTemplateData.success).toBe(true);
      expect(createWithTemplateData.project.name).toBe(projectNameWithTemplate);
      expect(createWithTemplateData.project.workflowTemplateId).toBe(workflowTemplateId);

      // Verify files were extracted by checking the project directory
      const filesListUrl = `http://localhost:3005/api/files/list?root=${encodeURIComponent(createWithTemplateData.project.path)}`;
      const filesResponse = await request.get(filesListUrl);
      expect(filesResponse.ok()).toBeTruthy();

      const filesData = await filesResponse.json();
      console.log('Files in project with template:', JSON.stringify(filesData, null, 2));

      console.log('Extracted files count:', filesData.files.length);
    } else {
      console.log('No public workflow templates found for testing');
    }

    console.log('API Test completed successfully!');
  });

  test('verify file system path is correct', async ({ request }) => {
    // Test that project path is constructed correctly
    const projectName = '测试路径';

    const createResponse = await request.post('http://localhost:3005/api/workspaces', {
      data: {
        name: projectName,
        description: 'Test path verification',
      },
    });

    expect(createResponse.ok()).toBeTruthy();

    const data = await createResponse.json();
    console.log('Project path:', data.project.path);

    // Verify path contains the project name
    expect(data.project.path).toContain(projectName);

    // Verify we can list files in the project directory
    const filesListUrl = `http://localhost:3005/api/files/list?root=${encodeURIComponent(data.project.path)}`;
    const filesResponse = await request.get(filesListUrl);
    expect(filesResponse.ok()).toBeTruthy();

    const filesData = await filesResponse.json();
    console.log('Files in project:', filesData.files);
  });
});

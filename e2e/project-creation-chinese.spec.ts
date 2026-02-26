import { test, expect } from '@playwright/test';

test.describe('Project Creation Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to workspace create page
    await page.goto('http://localhost:3005/workspace/new');
  });

  test('create project with Chinese name and workflow template', async ({ page, request }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Select a workflow template
    const workflowCard = page.locator('.workflow-card').first();
    if (await workflowCard.count() > 0) {
      await workflowCard.click();
    }

    // Enter project name with Chinese characters
    const projectName = `测试项目-${Date.now()}`;
    await page.fill('input[placeholder="输入项目名称"]', projectName);

    // Click create button
    await page.click('button:has-text("确认创建")');

    // Wait for navigation
    await page.waitForURL(/\/project\//, { timeout: 10000 });

    // Get project ID from URL
    const url = page.url();
    const match = url.match(/\/project\/([^/]+)/);
    expect(match).toBeTruthy();
    const projectId = match![1];

    console.log('Created project ID:', projectId);

    // Verify project was created via API
    const projectResponse = await request.get(`http://localhost:3005/api/workspaces/${projectId}`);
    expect(projectResponse.ok()).toBeTruthy();

    const projectData = await projectResponse.json();
    console.log('Project data:', JSON.stringify(projectData, null, 2));

    // Verify project name in response
    expect(projectData.project.name).toBe(projectName.replace(/[\\/:*?"<>|]/g, '_'));

    // Verify project path contains the project name
    expect(projectData.project.path).toContain(projectName);

    // Verify directory exists (via files list API)
    const filesListUrl = `http://localhost:3005/api/files/list?root=${encodeURIComponent(projectData.project.path)}`;
    const filesResponse = await request.get(filesListUrl);
    expect(filesResponse.ok()).toBeTruthy();

    const filesData = await filesResponse.json();
    console.log('Files in project:', JSON.stringify(filesData, null, 2));

    // Verify workflow template files were extracted if template was selected
    if (projectData.project.workflowTemplateId) {
      console.log('Workflow template ID:', projectData.project.workflowTemplateId);
      // Check if any files were extracted
      expect(filesData.files.length).toBeGreaterThan(0);
    }

    console.log('Test completed successfully!');
  });
});

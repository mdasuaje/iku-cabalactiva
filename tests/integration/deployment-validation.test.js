import { describe, it, expect } from 'vitest'

describe('Deployment Validation', () => {
  it('should have all required test files', () => {
    const fs = require('fs')
    const path = require('path')
    
    const requiredFiles = [
      'playwright.config.js',
      'tests/e2e/critical-flow.spec.js',
      'tests/e2e/visual-regression.spec.js',
      'tests/performance/lighthouse.spec.js',
      'tests/health/js-errors.spec.js',
      'lighthouserc.json',
      'scripts/validate-deploy.js'
    ]
    
    requiredFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      expect(fs.existsSync(filePath), `File ${file} should exist`).toBe(true)
    })
  })

  it('should have GitHub Actions workflow', () => {
    const fs = require('fs')
    const path = require('path')
    
    const workflowPath = path.join(process.cwd(), '.github/workflows/post-deploy-testing.yml')
    expect(fs.existsSync(workflowPath)).toBe(true)
  })

  it('should have proper package.json scripts', () => {
    const packageJson = require('../../package.json')
    
    expect(packageJson.scripts['test:e2e']).toBeDefined()
    expect(packageJson.scripts['test:validate']).toBeDefined()
    expect(packageJson.devDependencies['@playwright/test']).toBeDefined()
  })
})
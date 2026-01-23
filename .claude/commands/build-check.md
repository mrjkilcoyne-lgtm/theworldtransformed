---
description: Run build and thoroughly check for errors
---

# Build Check Workflow

Run a comprehensive build check and report any issues:

## Steps

1. **Clean check**: Verify working directory is clean
   ```bash
   git status
   ```

2. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

3. **Run the build**:
   ```bash
   npm run build
   ```

4. **Check for errors**:
   - TypeScript errors
   - Build warnings
   - Missing dependencies
   - Broken links or references

5. **Test the preview**:
   ```bash
   npm run preview
   ```

6. **Report findings**:
   - ✅ Build successful
   - ⚠️ Warnings found (list them)
   - ❌ Errors found (list and suggest fixes)

7. **Suggest fixes** for any issues found

Run all checks and provide a summary of the build health.

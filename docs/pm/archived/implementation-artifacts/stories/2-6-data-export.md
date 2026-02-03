# Story 2.6: User Profile Data Export

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable users to export their profile data, ensuring data portability and compliance with data privacy regulations like GDPR.

---

## Story

**As a logged-in user**, I want to export my account data, so that I can keep a copy of my information or transfer it to another service.

---

## Acceptance Criteria

1. Data export section in profile settings
2. Support multiple export formats (JSON, CSV)
3. Export API endpoint (`GET /api/user/export`)
4. Include all user profile data
5. Include user skills and conversations
6. Data is zipped for download
7. Rate limiting for export requests
8. Include export timestamp
9. Proper headers for file download
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Data Export UI (AC: 1, 2)
- [ ] Create `src/components/profile/data-export-form.tsx`
- [ ] Add format selection (JSON, CSV, ZIP with both)
- [ ] Add export button
- [ ] Add loading state
- [ ] Add download status display

### Task 2: Create Export API Endpoint (AC: 3, 4, 5, 9)
- [ ] Create `src/app/api/user/export/route.ts`
- [ ] Get current session
- [ ] Fetch user profile data
- [ ] Fetch user skills
- [ ] Fetch user conversations
- [ ] Format data according to requested format
- [ ] Set proper content-disposition headers

### Task 3: Create Data Formatter Utility (AC: 4, 5)
- [ ] Create `src/lib/data-export/formatter.ts`
- [ ] Implement JSON format exporter
- [ ] Implement CSV format exporter
- [ ] Implement ZIP package creator
- [ ] Include metadata (export date, user info)

### Task 4: Add Data Export Helper Functions
- [ ] Create `src/lib/data-export/helpers.ts`
- [ ] Function to aggregate user data
- [ ] Function to sanitize sensitive data
- [ ] Function to format timestamps
- [ ] Function to generate export metadata

### Task 5: Update Profile Settings Page (AC: 1)
- [ ] Add data export section to profile settings
- [ ] Add tab or section for data export
- [ ] Integrate with existing forms

### Task 6: Implement Rate Limiting (AC: 7)
- [ ] Rate limit export requests (max 1 per hour)
- [ ] Store export history
- [ ] Return retry-after header

### Task 7: Add Privacy and Security Features
- [ ] Log all data export events
- [ ] Sanitize sensitive fields (passwords, tokens)
- [ ] Include export metadata for audit
- [ ] Support data deletion

### Task 8: Add Data Models for Export Tracking (Optional)
- [ ] Create ExportRequest model
- [ ] Track export history
- [ ] Support scheduled exports
- [ ] Store export expiration

### Task 9: Create Export History UI (Optional)
- [ ] Show previous exports
- [ ] Allow re-downloading recent exports
- [ ] Delete export history entries
- [ ] Display export dates

### Task 10: Run Type Check (AC: 10)
- [ ] Run `npx tsc --noEmit` to verify TypeScript
- [ ] Fix any type errors
- [ ] All imports use `@/*` alias
- [ ] Ensure strict mode compliance

---

## Dev Notes

### Architectural Constraints & Requirements

**File Organization:**
```
src/
├── app/
│   ├── (protected)/profile/
│   │   └── settings/
│   │       └── page.tsx (update with export section)
│   └── api/
│       └── user/
│           └── export/
│               └── route.ts
├── components/
│   └── profile/
│       └── data-export-form.tsx
└── lib/
    └── data-export/
        ├── formatter.ts
        └── helpers.ts
```

### Export Data Structure

**JSON Format:**
```typescript
{
  "exportVersion": "1.0",
  "exportDate": "2026-01-05T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "name": "Full Name",
    "email": "email@example.com",
    "emailVerified": "2026-01-01T00:00:00.000Z",
    "image": "avatar-url",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-05T00:00:00.000Z"
  },
  "skills": [
    {
      "id": "uuid",
      "title": "Skill Title",
      "description": "Skill description",
      "content": "Skill content",
      "tags": ["tag1", "tag2"],
      "category": "category",
      "difficulty": "beginner",
      "isPublic": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "conversations": [
    {
      "id": "uuid",
      "title": "Conversation Title",
      "sessionId": "session-id",
      "messages": [...],
      "status": "completed",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "settings": {
    "theme": "system",
    "language": "zh-CN",
    "notifications": {...}
  }
}
```

**CSV Format:**
```csv
type,id,title,description,tags,category,difficulty,createdAt,user
Skill,uuid,Skill Title,Skill Description,"tag1,tag2",category,beginner,2026-01-01,user@email.com
```

### API Endpoint

**GET /api/user/export?format=json|csv|zip**

```typescript
// Query Parameters
format?: 'json' | 'csv' | 'zip' // Default: zip

// Response JSON (before file download)
{
  success: true,
  message: string,
  dataUrl: string // Pre-signed URL or data
}

// File Response
Content-Type: application/json (JSON)
Content-Type: text/csv (CSV)
Content-Type: application/zip (ZIP)
Content-Disposition: attachment; filename="auraforce-export-2026-01-05.json"
```

### Data Export Utility

**Formatter Interface:**
```typescript
interface ExportData {
  user: UserData;
  skills: SkillData[];
  conversations: ConversationData[];
  settings: UserSettings;
  metadata: ExportMetadata;
}

interface ExportMetadata {
  version: string;
  exportDate: string;
  userId: string;
  userEmail: string;
}
```

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { getSession } from '@/lib/auth/session'
import { formatExportData } from '@/lib/data-export/formatter'

// INCORRECT
import { getSession } from '../../../lib/auth/session'
```

### Rate Limiting

**Export Rate Limits:**
- Max exports per user: 1 per hour
- Max concurrent exports: 1 per user
- Export file retention: 24 hours (if using S3/CDN)

### Error Handling

**Error Codes:**
- `RATE_LIMITED` - Too many export requests
- `NO_DATA` - User has no data to export
- `FORMAT_ERROR` - Invalid format requested
- `EXPORT_FAILED` - Export processing failed

### Security Best Practices

1. **Sanitization:** Remove sensitive fields (passwords, tokens, API keys)
2. **Authentication:** Always require valid session
3. **Logging:** Log all export events for audit
4. **Rate Limiting:** Prevent export abuse
5. **Data Removal:** Support account data deletion
6. **Encryption:** Consider encrypting exports with user key

### Testing Standards

**Manual Testing Required:**
- Export data in JSON format
- Export data in CSV format
- Export data in ZIP format
- Test with user who has no data
- Test rate limiting
- Verify sensitive data is excluded
- Test file download headers
- Check export timestamp accuracy

### Data Privacy Compliance

- **GDPR:** Support "right to data portability"
- **CCPA:** Support data deletion
- **Logs:** Keep export logs for audit
- **Retention:** Define data retention policies

---

## Technical References

### Source: `_bmad-output/prisma/schema.prisma`
- User model (lines 14-35)
- Skill model (lines 75-95)
- ClaudeConversation model (lines 97-114)
- UserSettings model (lines 136-152)

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 290-291)
- Data export requirements

---

## Success Criteria Checklist

- [ ] Data export section created
- [ ] JSON format export working
- [ ] CSV format export working
- [ ] ZIP format export working
- [ ] Export API endpoint working
- [ ] All user data included
- [ ] Sensitive data excluded
- [ ] Rate limiting implemented
- [ ] Download headers correct
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅

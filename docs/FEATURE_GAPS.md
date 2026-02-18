# Smartsheet MCP Feature Gaps

This document tracks missing functionality in the Smartsheet MCP compared to the full [Smartsheet API](https://smartsheet.redoc.ly/).

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ | Implemented |
| 🔧 | Implemented in fork only |
| ❌ | Not implemented |

## Current Coverage

### Sheets
| Feature | Status | Tools |
|---------|--------|-------|
| Get sheet by ID | ✅ | `get_sheet` |
| Get sheet by URL | ✅ | `get_sheet_by_url` |
| Search sheets | ✅ | `search_sheets` |
| Create sheet | ✅ | `create_sheet` |
| Copy sheet | ✅ | `copy_sheet` |
| Add rows | ✅ | `add_rows` |
| Update rows | ✅ | `update_rows` |
| Delete rows | ✅ | `delete_rows` (requires `ALLOW_DELETE_TOOLS=true`) |
| Get row | ✅ | `get_row` |
| Get cell history | ✅ | `get_cell_history` |

### Reports
| Feature | Status | Tools |
|---------|--------|-------|
| Search reports | ✅ | `search_reports` |
| Get report by ID | 🔧 | `get_report` |
| Get report by URL | 🔧 | `get_report_by_url` |

### Workspaces & Folders
| Feature | Status | Tools |
|---------|--------|-------|
| List workspaces | ✅ | `get_workspaces` |
| Get workspace | ✅ | `get_workspace` |
| Get folder | ✅ | `get_folder` |
| Search folders | ✅ | `search_folders` |
| Create folder | ✅ | `create_folder`, `create_workspace_folder` |

### Users
| Feature | Status | Tools |
|---------|--------|-------|
| Get current user | ✅ | `get_current_user` |
| Get user by ID | ✅ | `get_user` |
| List users | ✅ | `list_users` |

### Discussions
| Feature | Status | Tools |
|---------|--------|-------|
| Get sheet discussions | ✅ | `get_discussions_by_sheet_id` |
| Get row discussions | ✅ | `get_discussions_by_row_id` |
| Create sheet discussion | ✅ | `create_sheet_discussion` |
| Create row discussion | ✅ | `create_row_discussion` |

---

## Feature Gaps (Prioritized)

### Priority 1: High Value / Common Use Cases

#### 1. Dashboards (Sights)
**Gap:** Can search dashboards but cannot read their contents.

**API Endpoints:**
- `GET /sights/{sightId}` - Get dashboard
- `GET /sights` - List all dashboards

**Value:** Dashboards aggregate data from multiple sheets. Reading them provides executive summaries without querying individual sheets.

**Effort:** Low (similar pattern to reports)

---

#### 2. Attachments
**Gap:** No attachment support at all.

**API Endpoints:**
- `GET /sheets/{sheetId}/attachments` - List attachments
- `GET /sheets/{sheetId}/attachments/{attachmentId}` - Get attachment metadata
- `POST /sheets/{sheetId}/attachments` - Upload attachment
- `GET /sheets/{sheetId}/rows/{rowId}/attachments` - Row-level attachments
- `DELETE /sheets/{sheetId}/attachments/{attachmentId}` - Delete attachment

**Value:** Many workflows involve documents attached to rows (contracts, screenshots, specs). Currently no way to access or add them.

**Effort:** Medium (file handling adds complexity)

---

### Priority 2: Collaboration & Governance

#### 3. Sharing & Permissions
**Gap:** Cannot view or manage who has access to sheets/workspaces.

**API Endpoints:**
- `GET /sheets/{sheetId}/shares` - List shares
- `POST /sheets/{sheetId}/shares` - Share with user/group
- `DELETE /sheets/{sheetId}/shares/{shareId}` - Remove access
- `GET /workspaces/{workspaceId}/shares` - Workspace sharing

**Value:** Useful for auditing access, onboarding team members, or automating permission management.

**Effort:** Low

---

#### 4. Comments on Rows
**Gap:** Discussions exist but direct comment threading may be limited.

**API Endpoints:**
- `POST /sheets/{sheetId}/rows/{rowId}/discussions` - Add comment to row
- `GET /sheets/{sheetId}/discussions/{discussionId}/comments` - Get comment thread

**Value:** Row-level collaboration is core to Smartsheet workflows.

**Effort:** Low (builds on existing discussion tools)

---

### Priority 3: Advanced Features

#### 5. Templates
**Gap:** Cannot create sheets from templates.

**API Endpoints:**
- `GET /templates` - List templates
- `POST /sheets` with `fromId` - Create from template

**Value:** Standardized project creation, especially for repeatable workflows.

**Effort:** Low

---

#### 6. Cross-Sheet References
**Gap:** Cannot manage cell links between sheets.

**API Endpoints:**
- `GET /sheets/{sheetId}/crosssheetreferences` - List references
- `POST /sheets/{sheetId}/crosssheetreferences` - Create reference

**Value:** Power users link data across sheets. Managing these programmatically enables complex automations.

**Effort:** Medium

---

#### 7. Automation / Workflows
**Gap:** Cannot view or trigger automations.

**API Endpoints:**
- `GET /sheets/{sheetId}/automationrules` - List rules
- `PUT /sheets/{sheetId}/automationrules/{ruleId}` - Enable/disable

**Value:** Visibility into what automations exist; ability to toggle them.

**Effort:** Medium

---

#### 8. Webhooks
**Gap:** Cannot create or manage webhooks for real-time updates.

**API Endpoints:**
- `POST /webhooks` - Create webhook
- `GET /webhooks` - List webhooks
- `DELETE /webhooks/{webhookId}` - Delete webhook

**Value:** Enables event-driven integrations without polling.

**Effort:** Medium (requires callback handling)

---

## Summary Table

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Reports | P1 | Low | 🔧 Done (fork) |
| Dashboards | P1 | Low | ❌ |
| Attachments | P1 | Medium | ❌ |
| Sharing | P2 | Low | ❌ |
| Row Comments | P2 | Low | ❌ |
| Templates | P3 | Low | ❌ |
| Cross-Sheet Refs | P3 | Medium | ❌ |
| Automations | P3 | Medium | ❌ |
| Webhooks | P3 | Medium | ❌ |

---

## Contributing

To add a feature:

1. Add API method in `src/apis/smartsheet-*-api.ts`
2. Add tool in `src/tools/smartsheet-*-tools.ts`
3. Register in `src/index.ts`
4. Run `npm run build`
5. Test with your MCP client

See existing implementations for patterns.

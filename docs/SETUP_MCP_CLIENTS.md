# Smartsheet MCP Setup Guide

This guide walks you through setting up the Smartsheet MCP server with MCP-compatible AI coding assistants.

## Supported Clients

| Client | Config Location |
|--------|-----------------|
| Cortex Code | `~/.snowflake/cortex/mcp.json` |
| Cursor | `~/.cursor/mcp.json` |
| Claude Desktop | `~/.claude/claude_desktop_config.json` |

The MCP configuration format is identical across all clients.

## Prerequisites

- Node.js (v18+)
- An MCP-compatible AI coding assistant
- A Smartsheet account with API access

## Step 1: Clone the Repository

Clone from the fork (includes report tools not in upstream):

```bash
git clone git@github.com:sfc-gh-kenman/smar-mcp.git
```

Or from upstream (missing `get_report` / `get_report_by_url` tools):

```bash
git clone git@github.com:smartsheet-platform/smar-mcp.git
```

## Step 2: Install Dependencies and Build

```bash
cd smar-mcp
npm install
npm run build
```

## Step 3: Get Your Smartsheet API Token

1. Log into [Smartsheet](https://app.smartsheet.com)
2. Go to **Account** → **Personal Settings** → **API Access**
3. Click **Generate new access token**
4. Copy the token (it's a ~37 character string)

This is a **Bearer token** used in the `Authorization` header.

## Step 4: Configure the MCP Server

Open your client's MCP configuration file and add the following entry to the `mcpServers` object:

```json
"smartsheet": {
  "type": "stdio",
  "command": "/opt/homebrew/bin/node",
  "args": [
    "/path/to/smar-mcp/build/index.js"
  ],
  "env": {
    "SMARTSHEET_API_KEY": "YOUR_API_TOKEN_HERE",
    "SMARTSHEET_ENDPOINT": "https://api.smartsheet.com/2.0"
  }
}
```

**Configuration notes:**

| Setting | Value | Notes |
|---------|-------|-------|
| `command` | Full path to `node` | Use `which node` to find yours |
| `args` | Full path to `build/index.js` | Must be absolute path |
| `SMARTSHEET_API_KEY` | Your API token | ~37 characters |
| `SMARTSHEET_ENDPOINT` | `https://api.smartsheet.com/2.0` | US endpoint; EU uses `api.smartsheet.eu` |

### Finding Your Node Path

```bash
which node
```

Common locations:
- macOS (Homebrew ARM): `/opt/homebrew/bin/node`
- macOS (Homebrew Intel): `/usr/local/bin/node`
- Linux: `/usr/bin/node`

## Step 5: Restart Your Client

Restart your AI coding assistant for the MCP to load.

## Step 6: Verify the Connection

Most clients have a way to check MCP status:
- **Cortex Code**: `/mcp`
- **Cursor**: Check MCP panel
- **Claude Desktop**: Check MCP status in settings

Test with a simple command like `get_current_user` - this should return your Smartsheet user info.

## Troubleshooting

### Error: "Connection closed"

Usually means a missing or invalid environment variable.

**Check 1:** Both env vars are set
- `SMARTSHEET_API_KEY` - your token
- `SMARTSHEET_ENDPOINT` - the API URL

**Check 2:** Test manually
```bash
SMARTSHEET_API_KEY="your-token" \
SMARTSHEET_ENDPOINT="https://api.smartsheet.com/2.0" \
node /path/to/smar-mcp/build/index.js
```

### Error: "ENOENT... node"

The path to node is wrong.

**Fix:** Find the correct path with `which node` and update the `command` field.

### Config Structure Wrong

The `command` and `args` must be separate:

**Wrong:**
```json
"command": "node /path/to/index.js"
```

**Right:**
```json
"command": "/opt/homebrew/bin/node",
"args": ["/path/to/index.js"]
```

## Available Tools

Once connected, you'll have access to:

| Tool | Description |
|------|-------------|
| `get_current_user` | Get your Smartsheet user info |
| `get_sheet` | Get a sheet by ID |
| `get_sheet_by_url` | Get a sheet by URL |
| `get_report` | Get a report by ID (fork only) |
| `get_report_by_url` | Get a report by URL (fork only) |
| `search_sheets` | Search sheets by name |
| `search_reports` | Search reports by name |
| `get_workspaces` | List workspaces |
| `add_rows` | Add rows to a sheet |
| `update_rows` | Update existing rows |

## Optional: Enable Delete Operations

By default, delete operations are disabled. To enable:

```json
"env": {
  "SMARTSHEET_API_KEY": "...",
  "SMARTSHEET_ENDPOINT": "...",
  "ALLOW_DELETE_TOOLS": "true"
}
```

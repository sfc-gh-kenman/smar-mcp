import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getDashboardTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_dashboard",
        "Retrieves a dashboard (sight) by ID, including all widgets and their source sheet references",
        {
            dashboardId: z.string().describe("The ID of the dashboard to retrieve"),
            level: z.string().optional().describe("Detail level: 0 (basic), 1 (include widget contents), 2 (multi-level)"),
        },
        async ({ dashboardId, level }) => {
            try {
                console.info(`Getting dashboard with ID: ${dashboardId}`);
                const dashboard = await api.dashboards.getDashboard(dashboardId, level);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(dashboard, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get dashboard ${dashboardId}: ${error.message}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get dashboard: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "get_dashboard_by_url",
        "Retrieves a dashboard (sight) by URL, including all widgets and their source sheet references. Resolves URL tokens by searching through accessible dashboards.",
        {
            url: z.string().describe("The URL of the dashboard to retrieve"),
            level: z.string().optional().describe("Detail level: 0 (basic), 1 (include widget contents), 2 (multi-level)"),
        },
        async ({ url, level }) => {
            try {
                console.info(`Getting dashboard with URL: ${url}`);
                // Dashboard URLs look like: https://app.smartsheet.com/dashboards/xxx or /b/home?sightId=xxx
                let dashboardId: string | null = null;
                
                // Try sightId=xxx pattern (this is a numeric ID)
                const sightIdMatch = url.match(/[?&]sightId=(\d+)/);
                if (sightIdMatch) {
                    dashboardId = sightIdMatch[1];
                }
                
                // Try /dashboards/xxx pattern - only if purely numeric (not a token starting with digits)
                if (!dashboardId) {
                    const dashboardMatch = url.match(/\/dashboards\/(\d+)(?:[?\/]|$)/);
                    if (dashboardMatch) {
                        dashboardId = dashboardMatch[1];
                    }
                }
                
                // If we found a token instead of numeric ID, search by permalink
                if (!dashboardId) {
                    const tokenMatch = url.match(/\/dashboards\/([^?\/]+)/);
                    if (tokenMatch) {
                        console.info(`URL contains token, searching for matching dashboard (this may take a moment)...`);
                        const match = await api.dashboards.findByPermalink(url);
                        if (match) {
                            dashboardId = String(match.id);
                            console.info(`Found dashboard: ${match.name} (ID: ${dashboardId})`);
                        } else {
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: `Dashboard not found. The URL token couldn't be matched to any accessible dashboard. Verify you have access to this dashboard.`
                                    }
                                ],
                                isError: true
                            };
                        }
                    }
                }
                
                if (!dashboardId) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Failed to get dashboard: Invalid URL format. Expected /dashboards/{id} or ?sightId={id}`
                            }
                        ],
                        isError: true
                    };
                }
                
                const dashboard = await api.dashboards.getDashboard(dashboardId, level);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(dashboard, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get dashboard ${url}: ${error.message}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get dashboard: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "list_dashboards",
        "Lists all dashboards (sights) accessible to the current user",
        {
            includeAll: z.boolean().optional().describe("Whether to include all results"),
            pageSize: z.number().optional().describe("Number of dashboards to return per page"),
            page: z.number().optional().describe("Page number to return"),
        },
        async ({ includeAll, pageSize, page }) => {
            try {
                console.info(`Listing dashboards`);
                const dashboards = await api.dashboards.listDashboards(includeAll, pageSize, page);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(dashboards, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to list dashboards: ${error.message}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to list dashboards: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

}

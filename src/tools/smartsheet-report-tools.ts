import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SmartsheetAPI } from "../apis/smartsheet-api.js";
import { z } from "zod";

export function getReportTools(server: McpServer, api: SmartsheetAPI) {

    server.tool(
        "get_report",
        "Retrieves a report by ID, including source sheets, columns, and row data",
        {
            reportId: z.string().describe("The ID of the report to retrieve"),
            pageSize: z.number().optional().describe("Number of rows to return per page"),
            page: z.number().optional().describe("Page number to return"),
        },
        async ({ reportId, pageSize, page }) => {
            try {
                console.info(`Getting report with ID: ${reportId}`);
                const report = await api.reports.getReport(reportId, pageSize, page);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(report, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get report ${reportId}: ${error.message}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get report: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    server.tool(
        "get_report_by_url",
        "Retrieves a report by URL, including source sheets, columns, and row data",
        {
            url: z.string().describe("The URL of the report to retrieve"),
            pageSize: z.number().optional().describe("Number of rows to return per page"),
            page: z.number().optional().describe("Page number to return"),
        },
        async ({ url, pageSize, page }) => {
            try {
                console.info(`Getting report with URL: ${url}`);
                const match = url.match(/\/reports\/([^?\/]+)/);
                const directIdToken = match ? match[1] : null;
                if (!directIdToken) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Failed to get report: Invalid URL format`
                            }
                        ],
                        isError: true
                    };
                }
                // Use the token directly - Smartsheet API accepts both numeric IDs and URL tokens
                const report = await api.reports.getReport(directIdToken, pageSize, page);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(report, null, 2)
                        }
                    ]
                };
            } catch (error: any) {
                console.error(`Failed to get report ${url}: ${error.message}`, { error });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to get report: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

}

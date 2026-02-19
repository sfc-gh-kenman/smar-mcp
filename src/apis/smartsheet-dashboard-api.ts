import { SmartsheetAPI } from "./smartsheet-api.js";

/**
 * Dashboard (Sight) specific API methods for Smartsheet
 */
export class SmartsheetDashboardAPI {
  private api: SmartsheetAPI;

  constructor(api: SmartsheetAPI) {
    this.api = api;
  }

  /**
   * Gets a dashboard (sight) by ID
   * @param dashboardId Dashboard ID
   * @param level Detail level (optional)
   * @returns Dashboard data including widgets
   */
  async getDashboard(dashboardId: string, level?: string): Promise<any> {
    return this.api.request('GET', `/sights/${dashboardId}`, undefined, { level });
  }

  /**
   * Lists all dashboards (sights) accessible to the user
   * @param includeAll Include all results
   * @param pageSize Number of items per page
   * @param page Page number
   * @returns List of dashboards
   */
  async listDashboards(includeAll?: boolean, pageSize?: number, page?: number): Promise<any> {
    return this.api.request('GET', '/sights', undefined, { includeAll, pageSize, page });
  }

  /**
   * Finds a dashboard by its permalink URL token
   * Paginates through all dashboards until a match is found
   * @param permalink The full permalink URL or just the token
   * @returns Dashboard metadata if found, null otherwise
   */
  async findByPermalink(permalink: string): Promise<any | null> {
    let page = 1;
    const pageSize = 500; // Max supported by Smartsheet API
    
    while (true) {
      const response = await this.api.request<any>('GET', '/sights', undefined, { pageSize, page });
      
      // Check if the URL/permalink contains the dashboard's token, or exact match
      const match = response.data?.find((d: any) => 
        d.permalink && (d.permalink === permalink || permalink.includes(d.permalink))
      );
      
      if (match) {
        return match;
      }
      
      // Check if we've exhausted all pages
      if (page >= response.totalPages) {
        return null;
      }
      
      page++;
    }
  }
}

import { SmartsheetAPI } from "./smartsheet-api.js";

/**
 * Report-specific API methods for Smartsheet
 */
export class SmartsheetReportAPI {
  private api: SmartsheetAPI;

  constructor(api: SmartsheetAPI) {
    this.api = api;
  }

  /**
   * Gets a report by ID
   * @param reportId Report ID
   * @param pageSize Number of rows per page
   * @param page Page number
   * @returns Report data including source sheets and rows
   */
  async getReport(reportId: string, pageSize?: number, page?: number): Promise<any> {
    return this.api.request('GET', `/reports/${reportId}`, undefined, { pageSize, page });
  }
}

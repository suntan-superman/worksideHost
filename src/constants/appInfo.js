/**
 * Application Information Constants
 * 
 * Centralized location for app-wide constants like copyright year,
 * company name, and other branding information.
 * 
 * UPDATE THIS FILE ANNUALLY or when company info changes.
 * 
 * @module constants/appInfo
 */

export const APP_INFO = {
  // Company Information
  COMPANY_NAME: 'Workside Software',
  COMPANY_NAME_FULL: 'Workside Software LLC',
  COMPANY_WEBSITE: 'WorksideSoftware.com',
  
  // Copyright Information
  COPYRIGHT_YEAR: 2026,
  
  // Computed copyright strings for common use cases
  get COPYRIGHT_SHORT() {
    return `© ${this.COPYRIGHT_YEAR} ${this.COMPANY_NAME}`;
  },
  get COPYRIGHT_FULL() {
    return `© ${this.COPYRIGHT_YEAR} ${this.COMPANY_NAME_FULL}. All rights reserved.`;
  },
  get COPYRIGHT_SIMPLE() {
    return `Copyright ${this.COPYRIGHT_YEAR}`;
  },
  get COPYRIGHT_WITH_COMPANY() {
    return `Copyright ${this.COMPANY_NAME} ${this.COPYRIGHT_YEAR}`;
  },
  
  // App Names
  APP_NAME_HOST: 'Workside Host',
  APP_NAME_CLIENT: 'Workside Client',
  APP_NAME_SUPPLIER: 'Workside Supplier',
};

// Individual exports for convenience
export const COPYRIGHT_YEAR = APP_INFO.COPYRIGHT_YEAR;
export const COMPANY_NAME = APP_INFO.COMPANY_NAME;
export const COMPANY_NAME_FULL = APP_INFO.COMPANY_NAME_FULL;

export default APP_INFO;

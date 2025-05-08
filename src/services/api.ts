
// Main API service file that re-exports everything from individual files

// Export config
export * from './config';

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export auth services
export * from './authService';

// Export favorites services
export * from './favoritesService';

// Export history services
export * from './historyService';

// Export downloads services
export * from './downloadsService';

// Create a default export with all functions
import * as config from './config';
import * as utils from './utils';
import * as auth from './authService';
import * as favorites from './favoritesService';
import * as history from './historyService';
import * as downloads from './downloadsService';

// Export all as default for backwards compatibility
export default {
  ...utils,
  ...auth,
  ...favorites,
  ...history,
  ...downloads,
  fetchData: utils.fetchData,
  convertTMDBToMovie: utils.convertTMDBToMovie,
};

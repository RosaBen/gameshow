/**
 * API Module - Handles all API calls to RAWG
 */

const key = process.env.API_KEY;
const apiUrl = "https://api.rawg.io/api/";
const keyParam = "?key=";

const apiDatasParams = [
  "games",
  "creators",
  "developers",
  "genres",
  "platforms",
  "publishers",
  "tags"
];

/**
 * Create API URLs for different endpoints
 * @returns {Object} Object containing all API URLs
 */
export const createUrls = () => {
  return apiDatasParams.reduce((acc, param) => {
    acc[param] = `${apiUrl}${param}${keyParam}${key}`;
    return acc;
  }, {});
};

/**
 * Fetch games with optional search and platform filters
 * @param {Object} urls - API URLs object
 * @param {number} page - Page number
 * @param {number} pageSize - Number of games per page
 * @param {string} searchTerm - Search query
 * @param {string} platformFilter - Platform filter
 * @returns {Object} Games data with results and next page info
 */
export const getGames = async (urls, page = 1, pageSize = 9, searchTerm = '', platformFilter = 'Default') => {
  try {
    let gamesUrl = `${urls.games}&page_size=${pageSize}&page=${page}`;

    if (searchTerm && searchTerm.trim() !== '') {
      gamesUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    if (platformFilter && platformFilter !== 'Default') {
      // Get platform ID for the filter
      const platformsResponse = await fetch(urls.platforms);
      const platformsData = await platformsResponse.json();
      const platform = platformsData.results.find(p =>
        p.name.toLowerCase().trim() === platformFilter.toLowerCase()
      );
      if (platform) {
        gamesUrl += `&platforms=${platform.id}`;
      }
    }

    const response = await fetch(gamesUrl);
    const data = await response.json();

    return {
      results: data.results,
      next: data.next
    };
  } catch (error) {
    console.error('Error fetching data for games:', error);
    return {
      results: [],
      next: null
    };
  }
};

/**
 * Get games by specific filter (genre, tag, platform)
 * @param {Object} urls - API URLs object
 * @param {string} filterType - Type of filter (genres, tags, platforms)
 * @param {number} filterId - ID of the filter
 * @param {number} page - Page number
 * @param {number} pageSize - Number of games per page
 * @returns {Object} Filtered games data
 */
/**
 * Get games filtered by specific criteria
 * @param {Object} urls - API URLs object
 * @param {string} filterType - Type of filter (genres, tags, platforms, developers)
 * @param {number|string} filterId - ID or name of the filter
 * @param {number} page - Page number
 * @param {number} pageSize - Number of games per page
 * @returns {Object} Filtered games data
 */
export const getGamesByFilter = async (urls, filterType, filterId, page = 1, pageSize = 12) => {
  try {
    let gamesUrl = `${urls.games}&page_size=${pageSize}&page=${page}`;

    if (filterType === 'genres') {
      gamesUrl += `&genres=${filterId}`;
    } else if (filterType === 'tags') {
      gamesUrl += `&tags=${filterId}`;
    } else if (filterType === 'platforms') {
      gamesUrl += `&platforms=${filterId}`;
    } else if (filterType === 'developers') {
      // For developers, we can search by name if it's a string
      if (isNaN(filterId)) {
        // First, try to find the developer ID by name
        const developersResponse = await fetch(urls.developers);
        const developersData = await developersResponse.json();
        const developer = developersData.results.find(dev =>
          dev.name.toLowerCase() === filterId.toLowerCase()
        );
        if (developer) {
          gamesUrl += `&developers=${developer.id}`;
        } else {
          // If developer not found, try searching by name in games
          gamesUrl += `&search=${encodeURIComponent(filterId)}`;
        }
      } else {
        gamesUrl += `&developers=${filterId}`;
      }
    }

    const response = await fetch(gamesUrl);
    const data = await response.json();

    return {
      results: data.results,
      next: data.next
    };
  } catch (error) {
    console.error('Error fetching filtered games:', error);
    return {
      results: [],
      next: null
    };
  }
};

/**
 * Get all platforms
 * @param {Object} urls - API URLs object
 * @returns {Array} Array of platform names
 */
export const getPlatforms = async (urls) => {
  try {
    const response = await fetch(urls.platforms);
    const data = await response.json();
    return data.results.map(platform => platform.name.toLowerCase().trim());
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return [];
  }
};

/**
 * Get developers for a specific game
 * @param {Object} urls - API URLs object
 * @param {number} gameId - Game ID
 * @returns {Array} Array of developer names
 */
export const getDevelopers = async (urls, gameId) => {
  try {
    let gameDetailsUrl = `${apiUrl}games/${gameId}${keyParam}${key}`;
    const response = await fetch(gameDetailsUrl);
    const data = await response.json();
    const developers = data.developers ? data.developers.map(developer => developer.name) : [];
    return developers;
  } catch (error) {
    console.error('Error fetching developers for game:', gameId, error);
    return [];
  }
};

/**
 * Get detailed game data by slug
 * @param {string} slug - Game slug
 * @returns {Object} Game details
 */
export const getGameBySlug = async (slug) => {
  try {
    const gameDetailsUrl = `${apiUrl}games/${slug}${keyParam}${key}`;
    const response = await fetch(gameDetailsUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game by slug:', slug, error);
    return null;
  }
};

/**
 * Add developers data to games array
 * @param {Array} games - Array of games
 * @param {Object} urls - API URLs object
 * @returns {Array} Games with developers data
 */
export const addDevelopersToGames = async (games, urls) => {
  try {
    const gamesWithDevelopers = await Promise.all(
      games.map(async (game) => {
        const developers = await getDevelopers(urls, game.id);
        return { ...game, developers };
      })
    );
    return gamesWithDevelopers;
  } catch (error) {
    console.error('Error adding developers to games:', error);
    return games;
  }
};

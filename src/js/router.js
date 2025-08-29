/**
 * Router Module - Handles SPA navigation
 */

/**
 * Router object for Single Page Application navigation
 */
export const router = {
  navigate: (path) => {
    window.history.pushState(null, null, path);
    handleRoute();
  },

  back: () => {
    window.history.back();
  }
};

/**
 * Handle route changes based on current path
 */
export const handleRoute = () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  if (path === '/' || path === '/index.html' || path === '') {
    if (window.showHomepage) {
      window.showHomepage();
    }
  } else if (path.startsWith('/game/')) {
    const slug = path.split('/game/')[1];
    if (window.showGameDetail) {
      window.showGameDetail(slug);
    }
  } else if (path.startsWith('/results/')) {
    const filterType = searchParams.get('type'); // genres, tags, platforms
    const filterId = searchParams.get('id');
    const filterName = searchParams.get('name');
    if (window.showResultsPage) {
      window.showResultsPage(filterType, filterId, filterName);
    }
  }
};

/**
 * Initialize router event listeners
 */
export const initRouter = () => {
  // Listen for popstate events (back/forward buttons)
  window.addEventListener('popstate', handleRoute);

  // Handle initial route
  handleRoute();
};

/**
 * Main Application File - Modular SPA for Game Search
 */

// Import styles
import './style/index.scss';

// Import modules
import {
  createUrls,
  getGames,
  getPlatforms,
  addDevelopersToGames,
  getGameBySlug,
  getGamesByFilter
} from './js/api.js';
import { router, handleRoute, initRouter } from './js/router.js';
import { createGameCard, createResultCard, initializeCardObserver } from './js/components.js';

/**
 * Global State Management
 */
let currentGames = [];
let currentPage = 1;
let hasNextPage = false;
let currentPlatform = 'Default';
let currentSearchTerm = '';
let isLoading = false;

// Global elements
let header, main, footer;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get main DOM elements
  header = document.querySelector('header');
  main = document.querySelector('main');
  footer = document.querySelector('footer');

  // Initialize router
  initRouter();
});

/**
 * Create the main HTML structure
 */
const htmlBody = () => {
  // Clear existing content
  document.body.innerHTML = '';

  // Create header
  header = document.createElement('header');

  // Navigation
  const nav = document.createElement('nav');
  const navDiv1 = document.createElement('div');
  navDiv1.classList.add('homeTitle');
  const navLink1 = document.createElement('a');
  navLink1.href = '/';
  navLink1.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });
  const navH1 = document.createElement('h1');
  navH1.textContent = 'The Hyper Programme';

  const navDiv2 = document.createElement('div');
  navDiv2.classList.add('search-container');
  const navLinkFa = document.createElement('a');
  navLinkFa.href = '#';
  navLinkFa.classList.add('search-btn');
  const navIcon = document.createElement('i');
  navIcon.classList.add('fas', 'fa-search');
  const navSearchInput = document.createElement('input');
  navSearchInput.type = 'text';
  navSearchInput.name = 'search';
  navSearchInput.classList.add('search-input');
  navSearchInput.placeholder = 'Search games...';

  // Search functionality
  let searchTimeout;
  navSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearchTerm = e.target.value;
      currentPlatform = 'Default'; // Reset platform filter when searching
      showHomepage();
    }, 500); // Debounce search
  });

  navLinkFa.addEventListener('click', (e) => {
    e.preventDefault();
    currentSearchTerm = navSearchInput.value;
    currentPlatform = 'Default'; // Reset platform filter when searching
    showHomepage();
  });

  navLinkFa.appendChild(navIcon);
  navLink1.appendChild(navH1);
  navDiv1.appendChild(navLink1);
  navDiv2.appendChild(navLinkFa);
  navDiv2.appendChild(navSearchInput);
  nav.appendChild(navDiv1);
  nav.appendChild(navDiv2);
  header.appendChild(nav);

  // Header description
  const divHomeHeader = document.createElement('div');
  divHomeHeader.classList.add('home-header');
  const homeHeaderH2 = document.createElement('h2');
  homeHeaderH2.textContent = 'Welcome,';
  const homeHeaderP = document.createElement('p');
  homeHeaderP.textContent = 'The Hyper Programme is the world\'s premier event for computer and video games. Discover the best games, connect with the gaming community, and explore never-before-seen products.';

  divHomeHeader.appendChild(homeHeaderH2);
  divHomeHeader.appendChild(homeHeaderP);
  header.appendChild(divHomeHeader);

  // Main content
  main = document.createElement('main');

  // Footer
  footer = document.createElement('footer');
  const divFooter = document.createElement('div');
  const pFooter = document.createElement('p');
  divFooter.classList.add('footer-border');
  pFooter.textContent = 'Rosa @ 2025 - Fictional website for exercise';
  footer.appendChild(divFooter);
  footer.appendChild(pFooter);

  // Append to body
  document.body.appendChild(header);
  document.body.appendChild(main);
  document.body.appendChild(footer);
};

/**
 * Show homepage with games
 * @param {boolean} loadMore - Whether to load more games or start fresh
 */
export const showHomepage = async (loadMore = false) => {
  if (isLoading) return;
  isLoading = true;

  try {
    const urls = createUrls();

    if (!loadMore) {
      // Reset state for new homepage load
      currentPage = 1;
      currentGames = [];
      main.innerHTML = '';
      htmlBody();

      // Initialize card observer
      initializeCardObserver();
    }

    const { results: games, next } = await getGames(urls, currentPage, 9, currentSearchTerm, currentPlatform);
    const gamesWithDevelopers = await addDevelopersToGames(games, urls);

    if (loadMore) {
      currentGames = [...currentGames, ...gamesWithDevelopers];
    } else {
      currentGames = gamesWithDevelopers;
    }

    hasNextPage = !!next;

    if (!loadMore) {
      // Platforms Filter
      const divFilterHome = document.createElement('div');
      divFilterHome.classList.add('home-selection');
      const homePlatformH2 = document.createElement('h2');
      homePlatformH2.textContent = 'Platforms: ';
      const homePlatformFilter = document.createElement('select');
      homePlatformFilter.name = 'home-platforms';
      homePlatformFilter.id = 'home-platforms';

      const defaultOption = document.createElement('option');
      defaultOption.value = 'Default';
      defaultOption.textContent = 'Any';
      homePlatformFilter.appendChild(defaultOption);

      const platformNames = await getPlatforms(urls);
      platformNames.forEach((platformName) => {
        const option = document.createElement('option');
        option.value = platformName.toLowerCase();
        option.textContent = platformName.length <= 3 ?
          platformName.toUpperCase() :
          platformName.charAt(0).toUpperCase() + platformName.slice(1);
        homePlatformFilter.appendChild(option);
      });

      homePlatformFilter.value = currentPlatform;
      homePlatformFilter.addEventListener('change', (event) => {
        currentPlatform = event.target.value;
        showHomepage();
      });

      divFilterHome.appendChild(homePlatformH2);
      divFilterHome.appendChild(homePlatformFilter);
      main.appendChild(divFilterHome);
    }

    // Section for cards
    let homeSection = document.querySelector('section');
    let divCardsContainer = document.querySelector('.cards-container');

    if (!homeSection) {
      homeSection = document.createElement('section');
      divCardsContainer = document.createElement('div');
      divCardsContainer.classList.add('cards-container');
      homeSection.appendChild(divCardsContainer);
      main.appendChild(homeSection);
    }

    const filteredGames = currentPlatform === 'Default'
      ? currentGames
      : currentGames.filter(game => game.platforms.some(platform =>
        platform.platform.name.toLowerCase() === currentPlatform));

    if (!loadMore) {
      divCardsContainer.innerHTML = '';

      // Show no results message if needed
      if (filteredGames.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.classList.add('no-results');
        noResultsMessage.innerHTML = `
          <h3>No games found</h3>
          <p>Try adjusting your search or filter criteria</p>
        `;
        divCardsContainer.appendChild(noResultsMessage);
        return;
      }
    }

    // Display filtered games
    const gamesToDisplay = loadMore ? filteredGames.slice(-gamesWithDevelopers.length) : filteredGames;

    for (const game of gamesToDisplay) {
      if (currentPlatform !== 'Default' &&
        !game.platforms.some(platform => platform.platform.name.toLowerCase() === currentPlatform)) {
        continue;
      }

      createGameCard(game, divCardsContainer);
    }

    // Update pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
      existingPagination.remove();
    }

    if (hasNextPage) {
      const paginationDiv = document.createElement('div');
      paginationDiv.classList.add('pagination');
      const loadMoreButton = document.createElement('button');
      loadMoreButton.textContent = 'Load More Games';
      loadMoreButton.classList.add('load-more-btn');
      loadMoreButton.addEventListener('click', () => {
        currentPage++;
        showHomepage(true);
      });
      paginationDiv.appendChild(loadMoreButton);
      main.appendChild(paginationDiv);
    }
  } catch (error) {
    console.error('Error in showHomepage:', error);
  } finally {
    isLoading = false;
  }
};

/**
 * Show game detail page
 * @param {string} slug - Game slug
 */
export const showGameDetail = async (slug) => {
  try {
    const gameData = await getGameBySlug(slug);
    if (!gameData) {
      main.innerHTML = '<p>Game not found</p>';
      return;
    }

    // Clear content
    header.innerHTML = '';
    main.innerHTML = '';

    // Simple nav for detail page
    const detailNav = document.createElement('div');
    detailNav.classList.add('detail-nav');
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to Games';
    backBtn.classList.add('back-btn');
    backBtn.addEventListener('click', () => {
      router.back();
    });
    detailNav.appendChild(backBtn);

    // Detail content
    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail-page');

    const detailContent = document.createElement('div');
    detailContent.classList.add('detail-content');

    // Header section
    const detailHeader = document.createElement('div');
    detailHeader.classList.add('detail-header');

    const detailImage = document.createElement('div');
    detailImage.classList.add('detail-image');
    const img = document.createElement('img');
    img.src = gameData.background_image;
    img.alt = gameData.name;
    detailImage.appendChild(img);

    const detailInfo = document.createElement('div');
    detailInfo.classList.add('detail-info');
    const title = document.createElement('h1');
    title.textContent = gameData.name;

    const metaDiv = document.createElement('div');
    metaDiv.classList.add('detail-meta');

    // Released date
    const releasedMeta = document.createElement('div');
    releasedMeta.classList.add('meta-item');
    releasedMeta.innerHTML = `<h4>Released</h4><p>${gameData.released || 'TBD'}</p>`;

    // Rating
    const ratingMeta = document.createElement('div');
    ratingMeta.classList.add('meta-item');
    ratingMeta.innerHTML = `<h4>Rating</h4><p>${gameData.rating ? gameData.rating.toFixed(1) : 'N/A'} / 5</p>`;

    // Platforms
    const platformsMeta = document.createElement('div');
    platformsMeta.classList.add('meta-item');
    const platformsList = gameData.platforms ?
      gameData.platforms.map(p => p.platform.name).join(', ') :
      'Not specified';
    platformsMeta.innerHTML = `<h4>Platforms</h4><p>${platformsList}</p>`;

    metaDiv.appendChild(releasedMeta);
    metaDiv.appendChild(ratingMeta);
    metaDiv.appendChild(platformsMeta);

    detailInfo.appendChild(title);
    detailInfo.appendChild(metaDiv);

    detailHeader.appendChild(detailImage);
    detailHeader.appendChild(detailInfo);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('detail-description');
    const descTitle = document.createElement('h3');
    descTitle.textContent = 'Description';
    const descText = document.createElement('p');
    descText.textContent = gameData.description_raw || 'No description available.';
    descriptionDiv.appendChild(descTitle);
    descriptionDiv.appendChild(descText);

    // Tags section with clickable tags
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('detail-tags');
    if (gameData.tags && gameData.tags.length > 0) {
      const tagsTitle = document.createElement('h3');
      tagsTitle.textContent = 'Tags';
      tagsTitle.style.width = '100%';
      tagsTitle.style.marginBottom = '1rem';
      tagsDiv.appendChild(tagsTitle);

      gameData.tags.forEach(tag => {
        const tagItem = document.createElement('span');
        tagItem.classList.add('tag-item');
        tagItem.textContent = tag.name;
        tagItem.addEventListener('click', () => {
          router.navigate(`/results/?type=tags&id=${tag.id}&name=${tag.name}`);
        });
        tagsDiv.appendChild(tagItem);
      });
    }

    detailContent.appendChild(detailHeader);
    detailContent.appendChild(descriptionDiv);
    detailContent.appendChild(tagsDiv);
    detailDiv.appendChild(detailContent);

    main.appendChild(detailNav);
    main.appendChild(detailDiv);

  } catch (error) {
    console.error('Error in showGameDetail:', error);
    main.innerHTML = '<p>Error loading game details</p>';
  }
};

/**
 * Show results page for filtered games
 * @param {string} filterType - Type of filter (genres, tags, platforms)
 * @param {number} filterId - ID of the filter
 * @param {string} filterName - Name of the filter
 */
export const showResultsPage = async (filterType, filterId, filterName) => {
  try {
    // Clear content and initialize
    header.innerHTML = '';
    main.innerHTML = '';
    htmlBody();

    // Initialize card observer
    initializeCardObserver();

    // Create header for results page
    const resultsHeader = document.createElement('div');
    resultsHeader.classList.add('results-header');
    const title = document.createElement('h1');
    title.textContent = `Games: ${filterName}`;
    const subtitle = document.createElement('p');
    subtitle.textContent = `Showing all games in ${filterType.slice(0, -1)}: ${filterName}`;
    resultsHeader.appendChild(title);
    resultsHeader.appendChild(subtitle);

    // Navigation buttons
    const navButtons = document.createElement('div');
    navButtons.classList.add('navigation-buttons');

    const backToHomeBtn = document.createElement('button');
    backToHomeBtn.classList.add('nav-btn');
    backToHomeBtn.textContent = '← Back to Home';
    backToHomeBtn.addEventListener('click', () => {
      router.navigate('/');
    });

    const backToGameBtn = document.createElement('button');
    backToGameBtn.classList.add('nav-btn');
    backToGameBtn.textContent = '← Back to Game';
    backToGameBtn.addEventListener('click', () => {
      router.back();
    });

    navButtons.appendChild(backToHomeBtn);
    navButtons.appendChild(backToGameBtn);

    main.appendChild(resultsHeader);
    main.appendChild(navButtons);

    // Get filtered games
    const urls = createUrls();
    const { results: games } = await getGamesByFilter(urls, filterType, filterId, 1, 12);
    const gamesWithDevelopers = await addDevelopersToGames(games, urls);

    // Create cards container
    const section = document.createElement('section');
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');

    if (gamesWithDevelopers.length === 0) {
      const noResultsMessage = document.createElement('div');
      noResultsMessage.classList.add('no-results');
      noResultsMessage.innerHTML = `
        <h3>No games found</h3>
        <p>No games found for this ${filterType.slice(0, -1)}</p>
      `;
      cardsContainer.appendChild(noResultsMessage);
    } else {
      // Create result cards with full game info
      gamesWithDevelopers.forEach(game => {
        createResultCard(game, cardsContainer);
      });
    }

    section.appendChild(cardsContainer);
    main.appendChild(section);

  } catch (error) {
    console.error('Error in showResultsPage:', error);
    main.innerHTML = '<p>Error loading results</p>';
  }
};

// Export functions for router
window.showHomepage = showHomepage;
window.showGameDetail = showGameDetail;
window.showResultsPage = showResultsPage;

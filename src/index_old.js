import './style/index.scss';

document.addEventListener('DOMContentLoaded', () => {

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

  // State management for SPA
  let currentGames = [];
  let currentPage = 1;
  let hasNextPage = false;
  let currentPlatform = 'Default';
  let currentSearchTerm = '';
  let isLoading = false;

  // Router for SPA navigation
  const router = {
    navigate: (path) => {
      window.history.pushState(null, null, path);
      handleRoute();
    },

    back: () => {
      window.history.back();
    }
  };

  // Handle route changes
  const handleRoute = () => {
    const path = window.location.pathname;

    if (path === '/' || path === '/index.html' || path === '') {
      showHomepage();
    } else if (path.startsWith('/game/')) {
      const slug = path.split('/game/')[1];
      showGameDetail(slug);
    }
  };

  // Listen for popstate events (back/forward buttons)
  window.addEventListener('popstate', handleRoute);

  // created urls for each params for future filters
  const createUrls = () => {
    return apiDatasParams.reduce((acc, param) => {
      acc[param] = `${apiUrl}${param}${keyParam}${key}`;
      return acc;
    }, {});
  }

  // get all games
  const getGames = async (urls, page = 1, pageSize = 9, searchTerm = '', platformFilter = 'Default') => {
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
      }
    } catch (error) {
      console.error('Error fetching data for games:', error);
      return {
        results: [], next: null
      };
    }
  }

  // get all platforms
  const getPlatforms = async (urls) => {
    try {
      const response = await fetch(urls.platforms);
      const data = await response.json();
      return data.results.map(platform => platform.name.toLowerCase().trim());
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return [];
    }
  };

  // get developers for a specific game using game details endpoint
  const getDevelopers = async (urls, gameId) => {
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

  // Get game details by slug
  const getGameBySlug = async (slug) => {
    try {
      const gameUrl = `${apiUrl}games/${slug}${keyParam}${key}`;
      const response = await fetch(gameUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
  };

  // Helper function to add developers to games
  const addDevelopersToGames = async (games, urls) => {
    return await Promise.all(games.map(async (game) => {
      const developers = await getDevelopers(urls, game.id);
      return {
        ...game,
        developers: developers
      };
    }));
  };

  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  // Create body of html to share per pages
  const htmlBody = () => {
    // Clear previous content
    header.innerHTML = '';
    footer.innerHTML = '';

    // navbar--------------------------------------
    const nav = document.createElement('nav');
    const navDiv1 = document.createElement('div');
    navDiv1.classList.add('homeTitle');
    const navLink1 = document.createElement('a');
    navLink1.href = '#';
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

    //  Header---------------------------------------------------------
    const divHomeHeader = document.createElement('div');
    divHomeHeader.classList.add('home-header');
    const homeHeaderH2 = document.createElement('h2');
    homeHeaderH2.textContent = 'Welcome,';
    const homeHeaderP = document.createElement('p');
    homeHeaderP.textContent = 'The Hyper Programme is the world\'s premier event for computer and video games and related products. At The Hyper Programme, the video game industry\'s top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry.';

    divHomeHeader.appendChild(homeHeaderH2);
    divHomeHeader.appendChild(homeHeaderP);
    header.appendChild(divHomeHeader);

    const divAnimatedBorder = document.createElement('div');
    divAnimatedBorder.classList.add('animated-border');
    header.appendChild(divAnimatedBorder);

    // Footer-----------------------------------------
    const divFooter = document.createElement('div');
    const pFooter = document.createElement('p');
    divFooter.classList.add('footer-border');
    pFooter.textContent = 'Rosa @ 2025 - Fictional website for exercise';
    footer.appendChild(divFooter);
    footer.appendChild(pFooter);
  }

  // Intersection Observer for card animations
  let cardObserver;

  const initializeCardObserver = () => {
    if (cardObserver) {
      cardObserver.disconnect();
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a slight delay based on the card position for staggered effect
          setTimeout(() => {
            entry.target.classList.add('card-visible');
            entry.target.classList.remove('card-hidden');
          }, index * 100);
        } else {
          entry.target.classList.add('card-hidden');
          entry.target.classList.remove('card-visible');
        }
      });
    }, observerOptions);
  };

  // Show homepage
  const showHomepage = async (loadMore = false) => {
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
          option.textContent = platformName.length <= 3 ? platformName.toUpperCase() : platformName.charAt(0).toUpperCase() + platformName.slice(1);
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
        : currentGames.filter(game => game.platforms.some(platform => platform.platform.name.toLowerCase() === currentPlatform));

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

      if (filteredGames.length === 0 && !loadMore) {
        const noGamesMessage = document.createElement('p');
        noGamesMessage.textContent = 'No games available for the selected platform.';
        noGamesMessage.classList.add('no-games-message');
        main.appendChild(noGamesMessage);
        return;
      }

      const gamesToDisplay = loadMore ? gamesWithDevelopers : filteredGames;

      for (const game of gamesToDisplay) {
        if (currentPlatform !== 'Default' && !game.platforms.some(platform => platform.platform.name.toLowerCase() === currentPlatform)) {
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

  // Create a game card
  const createGameCard = (game, container) => {
    const divCardHome = document.createElement('div');
    divCardHome.classList.add('home-card', 'card-hidden'); // Start hidden

    // Front card
    const cardFront = document.createElement('div');
    cardFront.classList.add('front-card');
    const frontImgDiv = document.createElement('div');
    frontImgDiv.classList.add('front-div-img');
    const cardPoster = document.createElement('img');
    cardPoster.src = game.background_image;
    cardPoster.alt = game.name;
    cardPoster.classList.add('home-poster');

    const frontdetailsDiv = document.createElement('div');
    frontdetailsDiv.classList.add('front-details');
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = game.name;

    const cardPlatforms = document.createElement('div');
    cardPlatforms.classList.add('home-platforms-container');
    const platformsList = document.createElement('ul');
    game.platforms.slice(0, 3).forEach(platform => {
      const li = document.createElement('li');
      li.classList.add('fr-platform-item');
      li.textContent = platform.platform.name.length > 8 ? platform.platform.name.substring(0, 8) + '...' : platform.platform.name;
      platformsList.appendChild(li);
    });

    // Back card
    const cardBack = document.createElement('div');
    cardBack.classList.add('back-card');

    const divBackTop = document.createElement('div');
    divBackTop.classList.add('back-card-top');
    const pReleased = document.createElement('p');
    pReleased.classList.add('back-released');
    pReleased.textContent = `Released: ${game.released || 'TBD'}`;

    const divDevelopers = document.createElement('div');
    divDevelopers.classList.add('back-developers');
    const developersContainer = document.createElement('div');
    developersContainer.classList.add('developers-buttons');

    if (game.developers && game.developers.length > 0) {
      game.developers.slice(0, 3).forEach(developer => {
        const devButton = document.createElement('button');
        devButton.classList.add('developer-btn');
        devButton.textContent = developer.length > 12 ? developer.substring(0, 12) + '...' : developer;
        developersContainer.appendChild(devButton);
      });
    } else {
      const devButton = document.createElement('button');
      devButton.classList.add('developer-btn');
      devButton.textContent = 'Unknown';
      developersContainer.appendChild(devButton);
    }

    divDevelopers.appendChild(developersContainer);
    divBackTop.appendChild(pReleased);
    divBackTop.appendChild(divDevelopers);

    const divBackMiddle = document.createElement('div');
    divBackMiddle.classList.add('back-card-middle');
    const ratingCircle = document.createElement('div');
    ratingCircle.classList.add('rating-circle');
    const rating = game.rating || 0;
    if (rating >= 4) {
      ratingCircle.classList.add('rating-high');
    } else if (rating >= 2.5) {
      ratingCircle.classList.add('rating-medium');
    } else {
      ratingCircle.classList.add('rating-low');
    }
    ratingCircle.textContent = rating.toFixed(1);

    const pCount = document.createElement('p');
    pCount.classList.add('votes-count');
    pCount.textContent = `${game.ratings_count || '0'} votes`;

    divBackMiddle.appendChild(ratingCircle);
    divBackMiddle.appendChild(pCount);

    const divBackGenres = document.createElement('div');
    divBackGenres.classList.add('home-genres-container');
    const genresList = document.createElement('ul');
    if (game.genres && game.genres.length > 0) {
      game.genres.slice(0, 4).forEach(genre => {
        const li = document.createElement('li');
        li.classList.add('bc-genre-item');
        li.textContent = genre.name.length > 10 ? genre.name.substring(0, 10) + '...' : genre.name;
        genresList.appendChild(li);
      });
    }

    divBackGenres.appendChild(genresList);

    const readMoreBtn = document.createElement('button');
    readMoreBtn.classList.add('read-more-btn');
    readMoreBtn.textContent = 'Read More';
    readMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      router.navigate(`/game/${game.slug}`);
    });

    cardBack.appendChild(divBackTop);
    cardBack.appendChild(divBackMiddle);
    cardBack.appendChild(divBackGenres);
    cardBack.appendChild(readMoreBtn);

    cardPlatforms.appendChild(platformsList);
    frontdetailsDiv.appendChild(cardTitle);
    frontdetailsDiv.appendChild(cardPlatforms);

    frontImgDiv.appendChild(cardPoster);
    frontImgDiv.appendChild(frontdetailsDiv);
    cardFront.appendChild(frontImgDiv);

    divCardHome.appendChild(cardFront);
    divCardHome.appendChild(cardBack);
    container.appendChild(divCardHome);

    // Add card to observer
    if (cardObserver) {
      cardObserver.observe(divCardHome);
    }
  };

  // Show game detail page
  const showGameDetail = async (slug) => {
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
      const nav = document.createElement('nav');
      nav.classList.add('detail-nav');
      const backButton = document.createElement('button');
      backButton.textContent = '← Back to Homepage';
      backButton.classList.add('back-btn');
      backButton.addEventListener('click', () => {
        router.navigate('/');
      });
      nav.appendChild(backButton);
      header.appendChild(nav);

      // Detail content
      const detailContainer = document.createElement('div');
      detailContainer.classList.add('detail-container');

      const detailHero = document.createElement('div');
      detailHero.classList.add('detail-hero');

      const heroImage = document.createElement('img');
      heroImage.src = gameData.background_image;
      heroImage.alt = gameData.name;
      heroImage.classList.add('detail-hero-image');

      const heroContent = document.createElement('div');
      heroContent.classList.add('detail-hero-content');

      const title = document.createElement('h1');
      title.textContent = gameData.name;
      title.classList.add('detail-title');

      const releaseDate = document.createElement('p');
      releaseDate.textContent = `Released: ${gameData.released || 'TBD'}`;
      releaseDate.classList.add('detail-release');

      const ratingSection = document.createElement('div');
      ratingSection.classList.add('detail-rating-section');

      const ratingCircle = document.createElement('div');
      ratingCircle.classList.add('detail-rating-circle');
      const rating = gameData.rating || 0;
      if (rating >= 4) {
        ratingCircle.classList.add('rating-high');
      } else if (rating >= 2.5) {
        ratingCircle.classList.add('rating-medium');
      } else {
        ratingCircle.classList.add('rating-low');
      }
      ratingCircle.textContent = rating.toFixed(1);

      const ratingInfo = document.createElement('div');
      ratingInfo.classList.add('detail-rating-info');
      const ratingText = document.createElement('p');
      ratingText.textContent = `${gameData.ratings_count || 0} votes`;
      ratingInfo.appendChild(ratingText);

      ratingSection.appendChild(ratingCircle);
      ratingSection.appendChild(ratingInfo);

      heroContent.appendChild(title);
      heroContent.appendChild(releaseDate);
      heroContent.appendChild(ratingSection);

      detailHero.appendChild(heroImage);
      detailHero.appendChild(heroContent);

      // Detail info sections
      const detailInfo = document.createElement('div');
      detailInfo.classList.add('detail-info');

      // Description
      if (gameData.description_raw) {
        const descSection = document.createElement('section');
        descSection.classList.add('detail-section');
        const descTitle = document.createElement('h2');
        descTitle.textContent = 'Description';
        const descText = document.createElement('p');
        descText.textContent = gameData.description_raw.substring(0, 500) + (gameData.description_raw.length > 500 ? '...' : '');
        descText.classList.add('detail-description');
        descSection.appendChild(descTitle);
        descSection.appendChild(descText);
        detailInfo.appendChild(descSection);
      }

      // Platforms
      if (gameData.platforms && gameData.platforms.length > 0) {
        const platformsSection = document.createElement('section');
        platformsSection.classList.add('detail-section');
        const platformsTitle = document.createElement('h2');
        platformsTitle.textContent = 'Platforms';
        const platformsList = document.createElement('div');
        platformsList.classList.add('detail-platforms-list');
        gameData.platforms.forEach(platform => {
          const platformItem = document.createElement('span');
          platformItem.classList.add('detail-platform-item');
          platformItem.textContent = platform.platform.name;
          platformsList.appendChild(platformItem);
        });
        platformsSection.appendChild(platformsTitle);
        platformsSection.appendChild(platformsList);
        detailInfo.appendChild(platformsSection);
      }

      // Developers
      if (gameData.developers && gameData.developers.length > 0) {
        const devsSection = document.createElement('section');
        devsSection.classList.add('detail-section');
        const devsTitle = document.createElement('h2');
        devsTitle.textContent = 'Developers';
        const devsList = document.createElement('div');
        devsList.classList.add('detail-developers-list');
        gameData.developers.forEach(dev => {
          const devItem = document.createElement('span');
          devItem.classList.add('detail-developer-item');
          devItem.textContent = dev.name;
          devsList.appendChild(devItem);
        });
        devsSection.appendChild(devsTitle);
        devsSection.appendChild(devsList);
        detailInfo.appendChild(devsSection);
      }

      // Genres
      if (gameData.genres && gameData.genres.length > 0) {
        const genresSection = document.createElement('section');
        genresSection.classList.add('detail-section');
        const genresTitle = document.createElement('h2');
        genresTitle.textContent = 'Genres';
        const genresList = document.createElement('div');
        genresList.classList.add('detail-genres-list');
        gameData.genres.forEach(genre => {
          const genreItem = document.createElement('span');
          genreItem.classList.add('detail-genre-item');
          genreItem.textContent = genre.name;
          genresList.appendChild(genreItem);
        });
        genresSection.appendChild(genresTitle);
        genresSection.appendChild(genresList);
        detailInfo.appendChild(genresSection);
      }

      detailContainer.appendChild(detailHero);
      detailContainer.appendChild(detailInfo);
      main.appendChild(detailContainer);

    } catch (error) {
      console.error('Error showing game detail:', error);
      main.innerHTML = '<p>Error loading game details</p>';
    }
  };

  // Initialize the app
  const initApp = () => {
    handleRoute();
  };

  initApp();
});

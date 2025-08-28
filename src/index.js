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

  // created urls foor each params for futur filters
  const createUrls = () => {
    return apiDatasParams.reduce((acc, param) => {
      acc[param] = `${apiUrl}${param}${keyParam}${key}`;
      return acc;
    }, {});

  }

  // get allgames
  const getGames = async (urls, page = 1, pageSize = 9) => {
    try {
      let gamesUrl = `${urls.games}&page_size=${pageSize}&page=${page}`;
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
      // Use the game details endpoint to get developers
      let gameDetailsUrl = `${apiUrl}games/${gameId}${keyParam}${key}`;
      console.log('Fetching developers for game:', gameId, 'URL:', gameDetailsUrl);
      const response = await fetch(gameDetailsUrl);
      const data = await response.json();

      // Return the developers from the game details
      const developers = data.developers ? data.developers.map(developer => developer.name) : [];
      console.log('Developers found for game', gameId, ':', developers);
      return developers;
    } catch (error) {
      console.error('Error fetching developers for game:', gameId, error);
      return [];
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
  // console.log('get games', getGames());
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  // get params from api
  const getParamsGames = async () => {
    const urls = createUrls();
    const { results } = await getGames(urls);

    const games = results.map(result => ({
      slug: result.slug,
      title: result.name,
      released: result.released,
      poster: result.background_image,
      genres: result.genres,
      platforms: result.platforms,
      rating: result.rating,
      votes: result.ratings_count,
      editor: '',
      gameId: result.id,
      developers: [] // Initialize developers array
    }));

    // Fetch developers for each game
    await Promise.all(games.map(async (game) => {
      const developers = await getDevelopers(urls, game.gameId);
      game.developers = developers;
    }));

    return games; // Return the games with developers
  }

  // Create body of html to share per pages
  const htmlBody = () => {

    // navbar--------------------------------------
    const nav = document.createElement('nav');
    const navDiv1 = document.createElement('div');
    navDiv1.classList.add('homeTitle');
    const navLink1 = document.createElement('a');
    navLink1.href = '#homepage';
    const navH1 = document.createElement('h1');
    navH1.textContent = 'The Hyper Progamme';
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
    navSearchInput.classList.add('search-input')

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
    homeHeaderP.textContent = 'The Hyper Progame is the world\'s premier event for computer and video games and related products. At The Hyper Progame, the video game industry\'s top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry.';

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
    pFooter.textContent = 'Rosa @ 2025 - Fictionnal website for exercice';
    footer.appendChild(divFooter);
    footer.appendChild(pFooter);
    return {
      nav, navDiv1, navDiv2, navH1, navLink1, navIcon, navLinkFa, navSearchInput, divAnimatedBorder, divFooter, pFooter
    }
  }

  // create Html for homepage
  const createHtmlHomepage = async (page = 1, pageSize = 9, selectedPlatform = 'Default') => {
    try {
      const urls = createUrls();
      const { results: games, next } = await getGames(urls, page, pageSize);

      // Add developers to each game using the helper function
      const gamesWithDevelopers = await addDevelopersToGames(games, urls);

      htmlBody();

      // Clear previous content
      main.innerHTML = '';

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

      homePlatformFilter.value = selectedPlatform;
      homePlatformFilter.addEventListener('change', (event) => {
        createHtmlHomepage(page, pageSize, event.target.value);
      });

      divFilterHome.appendChild(homePlatformH2);
      divFilterHome.appendChild(homePlatformFilter);
      main.appendChild(divFilterHome);

      // Section for cards
      const homeSection = document.createElement('section');
      const divCardsContainer = document.createElement('div');
      divCardsContainer.classList.add('cards-container');

      const filteredGames = selectedPlatform === 'Default'
        ? gamesWithDevelopers
        : gamesWithDevelopers.filter(game => game.platforms.some(platform => platform.platform.name.toLowerCase() === selectedPlatform));

      if (filteredGames.length === 0) {
        const noGamesMessage = document.createElement('p');
        noGamesMessage.textContent = 'No games available for the selected platform.';
        main.appendChild(noGamesMessage);
        return;
      }

      for (const game of filteredGames) {
        const divCardHome = document.createElement('div');
        divCardHome.classList.add('home-card');

        // Front card
        const cardFront = document.createElement('div');
        cardFront.classList.add('front-card');
        const frontImgDiv = document.createElement('div');
        frontImgDiv.classList.add('front-div-img');
        const cardPoster = document.createElement('img');
        cardPoster.src = game.background_image;
        cardPoster.alt = game.name;
        cardPoster.classList.add('home-poster');

        // Front details positioned at bottom
        const frontdetailsDiv = document.createElement('div');
        frontdetailsDiv.classList.add('front-details');
        const cardTitle = document.createElement('h3');
        cardTitle.textContent = game.name;
        const cardPlatforms = document.createElement('div');
        cardPlatforms.classList.add('home-platforms-container');
        const platformsList = document.createElement('ul');
        game.platforms.slice(0, 3).forEach(platform => { // Limit to 3 platforms
          const li = document.createElement('li');
          li.classList.add('fr-platform-item');
          li.textContent = platform.platform.name.length > 8 ? platform.platform.name.substring(0, 8) + '...' : platform.platform.name;
          platformsList.appendChild(li);
        });

        // Back card
        const cardBack = document.createElement('div');
        cardBack.classList.add('back-card');

        // Top section with release date and developers
        const divBackTop = document.createElement('div');
        divBackTop.classList.add('back-card-top');
        const pReleased = document.createElement('p');
        pReleased.classList.add('back-released');
        pReleased.textContent = `Released: ${game.released || 'TBD'}`;

        // Developers as buttons
        const divDevelopers = document.createElement('div');
        divDevelopers.classList.add('back-developers');
        const developersContainer = document.createElement('div');
        developersContainer.classList.add('developers-buttons');

        if (game.developers && game.developers.length > 0) {
          game.developers.slice(0, 3).forEach(developer => { // Limit to 3 developers
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

        // Middle section with rating circle and votes
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

        // Bottom section with genres
        const divBackGenres = document.createElement('div');
        divBackGenres.classList.add('home-genres-container');
        const genresList = document.createElement('ul');
        if (game.genres && game.genres.length > 0) {
          game.genres.slice(0, 4).forEach(genre => { // Limit to 4 genres
            const li = document.createElement('li');
            li.classList.add('bc-genre-item');
            li.textContent = genre.name.length > 10 ? genre.name.substring(0, 10) + '...' : genre.name;
            genresList.appendChild(li);
          });
        }

        divBackGenres.appendChild(genresList);
        cardBack.appendChild(divBackTop);
        cardBack.appendChild(divBackMiddle);
        cardBack.appendChild(divBackGenres);

        cardPlatforms.appendChild(platformsList);
        frontdetailsDiv.appendChild(cardTitle);
        frontdetailsDiv.appendChild(cardPlatforms);

        frontImgDiv.appendChild(cardPoster);
        frontImgDiv.appendChild(frontdetailsDiv); // Details positioned over image
        cardFront.appendChild(frontImgDiv);

        divCardHome.appendChild(cardFront);
        divCardHome.appendChild(cardBack);
        divCardsContainer.appendChild(divCardHome);
      }

      homeSection.appendChild(divCardsContainer);
      main.appendChild(homeSection);

      // Add pagination if there are more games
      if (next) {
        const paginationDiv = document.createElement('div');
        paginationDiv.classList.add('pagination');
        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'Next Page';
        nextPageButton.addEventListener('click', () => {
          createHtmlHomepage(page + 1, pageSize, selectedPlatform);
        });
        paginationDiv.appendChild(nextPageButton);
        main.appendChild(paginationDiv);
      }
    } catch (error) {
      console.error('Error in createHtmlHomepage:', error);
    }
  }


  // styling search bar
  const searchPlaceholder = () => {
    const input = document.querySelector('.search-input');
    input.addEventListener('mouseenter', () => {
      input.setAttribute('placeholder', 'Search...');
    });
    input.addEventListener('mouseleave', () => {
      input.removeAttribute('placeholder');
    })
  }



  // Initialize page
  const initPage = () => {
    createHtmlHomepage();
    // searchPlaceholder();

  };

  initPage();
});











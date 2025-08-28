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
  // console.log('get games', getGames());
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  // const platforms = ['Any', 'PC', 'Xbox'];
  // const cards = [{
  //   poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  //   title: 'Gametitle',
  //   platforms: ['p1', 'p2', 'p3'],
  //   released: 'Released: 25 sep 2025',
  //   editor: 'Editor: jgfskgsaashasfh',
  //   rating: 4.45,
  //   count: '1200 votes',
  //   genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
  // },
  // {
  //   poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  //   title: 'Gametitle',
  //   platforms: ['p1', 'p2', 'p3'],
  //   released: 'Released: 25 sep 2025',
  //   editor: 'Editor: jgfskgsaashasfh',
  //   rating: 4.45,
  //   count: '1200 votes',
  //   genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
  // },
  // {
  //   poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  //   title: 'Gametitle',
  //   platforms: ['p1', 'p2', 'p3'],
  //   released: 'Released: 25 sep 2025',
  //   editor: 'Editor: jgfskgsaashasfh',
  //   rating: 4.45,
  //   count: '1200 votes',
  //   genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
  // },
  // {
  //   poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  //   title: 'Gametitle',
  //   platforms: ['p1', 'p2', 'p3'],
  //   released: 'Released: 25 sep 2025',
  //   editor: 'Editor: jgfskgsaashasfh',
  //   rating: 4.45,
  //   count: '1200 votes',
  //   genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
  // }

  // ]
  // const urls = createUrls();
  // const { results, next } = await getGames(urls);

  // get params from api
  const getParamsGames = async () => {
    const urls = createUrls();
    const { results } = await getGames(urls);
    return results.map(result => ({
      slug: result.slug,
      title: result.name,
      released: result.released,
      poster: result.background_image,
      genres: result.genres,
      platforms: result.platforms,
      rating: result.rating,
      votes: result.ratings_count,
      editor: result.publishers,
      gameId: result.id
    }));
  }

  // Fetch the list of platforms from the API
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
  const createHtmlHomepage = async () => {
    try {
      const urls = createUrls();
      const gamesData = await getParamsGames();
      const platformNames = await getPlatforms(urls); // Fetch platform names

      htmlBody();

      // Header-------------------------------------------------------------
      const nextChildHeader = document.querySelector('.animated-border');
      const divHomeText = document.createElement('div');
      header.insertBefore(divHomeText, nextChildHeader);
      divHomeText.classList.add('home-header');
      const homeHeaderH2 = document.createElement('h2');
      const homeHeaderP = document.createElement('p');
      homeHeaderH2.textContent = 'Welcome,';
      homeHeaderP.textContent = 'The Hyper Progame is the world’s premier event for computer and video games and related products. At The Hyper Progame, the video game industry’s top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry. For three exciting days, leading-edge companies, groundbreaking new technologies, and never-before-seen products will be showcased. The Hyper Progame connects you with both new and existing partners, industry executives, gamers, and social influencers providing unprecedented exposure.';
      divHomeText.appendChild(homeHeaderH2);
      divHomeText.appendChild(homeHeaderP);


      // Main
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

      // Add platforms to the select dropdown
      platformNames.forEach((platformName, index) => {
        const option = document.createElement('option');
        option.value = `platform-${index + 1}`;
        option.textContent = platformName.charAt(0).toUpperCase() + platformName.slice(1); // Capitalize
        homePlatformFilter.appendChild(option);
      });

      divFilterHome.appendChild(homePlatformH2);
      divFilterHome.appendChild(homePlatformFilter);

      // Section 
      const homeSection = document.createElement('section');
      // Cards
      const divCardsContainer = document.createElement('div');
      divCardsContainer.classList.add('cards-container');

      gamesData.forEach(card => {
        const divCardHome = document.createElement('div');
        divCardHome.classList.add('home-card');
        // Front card
        const cardFront = document.createElement('div');
        cardFront.classList.add('front-card');
        const frontImgDiv = document.createElement('div');
        frontImgDiv.classList.add('front-div-img');
        const cardPoster = document.createElement('img');
        cardPoster.src = card.poster;
        cardPoster.alt = card.title;
        cardPoster.classList.add('home-poster');
        const frontdetailsDiv = document.createElement('div');
        frontdetailsDiv.classList.add('front-details');
        const cardTitle = document.createElement('h3');
        cardTitle.textContent = card.title;
        const cardPlatforms = document.createElement('div');
        cardPlatforms.classList.add('home-platforms-container');
        const platformsH4 = document.createElement('h4');
        platformsH4.textContent = 'Platforms';
        const platformsList = document.createElement('ul');
        card.platforms.forEach(platform => {
          const li = document.createElement('li');
          li.classList.add('fr-platform-item');
          li.textContent = platform.platform.name;
          platformsList.appendChild(li);
        });

        // Back card
        const cardBack = document.createElement('div');
        cardBack.classList.add('back-card');
        const divBackDetails = document.createElement('div');
        divBackDetails.classList.add('card-back-details');
        const divPText = document.createElement('div');
        divPText.classList.add('back-p-text');
        const pReleased = document.createElement('p');
        const pEditor = document.createElement('p');
        pReleased.textContent = card.released;
        pEditor.textContent = card.editor;
        const divRateCount = document.createElement('div');
        divRateCount.classList.add('back-p-rate-vote');
        const pRating = document.createElement('p');
        const pCount = document.createElement('p');
        pRating.textContent = `Rating: ${card.rating}`;
        pCount.textContent = `Votes: ${card.votes}`;
        const divBackGenres = document.createElement('div');
        divBackGenres.classList.add('home-genres-container');
        const genresH4 = document.createElement('h4');
        genresH4.textContent = 'Genres';
        const genresList = document.createElement('ul');
        card.genres.forEach(genre => {
          const li = document.createElement('li');
          li.classList.add('bc-genre-item');
          li.textContent = genre.name;
          genresList.appendChild(li);
        });

        divBackGenres.appendChild(genresH4);
        divBackGenres.appendChild(genresList);
        divRateCount.appendChild(pRating);
        divRateCount.appendChild(pCount);
        divPText.appendChild(pReleased);
        divPText.appendChild(pEditor);
        divBackDetails.appendChild(divPText);
        divBackDetails.appendChild(divRateCount);
        cardPlatforms.appendChild(platformsH4);
        cardPlatforms.appendChild(platformsList);
        frontdetailsDiv.appendChild(cardTitle);
        frontdetailsDiv.appendChild(cardPlatforms);
        frontImgDiv.appendChild(cardPoster);
        cardFront.appendChild(frontImgDiv);
        cardFront.appendChild(frontdetailsDiv);
        cardBack.appendChild(divBackDetails);
        cardBack.appendChild(divBackGenres);
        divCardHome.appendChild(cardFront);
        divCardHome.appendChild(cardBack);
        divCardsContainer.appendChild(divCardHome);
      });

      homeSection.appendChild(divCardsContainer);
      main.appendChild(divFilterHome);
      main.appendChild(homeSection);
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











/**
 * Card Components Module - Handles card creation and animations
 */

import { router } from './router.js';

/**
 * Intersection Observer for card animations
 */
let cardObserver;

/**
 * Initialize card observer for scroll animations
 */
export const initializeCardObserver = () => {
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

/**
 * Create a game card for homepage
 * @param {Object} game - Game data object
 * @param {HTMLElement} container - Container element to append card
 */
export const createGameCard = (game, container) => {
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
    li.textContent = platform.platform.name.length > 8 ?
      platform.platform.name.substring(0, 8) + '...' :
      platform.platform.name;
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
      devButton.classList.add('developer-btn', 'clickable');
      devButton.textContent = developer.length > 12 ?
        developer.substring(0, 12) + '...' :
        developer;

      // Make developers clickable on homepage
      devButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Use developer name as both ID and name for now
        router.navigate(`/results/?type=developers&id=${encodeURIComponent(developer)}&name=${encodeURIComponent(developer)}`);
      });

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
      li.textContent = genre.name.length > 10 ?
        genre.name.substring(0, 10) + '...' :
        genre.name;
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

  // Observe the card for animations
  if (cardObserver) {
    cardObserver.observe(divCardHome);
  }
};

/**
 * Create a result card with clickable elements for filtering
 * @param {Object} game - Game data object
 * @param {HTMLElement} container - Container element to append card
 */
export const createResultCard = (game, container) => {
  const divCardHome = document.createElement('div');
  divCardHome.classList.add('home-card', 'card-hidden');

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
    li.classList.add('fr-platform-item', 'clickable');
    li.textContent = platform.platform.name.length > 8 ?
      platform.platform.name.substring(0, 8) + '...' :
      platform.platform.name;

    // Make platforms clickable
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      router.navigate(`/results/?type=platforms&id=${platform.platform.id}&name=${platform.platform.name}`);
    });

    platformsList.appendChild(li);
  });

  // Back card with clickable elements
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
      devButton.classList.add('developer-btn', 'clickable');
      devButton.textContent = developer.length > 12 ?
        developer.substring(0, 12) + '...' :
        developer;

      // Make developers clickable on results page
      devButton.addEventListener('click', (e) => {
        e.stopPropagation();
        router.navigate(`/results/?type=developers&id=${encodeURIComponent(developer)}&name=${encodeURIComponent(developer)}`);
      });

      developersContainer.appendChild(devButton);
    });
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

  // Clickable genres
  const divBackGenres = document.createElement('div');
  divBackGenres.classList.add('home-genres-container');
  const genresList = document.createElement('ul');
  if (game.genres && game.genres.length > 0) {
    game.genres.slice(0, 4).forEach(genre => {
      const li = document.createElement('li');
      li.classList.add('bc-genre-item', 'clickable');
      li.textContent = genre.name.length > 10 ?
        genre.name.substring(0, 10) + '...' :
        genre.name;

      // Make genres clickable
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        router.navigate(`/results/?type=genres&id=${genre.id}&name=${genre.name}`);
      });

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

  // Observe the card for animations
  if (cardObserver) {
    cardObserver.observe(divCardHome);
  }
};

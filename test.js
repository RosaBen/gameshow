// main
const main = document.querySelector('main');
const platforms = ['Any', 'PC', 'Xbox'];
const cards = [{
  poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  title: 'Gametitle',
  platforms: ['p1', 'p2', 'p3'],
  released: 'Released: 25 sep 2025',
  editor: 'Editor: jgfskgsaashasfh',
  rating: 4.45,
  count: '1200 votes',
  genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
},
{
  poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  title: 'Gametitle',
  platforms: ['p1', 'p2', 'p3'],
  released: 'Released: 25 sep 2025',
  editor: 'Editor: jgfskgsaashasfh',
  rating: 4.45,
  count: '1200 votes',
  genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
},
{
  poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  title: 'Gametitle',
  platforms: ['p1', 'p2', 'p3'],
  released: 'Released: 25 sep 2025',
  editor: 'Editor: jgfskgsaashasfh',
  rating: 4.45,
  count: '1200 votes',
  genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
},
{
  poster: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
  title: 'Gametitle',
  platforms: ['p1', 'p2', 'p3'],
  released: 'Released: 25 sep 2025',
  editor: 'Editor: jgfskgsaashasfh',
  rating: 4.45,
  count: '1200 votes',
  genres: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
}

]

// section
const homeSection = document.createElement('section');
// cards container
// const divCardsContainer = document.createElement('div');
// divCardsContainer.classList.add('cards-container');
cards.forEach(card => {
  // card
  const divCardHome = document.createElement('div');
  divCardHome.classlist.add('home-card');
  // frontcard
  const cardFront = document.createElement('div');
  cardFront.classList.add('front-card');
  // frontcardDivImg
  const frontImgDiv = document.createElement('div');
  frontImgDiv.classList.add('front-div-img');
  // frontcardDivImgPoster
  const cardPoster = document.createElement('img');
  cardPoster.src = card.poster;
  cardPoster.alt = card.title;
  cardPoster.classList.add('home-poster');
  // frontcardDetails
  const frontdetailsDiv = document.createElement('div');
  frontdetailsDiv.classList.add('front-details');
  // frontcardDetailsH3
  const cardTitle = document.createElement('h3');
  cardTitle.textContent = card.title;
  // frontcardDetailsdivPlatforms
  const cardPlatforms = document.createElement('div');
  cardPlatforms.classList.add('home-platforms-container');
  // frontcardDetailsdivPlatformsH4
  const platformsH4 = document.createElement('h4');
  platformsH4.textContent = 'Platforms';
  // frontcardDetailsdivPlatformsListUL
  const platformsList = document.createElement('ul');
  (card.platforms).forEach(platform => {
    const li = document.createElement('li');
    li.classList.add('fr-platform-item');
    li.textContent = platform;
    platformsList.appendChild(li)
  })
  cardPlatforms.appendChild(platformsH4);
  cardPlatforms.appendChild(platformsList);
  frontdetailsDiv.appendChild(cardTitle);
  frontdetailsDiv.appendChild(cardPlatforms);
  frontImgDiv.appendChild(cardPoster);
  cardFront.appendChild(frontImgDiv);
  cardFront.appendChild(frontdetailsDiv);
  divCardHome.appendChild(cardFront);
  divCardHome.appendChild(cardBack);
  divCardsContainer.appendChild(divCardHome);
})

// appendchildCard

// divCardsContainer.appendChild(divCardHome);





// BtnShowMore
const divShowMoreBtn = document.createElement('div');
divShowMoreBtn.classList.add('showMoreDiv');
// appendchild



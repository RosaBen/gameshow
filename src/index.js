import './style/index.scss';

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

const searchPlaceholder = () => {
  const input = document.querySelector('.search-input');
  input.addEventListener('mouseenter', () => {
    input.setAttribute('placeholder', 'Search...');
  });
  input.addEventListener('mouseleave', () => {
    input.removeAttribute('placeholder');
  })
}

// createHtmlHomepage = () => {

// }

// Initialize page
const initPage = async () => {
  const urls = createUrls();
  const { results, next } = await getGames(urls);
  const placeholderSearch = searchPlaceholder();
  console.log('Résultats obtenus :', results);
  console.log('Prochaine page :', next);

  return {
    urls, results, next, placeholderSearch
  };
};

initPage();
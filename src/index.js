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



const createUrls = () => {
  return apiDatasParams.reduce((acc, param) => {
    acc[param] = `${apiUrl}${param}${keyParam}${key}`;
    return acc;
  }, {});

}

const urls = createUrls();
console.log("urls", urls);
// page = 1, pageSize = 40, filters = null
// const getApi = async (page = 1, pageSize = 9) => {
//   try {
//     // let apiUrl = `${url}&page=3`;
//     let gamesUrl = `${url}&page_size=${pageSize}&page=${page}`;
//     const response = await fetch(gamesUrl);
//     const data = await response.json();
//     console.log("data", data.results)
//     return {
//       results: data.results,
//       next: data.next
//     }

//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return {
//       results: [], next: null
//     };
//   }
// }

// const getDatas = () => {
//   const data = async getDatas();
//   console.log("data", data.results)
// }


// const initPage = () => {
//   getApi();

// }

// initPage();
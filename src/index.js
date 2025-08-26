import './style/index.scss';

const url = process.env.API_URL;
// page = 1, pageSize = 40, filters = null
const getApi = async (page = 1, pageSize = 9) => {
  try {
    // let apiUrl = `${url}&page=3`;
    let apiUrl = `${url}&page_size=${pageSize}&page=${page}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("data", data)
    console.log("results", data.results)
    return {
      results: data.results
    }


  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      results: [], next: null
    };
  }
}


const initPage = () => {
  getApi();
}

initPage();
import axios from 'axios';

const SEARCH_NEWS_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const POPULAR_NEWS_URL = 'https://api.nytimes.com/svc/mostpopular/v2/viewed';
const CATEGORIES_LIST_URL =
  'https://api.nytimes.com/svc/news/v3/content/section-list.json';
const POPULAR_NEWS_DAYS = 7;
const API_KEY = 'H4EzmbJjzcMKAQjlOxUvVd6TipG3GhzM';

export default class newsApiService {
  constructor() {
    this.searchQuery = '';
    this.selectedCategories = '';
    this.selectedDate = '';
    this.page = 0;
    this.loadCards = 0;
  }

  getsearchNews() {
    return fetch(
      `${SEARCH_NEWS_URL}?q=${this.searchQuery}&page=${this.page}&api-key=${API_KEY}`
    ).then(responce => {
      if (!responce.ok) {
        throw new Error(responce.statusText);
      }
      this.nextPage();
      return responce.json();
    });
  }

  nextPage() {
    this.page += 1;
  }

  resetData() {
    this.page = 0;
    this.loadCards = 0;
  }

  addLoadCards(quantityLoadCards) {
    this.loadCards = this.loadCards + quantityLoadCards;
  }

  getpopularNews() {
    return fetch(
      `${POPULAR_NEWS_URL}/${POPULAR_NEWS_DAYS}.json?api-key=${API_KEY}`
    ).then(responce => {
      if (!responce.ok) {
        throw new Error(responce.statusText);
      }
      return responce.json();
    });
  }

  getlistCategories() {
    return fetch(`${CATEGORIES_LIST_URL}?api-key=${API_KEY}`).then(responce => {
      if (!responce.ok) {
        throw new Error(responce.statusText);
      }
      return responce.json();
    });
  }

  getcategoryNews() {
    // формат дати
    const date = new Date(this.selectedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    // формат категорій
    let FormatSelectedCategories = null;
    if (this.selectedCategories.length !== 0) {
      FormatSelectedCategories = this.selectedCategories.join('", "');
    }

    const searchUrl = `?pub_date=${dateString}&api-key=${API_KEY}`;
    const params = `&fq=news_desk:(${FormatSelectedCategories})&page=${this.page}`;

    return fetch(`${SEARCH_NEWS_URL}${searchUrl}${params}`).then(responce => {
      if (!responce.ok) {
        throw new Error(responce.statusText);
      }
      return responce.json();
    });
  }

  getDateAndCategoryNews(selectedDate, selectedCategories) {
    const SEARCH_BY_DATE = `?facet_field=day_of_week&facet=true&begin_date=${selectedDate}&end_date=${selectedDate}&api-key=${API_KEY}`;
    let SEARCH_BY_CATEGORIES = "";

    if (selectedCategories) { 
        SEARCH_BY_CATEGORIES = `&fq=news_desk:(${selectedCategories})`;
    }
    
    return axios.get(`${SEARCH_NEWS_URL}${SEARCH_BY_DATE}${SEARCH_BY_CATEGORIES}`)
        .then(response => {
        if (response.status !== 200 || response.data.response.docs.length === 0) {
          throw new Error(response.status);
        }
        return response.data.response.docs;
    });
   }
}



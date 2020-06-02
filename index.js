const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}"/>
      ${movie.Title} (${movie.Year})
      `
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {    
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: 'aeaeb0c9',
          s: searchTerm
        }
      });
      if (response.data.Error) {
        return [];
      }
      return response.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  }
  
})

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  }
})


let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaruElement,side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'aeaeb0c9',
      i: movie.imdbID
    }
  })
  console.log(response.data);

  summaruElement.innerHTML = movieTemplate(response.data);
  if(side==='left'){
    leftMovie = response.data
  }else{
    rightMovie = response.data;
  
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
}

const runComparison = () =>{
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll('#right-summary .notification')

  leftSideStats.forEach((leftStat, index)=>{
    const rightStat = rightSideStats[index];
    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if(rightSideValue > leftSideValue){
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-error')
    }else{
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = (movieDetails) => {
  const dollars = movieDetails.BoxOffice === 'N/A' ? randomBoxOffice() : movieDetails.BoxOffice
  const dollarsAmt = parseInt(dollars.replace(/\$/g,'').replace(/,/g,''))
  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
  const awards = movieDetails.Awards.split(' ').reduce((prev, word)=>{
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    }else{
      return prev + value;
    }

  },0)

  return ` 
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    
    <article data-value=${dollarsAmt} class="notification is-primary">
      <p class="title">${dollars}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article  data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}
const fetchData = async (searchTerm) =>{
  const response = await axios.get('http://www.omdbapi.com/',{
    params: {
      apikey:'aeaeb0c9',
      s: searchTerm
    }
  });

  console.log(response.data)
};

const input = document.querySelector('input');

const debounce = (func, delay = 1000)=>{
  let timeoutId;

  return (...args)=>{
    if(timeoutId){
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(()=>{
      func.apply(null, args);
    },delay)
  }
};

const onInput = debounce((event) =>{
  fetchData(event.target.value)
},1000);

input.addEventListener('input', onInput);
const fetchData = async () =>{
  const response = await axios.get('http://www.omdbapi.com/',{
    params: {
      apikey:'aeaeb0c9',
      s:'avengers'
    }
  });

  console.log(response.data)
};

fetchData();
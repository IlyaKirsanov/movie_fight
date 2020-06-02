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


const randomBoxOffice = () => {
  const boxOffice = Math.round(Math.random() * 1000000000);
  return '$'+boxOffice;
}
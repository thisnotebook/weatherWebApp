// console.log("hello ji kya haal chal");
// const API_KEY = "85000989bde1407f215424aa43d1d8c1";

// async function showweather(){
//     try{
//         let city ="delhi";
//         let country = "IN";
//         //always use "await" while calling network or fetch api
//      //  const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
//         const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`);
//         const data = await response.json(); // convert response into json format why bcoz mainly we work on json format
    
//          console.log("weather data:-> ", data);
          
//           let newpara = document.createElement('p');
//           newpara.textContent =  `${data?.main?.temp.toFixed(2)} °k`;
//           document.body.appendChild(newpara);
//     }
//     catch(err){
//      //handle it
//      //when error occur when we use link to fetch weather data from longitude and latitude when we give any long.. and lati.. which is no data their or give country name which not exist then /
//      //we get error so handle here
//      console.log("error found" ,err);
//     }
   
// }

const userTab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");
const grantaccessContainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector(".form-containers");
const loadingscreen = document.querySelector(".loading-containers");
const userInfoContainer = document.querySelector(".user-info-containers");
// userinfocontainer : use both in your location weather and search weather  because showing same thing
//varibles
let currentTab = userTab;
const API_KEY = "85000989bde1407f215424aa43d1d8c1";

currentTab.classList.add("current-tab"); // currenttab ke corressponding kuch css property or class(user defined) h jo isme hum add kar denge
                               // and current-tab is custom css class which content code in style.css

         getfromsessionStroage();//some time pahle se hi lan and lon hota h tab pahle hi iss function ko run kar diya
    function switchTab(clickedtab){   //clickedtab = newtab , currenttab = oldtab
     if(clickedtab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedtab;
        currentTab.classList.add("current-tab");

     if(!searchform.classList.contains("active")){
      //kya search wala invisible so make visible
      userInfoContainer.classList.remove("active");
      grantaccessContainer.classList.remove("active");
      searchform.classList.add("active");
     }
     else{
      // pahle hi search wale mein huab your weather dikhana h
      searchform.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //current location ka weather dikhana h ab search wala deactive h gaya 
      //we call a function -getfromsessionstorage () -which take input or current storage from stroage session and show curretn location
      //weather
      
      getfromsessionStroage();
     }
     }
 }
 //check if cordinates are already present in session stroge
  function getfromsessionStroage(){
   console.log("getfromsessionstroage start here");
      const localcoordinates = sessionStorage.getItem("user-coordinates");
      if(!localcoordinates){
         //coordinate accsess nhi h matlab location ka grant nhi h
         grantaccessContainer.classList.add("active");
      }
      else{
         const coordinates = JSON.parse(localcoordinates); //convert json into string
         fetchUserWeatherInfo(coordinates);//ye function user ke weather info lo fetch karke lata h
      }
 
  }
    
    async function fetchUserWeatherInfo(coordinates){
      console.log("fetchuserweaterinfo start here");
      const {lat, lon} = coordinates;

      //make grant accesss container invisible
      grantaccessContainer.classList.remove("active");
      //make loader visible
      loadingscreen.classList.add("active");

      //api calll
      try{
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                                       //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
         const data = await response.json();
       console.log("weather data:-> ", data);
       loadingscreen.classList.remove("active");
       userInfoContainer.classList.add("active");
        renderWeatherinfo(data);
        //renderWeather info : dynamically show value of temp humidity etc on ui by fetching value from json file

      }
      catch(err){
         loadingscreen.classList.remove("active");
   console.log("error found" ,err);

      }

    }

    function renderWeatherinfo(weatherinfo){
      console.log("renderweatherinfo start here");
 // fistly we have to fetch the elements
 const cityname = document.querySelector("[data-cityname]");
 const countryflag = document.querySelector("[data-countryicon]");
 const desc = document.querySelector("[data-weatherdesc]");
 const weathericon = document.querySelector("[data-weathericon]");
 const temp = document.querySelector("[data-temp]");
 const windspeed = document.querySelector("[data-windspeed]");
 const humidity = document.querySelector("[data-humidity]");
 const cloudiness = document.querySelector("[data-cloudiness]");


 // to fetch particular data city name so weuse 'optional chaining operater' "?." in json format we can see dile have one child which name is "name" in this there is city name
   //if any property not exist in json object which we fetching so this operator never through error give indefined value
 cityname.innerText = weatherinfo?.name;
 countryflag.src =   `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
 
 //similary country code in the json->sys->country
desc.innerText = weatherinfo?.weather?.[0]?.description;
//if we see json file carefully weather have array type conatin one element only therefore using [0]
weathericon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
//temp.innerText = `${weatherinfo?.main?.temp -273.15}°C/${weatherinfo?.main?.temp}K `
temp.innerText = `${parseFloat(weatherinfo?.main?.temp -273.15).toFixed(1)}°C  `
//    ${weatherinfo?.main?.temp}K parseFloat("10.547892").toFixed(2)
//.toFixed(1) convert float value upto 1 place after decimal
// windspeed.innerText = weatherinfo?.wind?.speed; //ese bhi kar sakte h bina  `` but agar value ke elawa kuch aur bhi daalna h ex: m/s, C,K % so we have to use ``
windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
//           
humidity.innerText =  `${weatherinfo?.main?.humidity}%`;
cloudiness.innerText = `${weatherinfo?.clouds?.all}%`;



}

 userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
 }); 
 /* switchtab fuction change the clicked input*/
 searchtab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchtab);
 });

 function showPosition(position){
   const usercoodinates={
      lat : position.coords.latitude,
      lon: position.coords.longitude,//coords
   }
   sessionStorage.setItem("user-coordinates",JSON.stringify(usercoodinates));
   fetchUserWeatherInfo(usercoodinates);
 }

function getlocation(){
   if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(showPosition);//call back function - show position
      }
   else{
alert("no!! geolocation support available");
   }
}


 const grantaccessbtn = document.querySelector("[data-grantaccesss]");
 grantaccessbtn.addEventListener('click',getlocation);

 const searchInput = document.querySelector("[data-searchInput]");
 searchform.addEventListener("submit", (e)=>{
   e.preventDefault();
   let cityName = searchInput.value;
   if(cityName === "") 
        return;
   else{
   fetchSearchWeatherInfocity(cityName);}
 })

 async function fetchSearchWeatherInfocity(city){
   loadingscreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantaccessContainer.classList.remove("active");


   try{
    
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

      const data = await response.json(); ///its very important to use await
      console.log("weather data:-> ", data);
      loadingscreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherinfo(data);

   }
   catch(err){
      loadingscreen.classList.remove("active");
      console.log("error found" ,err);
   }
 }
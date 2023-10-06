const  getWeatherData = function(lat, lon, apikey){
    let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apikey;

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, lat, lon, apikey);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to fetch weather data');
    });
};

const getGeoCoordinates = function (city, state, country, limit, apikey) {
    const apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + state + ',' + country + '&limit=' + limit + '&appid=' + apikey;
  
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data.items, language);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  };
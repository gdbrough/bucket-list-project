const Request = require('./services/request.js');
const CountryView = require('./views/countryView.js');
const MapWrapper = require('./views/mapWrapper.js');

const allCountriesRequest = new Request("https://restcountries.eu/rest/v2/all")
const dbrequest = new Request("/api/countries");

const countryView = new CountryView();


const getAllCountries = function(){
  allCountriesRequest.get(populateCountriesList);
}

const getCountryDetails = function(country){
  const countryDetails = {
    name: country.name,
    population: country.population,
    capital: country.capital,
    flag: country.flag,
    latlng: country.latlng
  };

  return countryDetails;
}

const populateCountriesList = function(allCountries){

  const countrySelector = document.getElementById('select-country');

// POPULATED THE LIST
  for (let country of allCountries){
    const option = document.createElement('option');
    const countryDetails = getCountryDetails(country);
    option.value = JSON.stringify(countryDetails);      // value is JSON object
    option.innerText = country.name;
    countrySelector.appendChild(option);
  }

}

const saveCountry = function(){
  const countrySelector = document.getElementById('select-country');
  const selectedCountryJSON = countrySelector.value;
  const selectedCountryObj = JSON.parse(selectedCountryJSON);

  dbrequest.post(saveRequestComplete, selectedCountryObj);
}

const saveRequestComplete = function(countryToSave){
  countryView.addCountry(countryToSave);
}

const initialiseMap = function(){
  const container = document.getElementById("big-map");
  const center = {lat:0, lng:0};
  const zoom = 2;
  const map = new MapWrapper(container, center, zoom);
};

const app = function(){
  getAllCountries();
  initialiseMap();
  const selectCountryButton = document.getElementById('select-country-button');
  selectCountryButton.addEventListener('click', function(event){
    event.preventDefault();
    saveCountry();
  });
};



document.addEventListener('DOMContentLoaded', app);

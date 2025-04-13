
//Definierar variabler
const apiKey = "301a50ff7afdb53b456aa7867e148a68"; //apinyckel för vädret
const apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather"; //url för vädret nu
const apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast"; //url för väderprognos
const bildApiKey = "IKkS_-y5YWRlPMQGNQBKLJi5lk5ma6tK8nQgjV8BvHs"; //apinyckel för unsplsash

//Funktion för att hämta användarens position med getCurrentPosition som ger longitud och latitud-koordinater
function getUserLocation() {
    if (navigator.geolocation) {
        console.log("Hämtar din plats..");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Position hämtad:", position);
                fetchWeatherData(position);//Hämta vädret för idag
                fetchWeatherForecast(position); //Hämta prognos för imorgon och övermorgon
            },
            (error) => {
                console.error("Geolokalisering misslyckades:", error);//felhantering med console.error
            }
        );
    } else {
        alert("Geolokalisering stöds inte i denna webbläsare.");//felhantering för om det inte går att använda navigator.geolocatuion
    }
}

//Funktion för att hämta väderdatan för idag med koordinater och apiet
function fetchWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(`Hämtar väderdata för lat: ${lat}, lon: ${lon}`);

    const url = `${apiUrlCurrent}?lat=${lat}&lon=${lon}&units=metric&lang=sv&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Nuvarande väder:", data);
            displayWeatherData(data);  //Uppdaterar väder för idag med displayWeatherData
        })
        .catch(error => {
            console.error("Error vid väderhämtning:", error);
        });
}

//Funktion för att hämta väderprognos för imorgon och övermorgon med url för forecast/prognos
function fetchWeatherForecast(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `${apiUrlForecast}?lat=${lat}&lon=${lon}&units=metric&lang=sv&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Väderprognos:", data);
            displayForecastData(data);  //Uppdatera väderprognos med dispalForecastData
        })
        .catch(error => {
            console.error("Error vid prognoshämtning:", error);
        });
}

//Funktion för att hämta och visa väderdata för idag
function displayWeatherData(data) {
    if (!data || !data.weather || data.weather.length === 0) {//felhantering för om väder ej gick att hämta in
        console.error("Ogiltig väderdata:", data);
        return;
    }
    //hämtar specifika data från apiet och sparar dessa i variabler
    const weatherDescription = data.weather[0].description; //Väderbeskrivning
    const temperature = data.main.temp; //Temperatur
    const cityName = data.name; //Stad
    const iconCode = data.weather[0].icon; //Ikon-kod från apiet

    //url för väderikonen
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    //Skriv ut väderinformation
    document.getElementById('weather-today').innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}" class="weather-icon" /><h4>Idag i ${cityName}</h4><p>${temperature.toFixed(1)}°C</p><p>${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}</p>`;
    //toFixed för en decimal i temperatuererna, charAt och toUpperCase gör första bokstaven i prognosen till caps, alt i iconen ifall att den inte kan hämtas och för tillgänglighet
}


//Funktion för att hämta och visa väderprognos för imorgon och övermorgon
function displayForecastData(data) {
    if (!data || !data.list || data.list.length === 0) {
        console.error("Ogiltig väderprognosdata:", data);
        return;
    }

    //Hämtar väderprognos för imorgon och övermorgon kl12:00 varje dag och sparar i variabler
    const forecastTomorrow = data.list[8];
    const forecastOvermorrow = data.list[16];

    //Imorgon
    const tempTomorrow = forecastTomorrow.main.temp;
    const iconCodeTomorrow = forecastTomorrow.weather[0].icon; //Ikon-kod för imorgon
    const iconUrlTomorrow = `http://openweathermap.org/img/wn/${iconCodeTomorrow}@2x.png`; //url för väderikon imorgon

    //Övermorgon
    const tempOvermorrow = forecastOvermorrow.main.temp;
    const iconCodeOvermorrow = forecastOvermorrow.weather[0].icon;
    const iconUrlOvermorrow = `http://openweathermap.org/img/wn/${iconCodeOvermorrow}@2x.png`;

    // Uppdatera väderprognos imorgon
    document.getElementById('weather-tomorrow').innerHTML = `<img src="${iconUrlTomorrow}" alt="Väderikon för imorgon" class="weather-icon" /><h4>Imorgon</h4><p>${tempTomorrow.toFixed(1)}°C</p><p>${forecastTomorrow.weather[0].description.charAt(0).toUpperCase() + forecastTomorrow.weather[0].description.slice(1)}</p>`;
    
    document.getElementById('weather-overmorrow').innerHTML = `<img src="${iconUrlOvermorrow}" alt="Väderikon för övermorgon" class="weather-icon" /><h4>Övermorgon</h4><p>${tempOvermorrow.toFixed(1)}°C</p><p>${forecastOvermorrow.weather[0].description.charAt(0).toUpperCase() + forecastOvermorrow.weather[0].description.slice(1)}</p>`;
}

getUserLocation();


//===========FUNTION KLOCKA===================
function clock() {
    const idag = new Date();
    let timme = idag.getHours();
    let minut = idag.getMinutes();
    let datum = idag.getDate();
    let month = idag.toLocaleString('default', { month: 'long' });
    let år = idag.getFullYear();
    minut = checkTime(minut);
    
    document.getElementById('klocka').innerHTML = timme + ":" + minut + " | " + datum + " " + month + " " + år;
    setTimeout(clock, 1000);
}
//Lägger till 0 framför minuter om det är mindrre än 10
function checkTime(i) {
    if(i < 10) {
        i = "0" + i
    }; return i;
}
clock();

//Asynkron funktion för att hämta nyheter från api
async function fetchNyheter() {
    const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.svt.se/nyheter/rss.xml");
    const data = await response.json();

    const container = document.getElementById("nyheter");

    //hämtar de 4 senaste nyheterna och gör en ny div för varje i klassen nyhet och är child till nyheter-id
    data.items.slice(0, 4).forEach(nyhet => {
        const div = document.createElement("div");
        div.className = "nyhet";
        //skriver ut nyhetsrubriken med länk i nytt fönster samt datum för publicering
        div.innerHTML = `<h4><a href="${nyhet.link}" class="rubrik-nyhet" target="_blank">${nyhet.title}</a></h4><p>${nyhet.pubDate}</p>`;
        container.appendChild(div);
    });
}
fetchNyheter();


//===========FUNKTION SLUMPA BAKGRUNDSBILD============
//Funktion för bakgrund-button, när den klickas körs fetchBild()
function slumpaBakgrund() {
    document.getElementById("bakgrund-button").addEventListener("click", function() {
        fetchBild();
        
    })
}

//Funktion för att hämta slumpmässig bild från unsplash api coh styling för bilden i main
function fetchBild() {
    const url = `https://api.unsplash.com/photos/random?client_id=${bildApiKey}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const bildUrl = data.urls.full;
        document.querySelector("main").style.backgroundImage = `url(${bildUrl})`;
        document.querySelector("main").style.backgroundSize = "cover";
        document.querySelector("main").style.backgroundPosition = "center";
        document.querySelector("main").style.backgroundRepeat = "no-repeat";
    })
    .catch(error => {
        console.error("Error: ", error);//felhantering om det ej går att hämta bild
    })
}
slumpaBakgrund();

//================FUNTIONER FÖR LOCAL STORAGE=================
//Funktion för att hämta och visa länkar från localStorage
function loadLinksFromLocalStorage() {
    //Hämta sparade länkar från localStorage
    const linksFromStorage = JSON.parse(localStorage.getItem('links')) || [];

    //Om länkarna inte finns i LS, lägg till de ursprungliga länkarna
    if (linksFromStorage.length === 0) {
        const initialLinks = [
            { name: 'Google', url: 'https://www.google.com' },
            { name: 'Notion', url: 'https://www.notion.com/' },
            { name: 'Chat GPT', url: 'https://chatgpt.com/' },
            { name: 'W3Schools', url: 'https://www.w3schools.com/' }
        ];
        localStorage.setItem('links', JSON.stringify(initialLinks));
        return initialLinks; //Om localStorage är tomt, använd initialLinks
    }
    return linksFromStorage;
}

//Funktion för att ta bort länk från localStorage
function removeLinkFromStorage(url) {
    let links = JSON.parse(localStorage.getItem('links')) || [];
    //tar bort länken baserat på URL
    links = links.filter(link => link.url !== url);
    //Spara den uppdaterade listan av länkar till localStorage
    localStorage.setItem('links', JSON.stringify(links));  
}

//Funktion för att rendera länkar
function renderLinks() {
    const linksContainer = document.getElementById('länk-container');
    const links = loadLinksFromLocalStorage(); //Ladda länkar från localStorage

    linksContainer.innerHTML = ''; //Töm container

    //FÖr varje länk i listan skapas en ny div med klassen länkar, skapar ancortag med urlen, skapar remove-button
    links.forEach(link => {
        const newLinkDiv = document.createElement('div');
        newLinkDiv.classList.add('länkar');

        const newLink = document.createElement('a');
        newLink.href = link.url;
        newLink.textContent = link.name;
        newLink.target = "_blank";

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'X';
        removeButton.addEventListener("click", function() {
            removeLinkFromStorage(link.url); //Ta bort länk från localStorage
            newLinkDiv.remove(); //Ta bort länk från UI
        });
        newLinkDiv.appendChild(newLink);
        newLinkDiv.appendChild(removeButton);
        linksContainer.appendChild(newLinkDiv);
    });
}

//Ladda länkar från localStorage när sidan laddas om
window.addEventListener('load', function() {
    renderLinks(); //Ladda och rendera länkar från localStorage vid sidladdning
});


//============FUNKTIONER FÖR LÄGG-TILL-LÄNK-KNAPPEN===============
document.getElementById("add-link-button").addEventListener("click", function() {
    //Visa input-fälten för länk när knappen klickas
    const gömdLänk = document.getElementById("gömd-länk");
    if (gömdLänk.style.display === "none" || gömdLänk.style.display === "") {
        gömdLänk.style.display = "block"; //Visa input-fälten
    } else {
        gömdLänk.style.display = "none"; //dölj input-fält om den redan är visad
    }
});

//Funktion för att lägga till ny länk och spara i localStorage
document.getElementById("save-link").addEventListener("click", function() {
    let siteName = document.getElementById("site-name").value;
    let siteUrl = document.getElementById("site-url").value;

    if (siteName && siteUrl) {
        //Skapa en ny länk
        const newLink = {
            name: siteName,
            url: siteUrl
        };

        //Hämta nuvarande länkar från localStorage och lägg till nya länken i listan
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links.push(newLink);
        localStorage.setItem('links', JSON.stringify(links));

        //Lägg till länken på sidan med renderLinks()
        renderLinks();

        //Rensa input-fält och dölj igen
        document.getElementById("site-name").value = '';
        document.getElementById("site-url").value = '';
        document.getElementById("gömd-länk").style.display = "none";
    } else {
        alert("Vänligen fyll i både namn och URL!");//alert om användaren inte fyller i fälten
    }
});


//========FUNKTIONER FÖR ATT SPARA OCH HÄMTA ANTECKNINGAR OCH NAMN=======
//spara anteckning i local storage
function sparaNotes() {
    const anteckningText = document.querySelector(".anteckning").value;
    localStorage.setItem("anteckningar", anteckningText);
}
//ladda anteckningar från local storage
function laddaNotes() {
    const sparadAnteckning = localStorage.getItem("anteckningar");
    if (sparadAnteckning) {
        document.querySelector(".anteckning").value = sparadAnteckning;
    }
}
//när sidan laddas om kallas laddaNotes, när det skrivs i anteckning-fältet kallas sparaNotes
window.addEventListener("load", laddaNotes);
document.querySelector(".anteckning").addEventListener("input", sparaNotes);


function sparaNamn() {
    const namn = document.querySelector(".namn").value;
    localStorage.setItem("valtNamn", namn);
}

function laddaNamn() {
    const sparatNamn = localStorage.getItem("valtNamn");
    if (sparatNamn) {
        document.querySelector(".namn").value = sparatNamn;
    }
}

window.addEventListener("load", laddaNamn);
document.querySelector(".namn").addEventListener("input", sparaNamn);

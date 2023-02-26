// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

// Find container
const container = document.querySelector(".flex-container");

// Find elements
const countrySelect = document.getElementById("country");
const categorySelect = document.getElementById("category");
const langSelect = document.getElementById("lang");
const searchText = document.querySelector(".search");
const button = document.querySelector(".search-btn");

button.addEventListener("click", (e) => {
  e.preventDefault();
  loadNews();
});

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

const newsService = (function () {
  const apiKey = "3e41bc58bc17842da25cc3a6355c47d4";
  const apiUrl = "https://gnews.io/api/v4";

  return {
    topHeadlines(country = "us", lang = "us", category = "business", cb = onGetResponse) {
      http.get(
		`${apiUrl}/top-headlines?category=${category}&lang=${lang}&country=${country}&max=4&apikey=${apiKey}`,
        cb
      );
    },
    everything(query = "apple", cb = onGetResponse) {
      http.get(`${apiUrl}/search?q=${query}&lang=en&country=us&max=4&apikey=${apiKey}`, cb);
    },
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  const country = countrySelect.value;
  const category = categorySelect.value;
  const search = searchText.value;
  const lang = langSelect.value;

  if (!search) {
    newsService.topHeadlines(country, lang, category, onGetResponse);
  } else {
    newsService.everything(search, onGetResponse);
  }
}

function onGetResponse(err, res) {
  if (err || !res.articles.length) {
    M.toast({ html: "no such news(" }); // error msg
    res.length = 0;
    return;
  } else {
    renderNews(res);
  }
}

function renderNews(res) {
  container.innerHTML = ""; // clear container
  let fragment = "";
  res.articles.forEach((article) => {
    fragment = fragment + newsTemplate(article);
  });
  container.insertAdjacentHTML("afterbegin", fragment);
}

function newsTemplate({ image = "img/default-img.png", title, url, description }) {
  return `
	  <div class="col s12 maxwidth">
		 <div class="card">
			<div class="card-image">
			  <img src="${image || "img/default-img.png"}">
			  <span class="card-title">${title || ""}</span>
			</div>
			<div class="card-content">
			  <p>${description || ""}</p>
			</div>
			<div class="card-action">
			  <a href="${url || ""}">Read more</a>
			</div>
		 </div>
	  </div>
	`;
}

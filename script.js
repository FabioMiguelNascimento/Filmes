let movies = [];
let allTags = new Set();

async function loadMovies() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    movies = data.movies;
    populateTable(movies);
    populateTagFilter();
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

function populateTable(moviesToShow) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  moviesToShow.forEach((movie) => {
    const row = tableBody.insertRow();
    row.id = `movie-row-${movie.id}`;
    if (movie.visto) {
      row.classList.add('strikethrough');
    }

    row.insertCell(0).textContent = movie.nome;

    const tagCell = row.insertCell(1);
    movie.tags.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.textContent = tag;
      tagSpan.classList.add("tag");
      tagSpan.classList.add(getTagClass(tag));
      tagCell.appendChild(tagSpan);
    });

    row.insertCell(2).textContent = movie.genero;

    const checkboxCell = row.insertCell(3);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = movie.visto;
    checkbox.addEventListener("change", () => updateMovieStatus(movie.id, checkbox.checked));
    checkboxCell.appendChild(checkbox);
    lazyLoadImages();
  });
}

function lazyLoadImages() {
  const images = document.querySelectorAll("img.lazy-load");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.classList.remove("lazy-load");
        imageObserver.unobserve(image);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

function updateMovieStatus(movieId, isWatched) {
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    movie.visto = isWatched;
    const row = document.getElementById(`movie-row-${movieId}`);
    if (row) {
      if (isWatched) {
        row.classList.add('strikethrough');
      } else {
        row.classList.remove('strikethrough');
      }
    }
    // Aqui você pode adicionar código para salvar as alterações no servidor, se necessário
    console.log(`Filme ${movieId} atualizado. Visto: ${isWatched}`);
  }
}

function filterMovies() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const genreFilter = document.getElementById("genreFilter").value;
  const tagFilter = document.getElementById("tagFilter").value;

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.nome.toLowerCase().includes(searchTerm);
    const matchesGenre = genreFilter === "" || movie.genero === genreFilter;
    const matchesTag = tagFilter === "" || movie.tags.includes(tagFilter);
    return matchesSearch && matchesGenre && matchesTag;
  });

  populateTable(filteredMovies);
}

function getFilteredMovies() {
  const genreFilter = document.getElementById("genreFilter").value;
  const tagFilter = document.getElementById("tagFilter").value;

  return movies.filter((movie) => {
    const matchesGenre = genreFilter === "" || movie.genero === genreFilter;
    const matchesTag = tagFilter === "" || movie.tags.includes(tagFilter);
    return matchesGenre && matchesTag;
  });
}

function showRandomSelection() {
  const filteredMovies = getFilteredMovies();

  if (filteredMovies.length === 0) {
    alert("Nenhum filme ou série encontrado com os filtros atuais.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredMovies.length);
  const randomMovie = filteredMovies[randomIndex];

  const randomContent = document.getElementById("randomContent");
randomContent.innerHTML = `
<img id="randomCover" class="randomImg" src="${randomMovie.cover}" alt="${randomMovie.nome}">
<div class="randomDiv">
    <strong id="NomeRandom">${randomMovie.nome}</strong> 
    <div class="randomTags"><strong id="TagRandom">Tags:</strong> ${randomMovie.tags.map(tag => `<span class="tag ${getTagClass(tag)}">${tag}</span>`).join(' ')}</div>
    <div class="randomGenero"><i class="fas fa-film"></i>${randomMovie.genero}</div>
</div>
`;

let constrain = 20;
let mouseOverContainer = document.getElementsByTagName('html')[0];
let randomCover = document.getElementById("randomCover");

function transforms(x, y, el) {
  let box = el.getBoundingClientRect();
  let calcX = -(y - box.y - (box.height / 2)) / constrain;
  let calcY = (x - box.x - (box.width / 2)) / constrain;
  
  return "perspective(1000px) "
    + "   rotateX("+ calcX +"deg) "
    + "   rotateY("+ calcY +"deg) ";
};

function transformElement(el, xyEl) {
  el.style.transform  = transforms.apply(null, xyEl);
}

mouseOverContainer.onmousemove = function(e) {
  let xy = [e.clientX, e.clientY];
  let position = xy.concat([randomCover]);

  window.requestAnimationFrame(function(){
    transformElement(randomCover, position);
  });
};

  document.getElementById("mainTable").style.display = "none";
  document.getElementById("randomSelection").style.display = "block";
}

function getTagClass(tag) {
  tag = tag.toLowerCase();
  switch (tag) {
    case "terror":
      return "tag-terror";
    case "comedia":
      return "tag-comedia";
    case "romance":
      return "tag-romance";
    case "suspense":
      return "tag-suspense";
    case "ficção":
    case "ficcao":
      return "tag-ficcao";
    case "ação":
    case "acao":
      return "tag-acao";
    case "desenho":
      return "tag-desenho";
    default:
      return "tag-default";
  }
}


document
  .getElementById("randomButton")
  .addEventListener("click", showRandomSelection);
document.getElementById("searchInput").addEventListener("input", filterMovies);
document.getElementById("genreFilter").addEventListener("change", filterMovies);
document.getElementById("tagFilter").addEventListener("change", filterMovies);

window.onload = loadMovies;

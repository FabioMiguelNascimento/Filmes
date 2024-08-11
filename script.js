let movies = [];
let allTags = new Set();

async function loadMovies() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        movies = data.movies;
        populateTable(movies);
        populateTagFilter();
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

function populateTable(moviesToShow) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    moviesToShow.forEach(movie => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = movie.nome;
        row.insertCell(1).textContent = movie.tags.join(', ');
        row.insertCell(2).textContent = movie.genero;
    });
}

function populateTagFilter() {
    movies.forEach(movie => {
        movie.tags.forEach(tag => allTags.add(tag));
    });

    const tagFilter = document.getElementById('tagFilter');
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

function filterMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.nome.toLowerCase().includes(searchTerm);
        const matchesGenre = genreFilter === '' || movie.genero === genreFilter;
        const matchesTag = tagFilter === '' || movie.tags.includes(tagFilter);
        return matchesSearch && matchesGenre && matchesTag;
    });

    populateTable(filteredMovies);
}

function showRandomSelection() {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    
    const randomSelection = document.getElementById('randomSelection');
    randomSelection.innerHTML = `
        <strong id="NomeRandom">${randomMovie.nome}</strong> <br>
        <br>
        <strong id="TagRandom">Tags:</strong> ${randomMovie.tags.map(tag => `<span class="tag ${getTagClass(tag)}">${tag}</span>`).join(' ')}<br>
        <strong id="GeneroRandom">Gênero:</strong> ${randomMovie.genero}
    `;

    document.getElementById('mainTable').style.display = 'none';
    document.getElementById('randomSelection').style.display = 'block';
}
function populateTable(moviesToShow) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    moviesToShow.forEach(movie => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = movie.nome;
        
        const tagCell = row.insertCell(1);
        movie.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.classList.add('tag');
            tagSpan.classList.add(getTagClass(tag));
            tagCell.appendChild(tagSpan);
        });
        
        row.insertCell(2).textContent = movie.genero;
    });
}

function getTagClass(tag) {
    tag = tag.toLowerCase();
    switch (tag) {
        case 'terror':
            return 'tag-terror';
        case 'comedia':
            return 'tag-comedia';
        case 'romance':
            return 'tag-romance';
        case 'suspense':
            return 'tag-suspense';
        case 'ficção':
        case 'ficcao':
            return 'tag-ficcao';
        case 'ação':
        case 'acao':
            return 'tag-acao';
        case 'desenho':
            return 'tag-desenho';
        default:
            return 'tag-default';
    }
}



document.getElementById('randomButton').addEventListener('click', showRandomSelection);
document.getElementById('searchInput').addEventListener('input', filterMovies);
document.getElementById('genreFilter').addEventListener('change', filterMovies);
document.getElementById('tagFilter').addEventListener('change', filterMovies);

window.onload = loadMovies;
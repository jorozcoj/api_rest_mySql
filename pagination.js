//variables de la paginación
const movieList = document.querySelector("#movie-list");
const backButton = document.querySelector("#back");
const nextButton = document.querySelector("#next");
const infoPage = document.querySelector('#page-info')
const movieTitle = document.querySelector("#movie-title");
const movDescr = document.querySelector("#movie-description");
const elementsBypage = 3;
let currentPage = 1;
const movies = [];


function nextPage(){
    currentPage+1
    render()
}

function backPage() {
	currentPage = currentPage - 1;
	render();
}

/**
 * Función que devuelve los datos de la página deseada
 */
function getPieceOfMovies(page = 1) {
	const initialCort = (currentPage - 1) * elementsBypage;
	const finalCort = initialCort + elementsBypage;
	return movies.slice(initialCort, finalCort);
}

/**
 * Función que devuelve el número total de páginas disponibles
 * @return {Int}
 */
function getTotalPages() {
	return Math.ceil(movies.length / elementsBypage);
}

/**
 * Función que gestiona los botones del paginador habilitando o
 * desactivando dependiendo de si nos encontramos en la primera
 * página o en la última.
 * @return void
*/
function buttonActions() {
	// Comprobar que no se pueda retroceder
	if (currentPage === 1) {
		backButton.setAttribute("disabled", true);
	} else {
		backButton.removeAttribute("disabled");
	}
	// Comprobar que no se pueda avanzar
	if (currentPage === getTotalPages()) {
		nextButton.setAttribute("disabled", true);
	} else {
		nextButton.removeAttribute("disabled");
	}
}

/**
 * Función que se encarga de dibujar el nuevo DOM a partir de las variables
 
 */
function render() {
	// Limpiamos los artículos anteriores del DOM
	movieList.innerHTML = "";
	// Obtenemos los artículos paginados
	const pieceOfData = getPieceOfMovies(currentPage);
	//// Dibujamos
	// Deshabilitar botones pertinentes (retroceder o avanzar página)
	buttonActions();
	// Informar de página actual y páginas disponibles
	infoPage.textContent = `${currentPage}/${getTotalPages()}`;
	// Crear un artículo para cada elemento que se encuentre en la página actual
	pieceOfData.forEach(function (dataMovies) {
		// Clonar la plantilla de artículos
		const myMovie = plantillaArticulo.cloneNode(true);
		// Rellenamos los datos del nuevo artículo
		const movieTitle = myMovie.querySelector("#titulo");
		movieTitle.textContent = dataMovies.title;
		const description = myMovie.querySelector("#cuerpo");
		description.textContent = dataMovies.body;
		// Lo insertamos dentro de "listadoArticulosDOM"
		movieList.appendChild(myMovie);
	});
}

// --
// Eventos
// --
backButton.addEventListener("click", backPage);
nextButton.addEventListener("click", nextPage);

// --
// Inicio
// --
render(); // Mostramos la primera página nada más que carge la página

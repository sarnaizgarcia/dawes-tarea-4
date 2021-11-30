/**
 * Hace la request a la url especificada
 * @param {string} url 
 * @param {string} mimeType
 * @returns Promesa que se resuelve con los datos del pedido
 */
function doRequest(url, mimeType) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      mimeType: mimeType,
      error: (request, status, error) => {
        reject(`Error ${status}: ${error}`);
      },
      success: (data) => {
        resolve(data);
      }
    })
  });
}

/**
 * Hace la request del tamaño de las pizzas y sus pecios
 * @returns Promesa de la llamada doRequest
 */
function getDataPizzaSizes() {
  return doRequest('resources/pizza-sizes.json', 'application/json');
}

/**
 * Hace la request de los ingredientes de las pizzas y sus precios
 * @returns Promesa de la llamada doRequest
 */
function getDataIngredients() {
  return doRequest('resources/ingredients.json', 'application/json');
}
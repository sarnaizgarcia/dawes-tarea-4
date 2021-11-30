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


function getDataPizzaSizes() {
  return doRequest('resources/pizza-sizes.json', 'application/json');
}

function getDataIngredients() {
  return doRequest('resources/ingredients.json', 'application/json');
}
async function getEntityDataPizzaSizes() {
  const pizzaSizesData = await getDataPizzaSizes();

  if (!pizzaSizeValidation(pizzaSizesData)) {
    throw new Error('Validation Error: Wront data from server');
  }

  return pizzaSizesData
}


function getEntityPizzaSizes() {
  return getEntityDataPizzaSizes()
    .then((data) => Object.keys(data))
}

function getEntityPizzaSizesPrices() {
  return getEntityDataPizzaSizes();
}

async function getEntityDataIngredients() {
  const ingredientsData = await getDataIngredients();

  if (!ingredientsValidation(ingredientsData)) {
    throw new Error('Validation Error: Wrong data from Server');
  }

  return ingredientsData;
}

function getEntityIngredients() {
  return getEntityDataIngredients()
    .then((data) => Object.keys(data))
}

function getEntityIngredientsPrices() {
  return getEntityDataIngredients();
}


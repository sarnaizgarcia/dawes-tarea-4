/**
 * Valida que haya tamaños
 * @returns 
 */
async function getEntityDataPizzaSizes() {
  const pizzaSizesData = await getDataPizzaSizes();

  if (!pizzaSizeValidation(pizzaSizesData)) {
    throw new Error('Validation Error: Wrong data from server');
  }

  return pizzaSizesData;
}

/**
 * 
 * @returns Array con los tamaños
 */
function getEntityPizzaSizes() {
  return getEntityDataPizzaSizes()
    .then((data) => Object.keys(data))
}

/**
 * 
 * @returns 
 */
function getEntityPizzaSizesPrices() {
  return getEntityDataPizzaSizes();
}

/**
 * Valida que haya ingredientes
 * @returns 
 */
async function getEntityDataIngredients() {
  const ingredientsData = await getDataIngredients();
  if (!ingredientsValidation(ingredientsData)) {
    throw new Error('Validation Error: Wrong data from Server');
  }

  return ingredientsData;
}

/**
 * 
 * @returns Array con los ingredientes
 */
function getEntityIngredients() {
  return getEntityDataIngredients()
    .then((data) => Object.keys(data))
}

/**
 * 
 * @returns 
 */
function getEntityIngredientsPrices() {
  return getEntityDataIngredients();
}


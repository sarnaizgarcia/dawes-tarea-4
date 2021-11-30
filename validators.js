function priceValidator (data) {
  return !Object.values(data).find((value) => typeof value !== 'number');
}

function pizzaSizeValidation(data) {
  return priceValidator(data);
}

function ingredientsValidation(data) {
  return priceValidator(data);
}
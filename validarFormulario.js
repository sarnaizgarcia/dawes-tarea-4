const virtualForm = {
    name: {
        value: '',
        dirty: false,
    },
    address: {
        value: '',
        dirty: false,
    },
    phone: {
        value: '',
        dirty: false,
    },
    email: {
        value: '',
        dirty: false,
    },
    pizzaSize: {
        value: '',
    },
    ingredients: {
        value: [],
    }
}

/**
 * Funciones auxiliares
 */

function firstCapLocks(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Obtiene el precio según el tamaño de la pizza y le añade el precio de los ingredientes.
 * @param {Object} formData 
 * @returns 
 */
function getTotalBill(formData, pizzaSizesData, ingredientsData) {
    const basePrice = pizzaSizesData[formData.pizzaSize.value];

    return formData.ingredients.value.reduce((acc, ingredient) => acc + ingredientsData[ingredient], basePrice);
}

/**
 * Crea un elemento div al que añade el texto y estilos de la línea.
 * @param {String} description 
 * @param {Number} price 
 * @param {Boolean} total 
 * @returns HTMLDivElement
 */
function createLine(jqueryElement, description, price, total) {
    const BILL_LINE_CLASS = 'bill-line'
    const LINE_DESCRIPTION_CLASS = 'bill-description'
    const LINE_PRICE_CLASS = 'bill-price';
    const LINE_TOTAL_CLASS = 'total';

    const billLine = $('<div>').addClass(BILL_LINE_CLASS).appendTo(jqueryElement);

    const lineDescription = $('<div>')
        .addClass(LINE_DESCRIPTION_CLASS)
        .text(firstCapLocks(description))
        .appendTo(billLine);

    const linePrice = $('<div>')
        .addClass(LINE_PRICE_CLASS)
        .text(`${price} €`)
        .appendTo(billLine);

    if (total) {
        billLine.addClass(LINE_TOTAL_CLASS);
        lineDescription.addClass(LINE_TOTAL_CLASS);
        linePrice.addClass(LINE_TOTAL_CLASS);
    }
}

/**
 * Recibe un objeto y muestra el total de la cuenta.
 * @param {Object} formData 
 */
function renderBill(formData, pizzaSizesData, ingredientsData) {
    const billDetails = $('.modal.bill .bill-set .bill-details');
    const basePrice = pizzaSizesData[formData.pizzaSize.value];

    billDetails.empty();

    createLine(billDetails, formData.pizzaSize.value, basePrice, false);
    for (const ingredient of formData.ingredients.value) {
        createLine(billDetails, ingredient, ingredientsData[ingredient], false);
    }

    createLine(billDetails, 'Total', getTotalBill(formData, pizzaSizesData, ingredientsData), true);

}

function createOptionField(jqueryElement, type, value) {
    const optionField = $('<div>')
        .addClass('option-field')
        .appendTo(jqueryElement);
    $('<input>')
        .addClass(`${(type === 'radio') ? 'radio-input': 'check-input' }`)
        .prop('type', type)
        .prop('name', (type === 'radio') ? 'size' : value)
        .prop('value', value)
        .on('change', (type === 'radio') ? onInputPizzaSizeChange: onInputIngredientsChange)
        .appendTo(optionField);
    
    $('<label>')
        .addClass(`option-label`)
        .text(firstCapLocks(value))
        .appendTo(optionField);
}

function createPizzaSizeOptions(data) {
    const pizzaSizeOptions = $('#field-pizza-size');
    $('#field-pizza-size .loading').remove();

    for (const size of data) {
        createOptionField(pizzaSizeOptions, 'radio', size);
    }
    $('<div>')
        .addClass('text-error')
        .appendTo(pizzaSizeOptions);
}

function createIngredientsOptions(data) {
    const ingredientsOptions =$('#field-pizza-ingredients');
    $('#field-pizza-ingredients .loading').remove();

    for (const ingredient of data) {
        createOptionField(ingredientsOptions, 'checkbox', ingredient);
    }
    $('<div>')
        .addClass('text-error')
        .appendTo(ingredientsOptions);
}

function openErrorMessage(error) {
    const modalError = $('.modal.error');
    console.error(error);
    modalError.addClass('open');

    $('html, body').animate({
        scrollTop: modalError.offset().top - 100
    }, 1000);
}

function requestListPizzaSizes() {
    getEntityPizzaSizes()
    .then(createPizzaSizeOptions)
    .catch(openErrorMessage);
}

function requestListIngredients() {
    getEntityIngredients()
    .then(createIngredientsOptions)
    .catch(openErrorMessage);
}

/**
 * Errores de validación 
 */

/**
 * Comprueba si un valor es un string vacío.
 * @param value 
 * @returns Nulo si el valor no es un string vacío y un mensaje si lo es..
 */
function fieldRequiredError(value) {
    return (value === '') ? 'The field is required' : null;
}

/**
 * Comprueba si un valor comienza con mayúsculas.
 * @param value 
 * @returns Nulo si el valor comienza con mayúsculas y un mensaje si no comienza con mayúsculas.
 */
function nameValidationFieldError(value) {
    const NAME_VALIDATION = /^[A-Z].*$/;

    return (!NAME_VALIDATION.test(value)) ? 'The name must start with caplocks' : null;
}

/**
 * Comprueba si un valor tiene el formato XXX XXX XXX.
 * @param value 
 * @returns Nulo si el valor tiene ese formato y un mensaje si no lo tiene. 
 */
function phoneValidationFieldError(value) {
    const PHONE_VALIDATION = /^[0-9]{3} [0-9]{3} [0-9]{3}$/;

    return (!PHONE_VALIDATION.test(value)) ? 'Wrong phone format': null;
}

/**
 * Valida si un email tiene el formato corecto.
 * @param {*} email 
 * @returns Nulo si tiene el formato correcto y un mensaje si no lo tiene.
 */
function emailValidationFieldError(email) {
    const EMAIL_VALIDATION = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (!EMAIL_VALIDATION.test(email)) ? 'Wrong email format' : null;
}

/**
 * Validación de formulario 
 */

/**
 * Valida que el valor del campo input del nombre tenga no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getNameValidationError(value) {
    return fieldRequiredError(value) || nameValidationFieldError(value);
}

/**
 * Valida que el valor del campo input de la dirección no esté vacio
 * @param value 
 * @returns {boolean}
 */
function getAddressValidationError(value) {
    return fieldRequiredError(value);
}

/**
 * Valida que el valor del campo input del teléfono no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getPhoneValidationError(value) {
    return fieldRequiredError(value) || phoneValidationFieldError(value);
}

/**
 * Valida que el valor del campo email del teléfono no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getEmailValidationError(value) {
    return fieldRequiredError(value) || emailValidationFieldError(value);
}

/**
 * Valida que se haya eligido un tamaño de pizza.
 * @param value 
 * @returns Devuelve nulo si se ha elegido un tamaño y un mensaje si no se ha elegido.
 */
function getPizzaSizeValidationError(value) {
    let result = null;

    if (fieldRequiredError(value)) {
        result = 'You must choose a pizza size';
    }

    return result;
}

/**
 * Valida que se haya al menos un ingrediente de la pizza.
 * @param listValues
 * @returns Devuelve nulo si se ha elegido algún ingrediente y un mensaje si no se ha elegido ninguno.
 */
function getPizzaIngredientsValidationError(listValues) {
    let result = null;

    if (listValues.length === 0) {
        result = 'You must choose, at least, one ingredient';
    }

    return result;
}

/**
 * Comprueba si todas las validaciones se cumplen.
 * @returns {boolean}
 */
function disableSubmitButton() {
    return getNameValidationError(virtualForm.name.value)
        || getAddressValidationError(virtualForm.address.value)
        || getPhoneValidationError(virtualForm.phone.value)
        || getEmailValidationError(virtualForm.email.value)
        || getPizzaSizeValidationError(virtualForm.pizzaSize.value)
        || getPizzaIngredientsValidationError(virtualForm.ingredients.value);
}

/**
 * Hooks de eventos
 */

/**
 * Pone el atributo disabled del botón de envío en función del resultado de la función
 * disableSubmitButton.
 */
function disableEnableSubmit() {
   $('.pizza-form .buttons-set .btn.primary').prop('disabled', !!disableSubmitButton())
}

/**
 * Comprueba si hay algún error de validación del nombre, lo incluye en el DOM
 * y llama a la función que desabilita el botón de envío.    
 * @param {Event} event 
 */
function onInputNameChange(event) {
    const errorField = $('#field-name .text-error');
    const error = getNameValidationError(event.target.value);
    virtualForm.name.value = event.target.value;

    if (virtualForm.name.dirty && error) {
        errorField.text(error);
    } else {
        errorField.empty();
    }

    disableEnableSubmit();
}

/**
 * Cuando el campo input nombre pierde el foco, pone el valor de la propiedad "dirty"
 * del campo a true y llama a la función onInputNameChange.
 * @param {Event} event 
 */
function onInputNameBlur(event) {
    virtualForm.name.dirty = true;
    onInputNameChange(event);
}

/**
 * Comprueba si hay algún error de validación de la dirección, lo incluye en el DOM
 * y llama a la función que desabilita el botón de envío.
 * @param {Event} event 
 */
function onInputAddressChange(event) {
    const errorField = $('#field-address .text-error');
    const error = getAddressValidationError(event.target.value);
    virtualForm.address.value = event.target.value;

    if (virtualForm.address.dirty && error) {
        errorField.text(error);
    } else {
        errorField.empty();
    }

    disableEnableSubmit();
}

/**
 * Cuando el campo input dirección pierde el foco, pone el valor de la propiedad "dirty"
 * del campo a true y llama a la función onInputAddressChange.
 * @param {Event} event 
 */
function onInputAddressBlur(event) {
    virtualForm.address.dirty = true;
    onInputAddressChange(event);
}

/**
 * Comprueba si hay algún error de validación del teléfono, lo incluye en el DOM
 * y llama a la función que desabilita el botón de envío.
 * @param {Event} event 
 */
function onInputPhoneChange(event) {
    const errorField = $('#field-phone .text-error');
    const error = getPhoneValidationError(event.target.value);
    virtualForm.phone.value = event.target.value;

    if(virtualForm.phone.dirty && error) {
        errorField.text(error);
    } else {
        errorField.empty();
    }

    disableEnableSubmit();
}

/**
 * Cuando el campo input teléfono pierde el foco, pone el valor de la propiedad "dirty"
 * del campo a true y llama a la función onInputPhoneChange.
 * @param {Event} event 
 */
function onInputPhoneBlur(event) {
    virtualForm.phone.dirty = true;
    onInputPhoneChange(event);
}

/**
 * Comprueba si hay algún error de validación del email, lo incluye en el DOM
 * y llama a la función que desabilita el botón de envío.
 * @param {Event} event 
 */
function onInputEmailChange(event) {
    const errorField = $('#field-email .text-error');
    const error = getEmailValidationError(event.target.value);
    virtualForm.email.value = event.target.value;

    if (virtualForm.email.dirty && error) {
        errorField.text(error);
    } else {
        errorField.empty();
    }

    disableEnableSubmit();
}

/**
 * Cuando el campo input email pierde el foco, pone el valor de la propiedad "dirty"
 * del campo a true y llama a la función onInputEmailChange.
 * @param {Event} event 
 */
function onInputEmailBlur(event) {
    virtualForm.email.dirty = true;
    onInputEmailChange(event);
}

/**
 * Comprueba si el elemento tiene la propiedad de checked 
 * y si es así, lo añade a la como atributo del objeto virtualForm.
 * Después llama a la función que deshabilita el botón de envío.
 * @param {Event} event 
 */
function onInputPizzaSizeChange(event) {
    if (event.target.checked) {
        virtualForm.pizzaSize.value = event.target.value;
    }

    disableEnableSubmit();
}

/**
 * Si el elemento está checked, lo añade al array de ingredientes de virtualForm.
 * Si hay error lo incluye en el DOM y llama a la función que deshabilita el botón de envío.
 * @param {Evento} event 
 */
function onInputIngredientsChange(event) {
    const ingredient = event.target.value;
    const errorField = $('#field-pizza-ingredients .text-error');

    if (event.target.checked) {
        virtualForm.ingredients.value.push(ingredient);
    } else {
        virtualForm.ingredients.value = virtualForm.ingredients.value.filter((ing) => ing !== ingredient);
    }

    const error = getPizzaIngredientsValidationError([...virtualForm.ingredients.value]);

    if (error) {
        errorField.text(error);
    } else {
        errorField.empty();
    }

    disableEnableSubmit();
}

/**
 * Retorna el objeto virtualForm a su estado inicial.
 */
function onResetButton() {
   for (const key in virtualForm) {
       switch(key) {
           case 'ingredients':
               virtualForm[key].value = [];
            break;
            case 'pizzaSize':
                virtualForm[key].value = '';
            break;
            case 'name':
            case 'address':
            case 'phone':
            case 'email':
                virtualForm[key].value = '';
                virtualForm[key].dirty = false;
            break;
       }
   }

   disableEnableSubmit();
}

/**
 * Elimina el comportamiento por defecto del botón, crea la modal con los datos 
 * correspondientes y añade los estilos que la muestran.
 * @param {Evento} event 
 */
function onSubmitEvent(event) {
    event.preventDefault();
    const modal = $('.modal.bill');

    modal.addClass('open');

    $('html, body').animate({
        scrollTop: modal.offset().top - 100
    }, 1000);

    Promise.all([getEntityPizzaSizesPrices(), getEntityIngredientsPrices()])
        .then((data) => {
            renderBill(virtualForm, ...data);
        })
        .catch((error) => {
            modal.removeClass('open');
            openErrorMessage(error);
        });
}

/**
 * Cierra la ventana modal en la que se calcula el precio.
 * Elimina los estilos que muestran la modal 
 *  y el texto del nodo que contien los detalles del pago.
 */
function onModalClose() {
    const modal = $('.modal.bill');
    const billDetails = $('.modal.bill .bill-set .bill-details');
    modal.removeClass('open');
    billDetails.empty();
}

function onRefreshPizzaSizes() {
    $('#field-pizza-size .option-field').remove();
    requestListPizzaSizes();
}

function onRefreshIngredients() {
    $('#field-pizza-ingredients .option-field').remove();
    requestListIngredients();
}

function onRefreshAll() {
    onRefreshIngredients();
    onRefreshPizzaSizes();
}

requestListPizzaSizes();
requestListIngredients();

// Registro de los eventos que se lanzan cuando se rellena el campo nombre
// y cuando este pierde el foco.
$('#field-name input').on('input', onInputNameChange).on('blur', onInputNameBlur)

// Registro de los eventos que se lanzan cuando se rellena el campo dirección
// y cuando este pierde el foco.
$('#field-address input').on('input', onInputAddressChange).on('blur', onInputAddressBlur);

// Registro de los eventos que se lanzan cuando se rellena el campo teléfono
// y cuando este pierde el foco.
$('#field-phone input').on('input', onInputPhoneChange).on('blur', onInputPhoneBlur);

// Registro de los eventos que se lanzan cuando se rellena el campo email
// y cuando este pierde el foco.
$('#field-email input').on('input', onInputEmailChange).on('blur', onInputEmailBlur);

// Registro del evento que se lanza cuando se clica el botón Reset
$('.pizza-form .buttons-set .btn.secondary').click(onResetButton);

// Registro del evento que se lanza cuando se clica el botón de Envío
$('.pizza-form').on('submit', onSubmitEvent);

// Registro del evento que se ejecuta al cerrar la ventana modal
$('.modal.bill .buttons-set .btn').click(onModalClose);

$('.modal.error .buttons-set.error .btn').click(onRefreshAll);

$('#field-pizza-size .btn').click(onRefreshPizzaSizes);

$('#field-pizza-ingredients .btn').click(onRefreshIngredients);

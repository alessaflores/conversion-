// API URL para obtener los tipos de cambio en tiempo real
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');

// Función para cargar todas las monedas en los select
function loadCurrencies() {
    fetch(`${API_URL}USD`)  // Usamos USD como base para obtener todas las monedas
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            populateSelect(fromCurrencySelect, currencies);
            populateSelect(toCurrencySelect, currencies);
        })
        .catch(error => {
            console.error('Error al cargar las monedas:', error);
            document.getElementById('result').innerHTML = 'Hubo un error al cargar las monedas. Inténtalo de nuevo.';
        });
}

// Función para llenar los selects con las monedas disponibles
function populateSelect(selectElement, currencies) {
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        selectElement.appendChild(option);
    });
}

// Llama a la función para cargar las monedas cuando la página se carga
document.addEventListener('DOMContentLoaded', loadCurrencies);

// Evento del botón para realizar la conversión
document.getElementById('convertButton').addEventListener('click', () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = document.getElementById('amount').value;

    if (amount === '' || amount <= 0) {
        document.getElementById('result').innerHTML = 'Por favor, ingresa una cantidad válida';
        return;
    }

    // Realiza la solicitud a la API de tipos de cambio
    fetch(`${API_URL}${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            if (!data.rates[toCurrency]) {
                document.getElementById('result').innerHTML = 'Moneda no soportada';
                return;
            }
            const rate = data.rates[toCurrency];
            const result = (amount * rate).toFixed(2);
            document.getElementById('result').innerHTML = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = 'Hubo un error con la conversión. Inténtalo de nuevo.';
        });
});

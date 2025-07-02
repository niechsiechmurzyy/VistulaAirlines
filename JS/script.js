// ====== Zmienne globalne dla liczby pasażerów ======
let adultsCount = 1;
let teensCount = 0;
let childrenCount = 0;
let infantsSeatCount = 0;
let infantsLapCount = 0;
let selectedClass = 'economy'; // Domyślnie wybrana klasa

// ====== Funkcje otwierania/zamykania modalu ======
const passengerModal = document.getElementById('passengerModal');
const openPassengerModalBtn = document.getElementById('openPassengerModal');

// Ukryj modal na początku
passengerModal.style.display = 'none';

openPassengerModalBtn.addEventListener('click', () => {
    passengerModal.style.display = 'flex'; // Użyj 'flex' do centrowania
});

function closePassengerModal() {
    passengerModal.style.display = 'none';
}

// Zamknięcie modalu po kliknięciu poza jego zawartością (na overlay)
passengerModal.addEventListener('click', (event) => {
    if (event.target === passengerModal) {
        closePassengerModal();
    }
});

// ====== Obsługa wyboru klasy podróży ======
document.querySelectorAll('.class-button').forEach(button => {
    button.addEventListener('click', () => {
        // Usuń 'selected' ze wszystkich przycisków
        document.querySelectorAll('.class-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        // Dodaj 'selected' do klikniętego przycisku
        button.classList.add('selected');
        selectedClass = button.dataset.class; // Zapisz wybraną klasę
        console.log('Wybrana klasa:', selectedClass);
    });
});

// ====== Obsługa stepperów pasażerów ======
document.querySelectorAll('.stepper-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const type = event.target.dataset.type;
        const action = event.target.dataset.action;
        let currentCount;
        let countElement;

        switch (type) {
            case 'adults':
                currentCount = adultsCount;
                countElement = document.getElementById('adultsCount');
                break;
            case 'teens':
                currentCount = teensCount;
                countElement = document.getElementById('teensCount');
                break;
            case 'children':
                currentCount = childrenCount;
                countElement = document.getElementById('childrenCount');
                break;
            case 'infants-seat':
                currentCount = infantsSeatCount;
                countElement = document.getElementById('infantsSeatCount');
                break;
            case 'infants-lap':
                currentCount = infantsLapCount;
                countElement = document.getElementById('infantsLapCount');
                break;
            default:
                return;
        }

        if (action === 'increase') {
            currentCount++;
        } else if (action === 'decrease' && currentCount > 0) {
            // Dorośli muszą być co najmniej 1
            if (type === 'adults' && currentCount === 1) {
                 return; // Nie pozwól na zmniejszenie dorosłych poniżej 1
            }
            currentCount--;
        } else {
            return; // Nie rób nic, jeśli próbuje zmniejszyć poniżej 0 (poza dorosłymi)
        }

        // Zaktualizuj zmienną globalną i wyświetlany tekst
        switch (type) {
            case 'adults': adultsCount = currentCount; break;
            case 'teens': teensCount = currentCount; break;
            case 'children': childrenCount = currentCount; break;
            case 'infants-seat': infantsSeatCount = currentCount; break;
            case 'infants-lap': infantsLapCount = currentCount; break;
        }
        countElement.textContent = currentCount;
        console.log(`Liczba ${type}: ${currentCount}`);
    });
});

// ====== Funkcja po naciśnięciu "Potwierdź" ======
function confirmSelection() {
    const selection = {
        klasaPodrozy: selectedClass,
        pasazerowie: {
            dorosli: adultsCount,
            nastolatkowie: teensCount,
            dzieci: childrenCount,
            niemowletaZ miejscem: infantsSeatCount,
            niemowletaNaKolanach: infantsLapCount
        }
    };
    console.log("Potwierdzono wybór:", selection);
    alert(`Potwierdzono:
    Klasa: ${selection.klasaPodrozy}
    Dorośli: ${selection.pasazerowie.dorosli}
    Nastolatkowie: ${selection.pasazerowie.nastolatkowie}
    Dzieci: ${selection.pasazerowie.dzieci}
    Niemowlęta (miejsce): ${selection.pasazerowie.niemowletaZ miejscem}
    Niemowlęta (na kolanach): ${selection.pasazerowie.niemowletaNaKolanach}
    `);
    closePassengerModal(); // Zamknij modal po potwierdzeniu
}

// ====== Implementacja kalendarza (przykładowa - wymaga biblioteki) ======
// To jest tylko placeholder. Aby to działało, musisz użyć biblioteki Datepicker.
// Przykład użycia popularnej biblioteki jQuery UI Datepicker (jeśli masz jQuery):
/*
$(function() {
    $("#departureDate").datepicker({
        dateFormat: "yy-mm-dd", // Format daty
        minDate: 0, // Nie można wybrać daty z przeszłości
        onSelect: function(dateText, inst) {
            console.log("Wybrano datę wylotu:", dateText);
            // Tutaj możesz zapisać wybraną datę do zmiennej lub formularza
        }
    });
});
*/

// Bez jQuery UI, możesz użyć czystego JavaScriptu lub innej biblioteki.
// Poniżej bardzo prosty przykład z HTML5 date input, który działa natywnie w przeglądarkach.
// Jeśli chcesz bardziej zaawansowany kalendarz, poszukaj bibliotek takich jak flatpickr, Pikaday, lub użyj jQuery UI Datepicker.

document.addEventListener('DOMContentLoaded', () => {
    const departureDateInput = document.getElementById('departureDate');

    // Aby symulować "pokazanie się okna kalendarza" można po prostu zmienić typ inputu
    // na "date", co w nowoczesnych przeglądarkach wywoła natywny kalendarz.
    // Jeśli chcesz niestandardowy kalendarz, musisz zintegrować zewnętrzną bibliotekę.
    departureDateInput.type = 'date'; // Zmienia typ inputu na date, co aktywuje natywny kalendarz

    departureDateInput.addEventListener('change', (event) => {
        console.log("Wybrano datę wylotu (natywny kalendarz):", event.target.value);
        // Tutaj możesz przetworzyć wybraną datę
    });

    // Jeżeli chcesz, aby input date wyglądał jak zwykły input, a kalendarz pojawiał się po kliknięciu
    // musisz użyć biblioteki JS. Bez niej input type="date" zawsze będzie miał małą ikonkę kalendarza.
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');

    // Airport and Date select inputs
    const departureAirportInput = document.getElementById('departureAirport');
    const arrivalAirportInput = document.getElementById('arrivalAirport');
    const departureDateInput = document.getElementById('departureDate');

    // Passenger & Class Modal elements
    const passengerClassInput = document.getElementById('passengerClassInput');
    const passengerModal = document.getElementById('passengerModal');
    const closeModalButton = passengerModal.querySelector('.close-button');
    const confirmModalButton = passengerModal.querySelector('.confirm-button');
    const classOptions = passengerModal.querySelectorAll('.class-option');
    
    // Passenger quantity controls
    const adultsQuantity = document.getElementById('adultsQuantity');
    const teensQuantity = document.getElementById('teensQuantity');
    const childrenQuantity = document.getElementById('childrenQuantity');
    const infantsWithSeatQuantity = document.getElementById('infantsWithSeatQuantity');
    const infantsLapQuantity = document.getElementById('infantsLapQuantity');

    // Initial values for passengers and class
    let currentAdults = parseInt(adultsQuantity.textContent);
    let currentTeens = parseInt(teensQuantity.textContent);
    let currentChildren = parseInt(childrenQuantity.textContent);
    let currentInfantsWithSeat = parseInt(infantsWithSeatQuantity.textContent);
    let currentInfantsLap = parseInt(infantsLapQuantity.textContent);
    let selectedClass = passengerModal.querySelector('.class-option.selected').dataset.class;

    // Funkcja do zamykania wszystkich dropdownów, menu mobilnego i modali
    function closeAllInteractiveElements() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        if (mobileNav) {
            mobileNav.classList.remove('open');
        }
        if (departureDateInput && departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close();
        }
        if (passengerModal) {
            passengerModal.style.display = 'none';
        }
    }

    // Funkcja pomocnicza do przełączania dropdownów w nagłówku
    function toggleHeaderDropdown(iconElement) {
        const dropdown = iconElement.querySelector('.dropdown-content');
        closeAllInteractiveElements(); // Zamknij wszystko, zanim otworzysz ten dropdown
        if (dropdown) { 
            dropdown.classList.toggle('show');
        }
    }

    // Obsługa kliknięcia w hamburger menu
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(event) {
            closeAllInteractiveElements(); // Zamknij wszystko, zanim otworzysz menu
            mobileNav.classList.toggle('open');
            event.stopPropagation();
        });
    }

    // Obsługa kliknięcia w ikonę waluty
    if (currencyIcon) {
        currencyIcon.addEventListener('click', function(event) {
            toggleHeaderDropdown(this);
            event.stopPropagation();
        });
        currencyIcon.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                const displaySpan = currencyIcon.querySelector('span');
                if (displaySpan) {
                    displaySpan.textContent = selectedValue;
                }
                currencyIcon.querySelector('.dropdown-content').classList.remove('show');
            });
        });
    }

    // Obsługa kliknięcia w ikonę państwa/języka
    if (countryIcon) {
        countryIcon.addEventListener('click', function(event) {
            toggleHeaderDropdown(this);
            event.stopPropagation();
        });
        countryIcon.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                const selectedValue = this.dataset.value;
                const displaySpan = countryIcon.querySelector('span');
                if (displaySpan) {
                    displaySpan.textContent = selectedValue.toUpperCase(); 
                }
                countryIcon.querySelector('.dropdown-content').classList.remove('show');
            });
        });
    }

    // Obsługa kliknięcia w ikonę konta
    if (accountIcon) {
        accountIcon.addEventListener('click', function(event) {
            toggleHeaderDropdown(this);
            event.stopPropagation();
        });
    }

    // Zamykanie wszystkich wysuwanych elementów po kliknięciu poza nimi
    document.addEventListener('click', function(event) {
        const isClickInsideHeader = event.target.closest('header');
        const isClickInsideSearchForm = event.target.closest('.search-form');
        const isClickInsideMobileNav = event.target.closest('#mobileNav');
        const isClickInsideModal = event.target.closest('.modal-content'); // Sprawdź, czy kliknięcie wewnątrz modala

        if (!isClickInsideHeader && !isClickInsideSearchForm && !isClickInsideMobileNav && !isClickInsideModal) {
            closeAllInteractiveElements();
        }
    });

    // --- Inicjalizacja Kalendarza Flatpickr ---
    if (departureDateInput) {
        flatpickr(departureDateInput, {
            mode: "range", 
            minDate: "today", 
            maxDate: new Date().fp_incr("1 year"), 
            dateFormat: "d.m.Y", 
            locale: "pl", 
            onOpen: function(selectedDates, dateStr, instance) {
                closeAllInteractiveElements(); // Zamknij inne elementy przed otwarciem kalendarza
            },
            onChange: function(selectedDates, dateStr, instance) {
                // Ta funkcja wykonuje się, gdy data zostanie zmieniona
                // Możesz dodać logikę aktualizacji pola input, jeśli Flatpickr nie robi tego automatycznie
                // np. if (selectedDates.length === 2) { departureDateInput.value = dateStr; }
            }
        });
    }

    // --- Dane dla lotnisk i funkcja ich wyświetlania ---
    const airportsData = {
        "Polska": [
            "Warszawa-Chopin (WAW)", "Kraków (KRK)", "Gdańsk (GDN)", "Katowice (KTW)", 
            "Wrocław (WRO)", "Modlin (WMI)", "Poznań (POZ)", "Łódź (LCJ)", 
            "Szczecin (SZZ)", "Lublin (LUZ)", "Rzeszów (RZE)", "CPK (Lotnisko Centralne) - w budowie"
        ],
        "Niemcy": [
            "Berlin (BER)", "Monachium (MUC)", "Frankfurt (FRA)", "Düsseldorf (DUS)", 
            "Hamburg (HAM)", "Kolonia/Bonn (CGN)"
        ],
        "Wielka Brytania": [
            "Londyn-Heathrow (LHR)", "Londyn-Gatwick (LGW)", "Londyn-Stansted (STN)", 
            "Manchester (MAN)", "Birmingham (BHX)"
        ],
        "Francja": [
            "Paryż-CDG (CDG)", "Paryż-Orly (ORY)", "Nicea (NCE)", "Marsylia (MRS)"
        ]
    };

    function createAirportDropdown(inputElement) {
        const dropdown = document.createElement('div');
        dropdown.classList.add('airport-dropdown-content', 'dropdown-content');

        for (const country in airportsData) {
            const countryHeader = document.createElement('div');
            countryHeader.classList.add('dropdown-country-header');
            countryHeader.textContent = country;
            dropdown.appendChild(countryHeader);

            airportsData[country].forEach(airport => {
                const airportItem = document.createElement('div');
                airportItem.classList.add('dropdown-item');
                airportItem.textContent = airport;
                airportItem.addEventListener('click', (event) => {
                    inputElement.value = airport;
                    dropdown.classList.remove('show');
                    event.stopPropagation(); 
                });
                dropdown.appendChild(airportItem);
            });
        }
        inputElement.closest('.input-container').appendChild(dropdown);

        inputElement.addEventListener('click', (event) => {
            closeAllInteractiveElements(); 
            dropdown.classList.toggle('show'); 
            event.stopPropagation(); 
        });
        
        // Zamykanie dropdownu po kliknięciu poza nim, ale wewnątrz input-container
        document.addEventListener('click', function(event) {
            const inputContainer = inputElement.closest('.input-container');
            if (inputContainer && !inputContainer.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Inicjalizacja dropdownów lotnisk
    createAirportDropdown(departureAirportInput);
    createAirportDropdown(arrivalAirportInput);

    // --- Logika dla Klasy Podróży i Pasażerów (Modal) ---

    // Funkcja aktualizująca tekst w input-field
    function updatePassengerClassInput() {
        let totalPassengers = currentAdults + currentTeens + currentChildren + currentInfantsWithSeat + currentInfantsLap;
        if (totalPassengers === 0) {
            passengerClassInput.value = "Dodaj pasażerów";
        } else if (totalPassengers === 1) {
            passengerClassInput.value = `${totalPassengers} Pasażer, ${selectedClass}`;
        }
        else {
            passengerClassInput.value = `${totalPassengers} Pasażerów, ${selectedClass}`;
        }
        // Możesz dodać bardziej szczegółowy opis, np.
        // passengerClassInput.value = `${currentAdults} Dorosłych, ${currentTeens} Nastolatków, ${selectedClass}`;
    }

    // Obsługa otwierania modala
    if (passengerClassInput) {
        passengerClassInput.addEventListener('click', function() {
            closeAllInteractiveElements(); // Zamknij inne elementy przed otwarciem modala
            passengerModal.style.display = 'flex'; // Ustaw na flex, aby zadziałało centrowanie
        });
    }

    // Obsługa zamykania modala przyciskiem X
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            passengerModal.style.display = 'none';
        });
    }

    // Obsługa zamykania modala przyciskiem "Potwierdź"
    if (confirmModalButton) {
        confirmModalButton.addEventListener('click', function() {
            passengerModal.style.display = 'none';
            updatePassengerClassInput(); // Zaktualizuj pole input po potwierdzeniu
        });
    }

    // Zamykanie modala po kliknięciu poza nim (na overlay)
    if (passengerModal) {
        passengerModal.addEventListener('click', function(event) {
            if (event.target === passengerModal) {
                passengerModal.style.display = 'none';
            }
        });
    }

    // Obsługa wyboru klasy podróży
    classOptions.forEach(option => {
        option.addEventListener('click', function() {
            classOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedClass = this.dataset.class;
            updatePassengerClassInput(); // Aktualizuj pole input natychmiast po zmianie klasy
        });
    });

    // Obsługa liczników pasażerów
    document.querySelectorAll('.quantity-control').forEach(control => {
        const decrementBtn = control.querySelector('.decrement');
        const incrementBtn = control.querySelector('.increment');
        const quantitySpan = control.querySelector('.quantity');
        const quantityId = quantitySpan.id; // np. 'adultsQuantity'

        decrementBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantitySpan.textContent);
            if (currentValue > 0) { // Minimalna wartość to 0
                currentValue--;
                quantitySpan.textContent = currentValue;
                updatePassengerCounts(quantityId, currentValue);
                updatePassengerClassInput();
            }
        });

        incrementBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantitySpan.textContent);
            currentValue++;
            quantitySpan.textContent = currentValue;
            updatePassengerCounts(quantityId, currentValue);
            updatePassengerClassInput();
        });
    });

    // Funkcja aktualizująca zmienne pasażerów
    function updatePassengerCounts(id, value) {
        switch(id) {
            case 'adultsQuantity':
                currentAdults = value;
                break;
            case 'teensQuantity':
                currentTeens = value;
                break;
            case 'childrenQuantity':
                currentChildren = value;
                break;
            case 'infantsWithSeatQuantity':
                currentInfantsWithSeat = value;
                break;
            case 'infantsLapQuantity':
                currentInfantsLap = value;
                break;
        }
    }

    // Początkowa aktualizacja pola input po załadowaniu strony
    updatePassengerClassInput();

});

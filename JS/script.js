document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');

    // Airport and Date select inputs
    const departureAirportInput = document.getElementById('departureAirport');
    const arrivalAirportInput = document.getElementById('arrivalAirport');
    const departureDateInput = document.getElementById('departureDate'); // Upewnij się, że ID jest poprawne

    // Passenger & Class Modal elements
    const passengerClassInput = document.getElementById('passengerClassInput');
    const passengerModal = document.getElementById('passengerModal');
    const closeModalButton = passengerModal ? passengerModal.querySelector('.close-button') : null;
    const confirmModalButton = passengerModal ? passengerModal.querySelector('.confirm-button') : null;
    const classOptions = passengerModal ? passengerModal.querySelectorAll('.class-option') : [];
    
    // Passenger quantity controls elements
    const adultsQuantity = document.getElementById('adultsQuantity');
    const teensQuantity = document.getElementById('teensQuantity');
    const childrenQuantity = document.getElementById('childrenQuantity');
    const infantsWithSeatQuantity = document.getElementById('infantsWithSeatQuantity');
    const infantsLapQuantity = document.getElementById('infantsLapQuantity');

    // Initial values for passengers and class (używamy domyślnych wartości z HTML, jeśli dostępne)
    let currentAdults = adultsQuantity ? parseInt(adultsQuantity.textContent) : 1;
    let currentTeens = teensQuantity ? parseInt(teensQuantity.textContent) : 0;
    let currentChildren = childrenQuantity ? parseInt(childrenQuantity.textContent) : 0;
    let currentInfantsWithSeat = infantsWithSeatQuantity ? parseInt(infantsWithSeatQuantity.textContent) : 0;
    let currentInfantsLap = infantsLapQuantity ? parseInt(infantsLapQuantity.textContent) : 0;
    let selectedClass = passengerModal ? (passengerModal.querySelector('.class-option.selected')?.dataset.class || 'Ekonomiczna') : 'Ekonomiczna';


    // Funkcja do zamykania wszystkich dropdownów, menu mobilnego i modali
    function closeAllInteractiveElements() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        document.querySelectorAll('.airport-dropdown-content').forEach(dropdown => { // Zamknij dropdowny lotnisk
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-expanded', 'false');
        });

        if (mobileNav) {
            mobileNav.classList.remove('open');
        }
        
        // Sprawdź, czy Flatpickr jest zainicjalizowany i otwarty
        if (departureDateInput && departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close();
        }
        
        if (passengerModal) {
            passengerModal.style.display = 'none'; // Ukryj modal
        }
    }

    // Funkcja pomocnicza do przełączania dropdownów w nagłówku
    function toggleHeaderDropdown(iconElement) {
        const dropdown = iconElement.querySelector('.dropdown-content');
        closeAllInteractiveElements(); // Zamknij wszystko, zanim otworzysz ten dropdown
        if (dropdown) { 
            dropdown.classList.add('show'); 
        }
    }

    // Obsługa kliknięcia w hamburger menu
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(event) {
            closeAllInteractiveElements(); 
            mobileNav.classList.add('open'); 
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
            item.addEventListener('click', function(event) {
                const selectedValue = this.dataset.value;
                const displaySpan = currencyIcon.querySelector('span');
                if (displaySpan) {
                    displaySpan.textContent = selectedValue;
                }
                currencyIcon.querySelector('.dropdown-content').classList.remove('show');
                event.stopPropagation(); 
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
            item.addEventListener('click', function(event) {
                const selectedValue = this.dataset.value;
                const displaySpan = countryIcon.querySelector('span');
                if (displaySpan) {
                    displaySpan.textContent = selectedValue.toUpperCase(); 
                }
                countryIcon.querySelector('.dropdown-content').classList.remove('show');
                event.stopPropagation();
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
        const isClickInsideHeaderDropdown = event.target.closest('.dropdown-content.show');
        const isClickInsideMobileNav = event.target.closest('#mobileNav.open');
        const isClickInsideAirportDropdown = event.target.closest('.airport-dropdown-content.show');
        const isClickInsideModal = event.target.closest('#passengerModal .modal-content');
        const isClickInsideFlatpickr = event.target.closest('.flatpickr-calendar');
        const isClickOnAnyInput = event.target.tagName === 'INPUT';


        if (!isClickInsideHeaderDropdown && !isClickInsideMobileNav && !isClickInsideAirportDropdown && !isClickInsideModal && !isClickInsideFlatpickr && !isClickOnAnyInput) {
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
                // Dodajemy klasę `open` po otwarciu, aby style CSS zastosowały widoczność
                instance.calendarContainer.classList.add('open'); 
                instance.redraw(); 
            },
            onClose: function(selectedDates, dateStr, instance) {
                // Usuwamy klasę `open` po zamknięciu
                instance.calendarContainer.classList.remove('open');
            }
        });
        // Dodatkowe kliknięcie na input odświeży Flatpickr i zamknie inne elementy
        departureDateInput.addEventListener('click', function(event) {
            closeAllInteractiveElements();
            if (this._flatpickr) {
                this._flatpickr.clear(); // Czyści poprzedni wybór daty
                this._flatpickr.open(); // Otwiera kalendarz
            }
            event.stopPropagation();
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
        if (!inputElement) return; // Zabezpieczenie przed brakiem elementu

        const dropdown = document.createElement('div');
        dropdown.classList.add('airport-dropdown-content'); 
        dropdown.setAttribute('aria-expanded', 'false'); 

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
                    dropdown.setAttribute('aria-expanded', 'false');
                    event.stopPropagation(); 
                });
                dropdown.appendChild(airportItem);
            });
        }
        // Sprawdź, czy inputElement ma rodzica '.input-container'
        const inputContainer = inputElement.closest('.input-container');
        if (inputContainer) {
            inputContainer.appendChild(dropdown);
        } else {
            console.error("Błąd: Element input nie znajduje się w .input-container. Nie można dodać dropdownu lotnisk.");
            return;
        }


        inputElement.addEventListener('click', (event) => {
            closeAllInteractiveElements(); 
            dropdown.classList.add('show'); 
            dropdown.setAttribute('aria-expanded', 'true');
            event.stopPropagation(); 
        });
        
        // Zamykanie dropdownu po kliknięciu poza nim
        document.addEventListener('click', function(event) {
            if (!inputContainer.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
                dropdown.setAttribute('aria-expanded', 'false');
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
    }

    // Obsługa otwierania modala
    if (passengerClassInput && passengerModal) { // Upewnij się, że oba elementy istnieją
        passengerClassInput.addEventListener('click', function(event) {
            closeAllInteractiveElements(); 
            passengerModal.style.display = 'flex'; // Ustaw na flex, aby zadziałało centrowanie
            event.stopPropagation(); 
        });
    }

    // Obsługa zamykania modala przyciskiem X
    if (closeModalButton && passengerModal) {
        closeModalButton.addEventListener('click', function(event) {
            passengerModal.style.display = 'none';
            event.stopPropagation();
        });
    }

    // Obsługa zamykania modala przyciskiem "Potwierdź"
    if (confirmModalButton && passengerModal) {
        confirmModalButton.addEventListener('click', function(event) {
            passengerModal.style.display = 'none';
            updatePassengerClassInput(); 
            event.stopPropagation();
        });
    }

    // Zamykanie modala po kliknięciu poza nim (na overlay), ale upewnij się, że nie kliknięto w modal-content
    if (passengerModal) {
        passengerModal.addEventListener('click', function(event) {
            if (event.target === passengerModal) { 
                passengerModal.style.display = 'none';
            }
        });
    }

    // Obsługa wyboru klasy podróży
    if (classOptions.length > 0) {
        classOptions.forEach(option => {
            option.addEventListener('click', function() {
                classOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedClass = this.dataset.class;
                updatePassengerClassInput(); 
            });
        });
    }


    // Obsługa liczników pasażerów
    document.querySelectorAll('.quantity-control').forEach(control => {
        const decrementBtn = control.querySelector('.decrement');
        const incrementBtn = control.querySelector('.increment');
        const quantitySpan = control.querySelector('.quantity');
        const quantityId = quantitySpan ? quantitySpan.id : null; 

        if (decrementBtn) {
            decrementBtn.addEventListener('click', function() {
                if (!quantityId) return;
                let currentValue = parseInt(quantitySpan.textContent);
                if (quantityId === 'adultsQuantity' && currentValue === 1) {
                    return; 
                }
                if (currentValue > 0) { 
                    currentValue--;
                    quantitySpan.textContent = currentValue;
                    updatePassengerCounts(quantityId, currentValue);
                    updatePassengerClassInput();
                }
            });
        }

        if (incrementBtn) {
            incrementBtn.addEventListener('click', function() {
                if (!quantityId) return;
                let currentValue = parseInt(quantitySpan.textContent);
                currentValue++;
                quantitySpan.textContent = currentValue;
                updatePassengerCounts(quantityId, currentValue);
                updatePassengerClassInput();
            });
        }
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
    // Upewnij się, że input istnieje zanim spróbujesz go zaktualizować
    if (passengerClassInput) {
        updatePassengerClassInput();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');

    //airport select inputs
    const departureAirportInput = document.getElementById('departureAirport');
    const arrivalAirportInput = document.getElementById('arrivalAirport');
    const departureDateInput = document.getElementById('departureDate');

    // Funkcja do zamykania wszystkich dropdownów i menu mobilnego
    function closeAllDropdownsAndMenus() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        if (mobileNav) {
            mobileNav.classList.remove('open');
        }
        // Zamknij kalendarz Flatpickr, jeśli jest otwarty
        if (departureDateInput && departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close();
        }
    }

    // Funkcja pomocnicza do przełączania dropdownów w nagłówku
    function toggleHeaderDropdown(iconElement) {
        const dropdown = iconElement.querySelector('.dropdown-content');
        // Zamknij wszystkie inne dropdowny i menu, ale pomiń aktualny dropdown
        document.querySelectorAll('.dropdown-content').forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('show');
            }
        });
        mobileNav.classList.remove('open'); // Zamknij menu mobilne
        if (departureDateInput && departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close(); // Zamknij kalendarz
        }
        
        if (dropdown) { 
            dropdown.classList.toggle('show');
        }
    }

    // Obsługa kliknięcia w hamburger menu
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(event) {
            mobileNav.classList.toggle('open');
            // Zamknij inne dropdowny gdy menu mobilne jest otwierane
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            if (departureDateInput && departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
                departureDateInput._flatpickr.close();
            }
            event.stopPropagation();
        });
    }

    // Obsługa kliknięcia w ikonę waluty
    if (currencyIcon) {
        currencyIcon.addEventListener('click', function(event) {
            toggleHeaderDropdown(this);
            event.stopPropagation();
        });
        // Obsługa wyboru waluty z dropdownu
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
        // Obsługa wyboru języka/kraju z dropdownu
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
        const isClickInsideMobileNav = event.target.closest('#mobileNav'); // Sprawdź, czy kliknięcie wewnątrz menu mobilnego

        // Zamknij wszystko, jeśli kliknięcie nie nastąpiło w nagłówku, formularzu ani menu mobilnym
        if (!isClickInsideHeader && !isClickInsideSearchForm && !isClickInsideMobileNav) {
            closeAllDropdownsAndMenus();
        }
    });


    // --- Inicjalizacja Kalendarza Flatpickr ---
    if (departureDateInput) {
        flatpickr(departureDateInput, {
            mode: "range", // Pozwala na wybór zakresu dat (wylot-powrót)
            minDate: "today", // Minimalna data to dziś
            maxDate: new Date().fp_incr("1 year"), // Maksymalna data to rok w przód
            dateFormat: "d.m.Y", // Format daty np. 25.07.2025
            locale: "pl", // Ustawia język na polski (wymaga dodatkowego pliku Flatpickr locale)
            onOpen: function(selectedDates, dateStr, instance) {
                closeAllDropdownsAndMenus(); // Zamknij inne dropdowny i menu, gdy otwierasz kalendarz
            },
            onChange: function(selectedDates, dateStr, instance) {
                // Ta funkcja wykonuje się, gdy data zostanie zmieniona
                if (selectedDates.length === 2) {
                    // Jeśli wybrano datę wylotu i powrotu, możesz zamknąć kalendarz
                    // instance.close(); 
                }
            }
        });
    }

    // --- Dane dla lotnisk i funkcja ich wyświetlania ---
    const airportsData = {
        "Polska": [
            "Warszawa-Chopin (WAW)",
            "Kraków (KRK)",
            "Gdańsk (GDN)",
            "Katowice (KTW)",
            "Wrocław (WRO)",
            "Modlin (WMI)",
            "Poznań (POZ)",
            "Łódź (LCJ)",
            "Szczecin (SZZ)",
            "Lublin (LUZ)",
            "Rzeszów (RZE)",
            "CPK (Lotnisko Centralne) - w budowie" 
        ],
        "Niemcy": [
            "Berlin (BER)",
            "Monachium (MUC)",
            "Frankfurt (FRA)",
            "Düsseldorf (DUS)",
            "Hamburg (HAM)",
            "Kolonia/Bonn (CGN)"
        ],
        "Wielka Brytania": [
            "Londyn-Heathrow (LHR)",
            "Londyn-Gatwick (LGW)",
            "Londyn-Stansted (STN)",
            "Manchester (MAN)",
            "Birmingham (BHX)"
        ],
        "Francja": [
            "Paryż-CDG (CDG)",
            "Paryż-Orly (ORY)",
            "Nicea (NCE)",
            "Marsylia (MRS)"
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
        // Dodaj dropdown do input-container
        inputElement.closest('.input-container').appendChild(dropdown);

        // Obsługa kliknięcia inputa
        inputElement.addEventListener('click', (event) => {
            closeAllDropdownsAndMenus(); // Zamknij inne elementy
            dropdown.classList.toggle('show'); // Pokaż/ukryj ten dropdown
            event.stopPropagation(); 
        });
        
        // Zamykanie dropdownu po kliknięciu poza nim
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

});

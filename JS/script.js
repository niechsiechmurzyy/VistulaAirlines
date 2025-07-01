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
        if (departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close();
        }
    }

    // Obsługa kliknięcia w hamburger menu
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(event) {
            mobileNav.classList.toggle('open');
            // Zamknij wszystkie inne dropdowny i kalendarz, gdy otwiera się menu mobilne
            closeAllDropdowns(); // Zostaw tylko dropdowny
            if (departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
                departureDateInput._flatpickr.close();
            }
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu na dokument
        });
    }

    // Funkcja pomocnicza do przełączania dropdownów
    function toggleDropdown(iconElement) {
        const dropdown = iconElement.querySelector('.dropdown-content');
        closeAllDropdowns(); // Zamknij inne dropdowny
        mobileNav.classList.remove('open'); // Zamknij menu mobilne
        if (departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
             departureDateInput._flatpickr.close();
        }
        if (dropdown) { // Sprawdź czy dropdown istnieje
            dropdown.classList.toggle('show');
        }
    }

    // Obsługa kliknięcia w ikonę waluty
    if (currencyIcon) {
        currencyIcon.addEventListener('click', function(event) {
            toggleDropdown(this);
            event.stopPropagation();
        });
    }

    // Obsługa kliknięcia w ikonę państwa/języka
    if (countryIcon) {
        countryIcon.addEventListener('click', function(event) {
            toggleDropdown(this);
            event.stopPropagation();
        });
    }

    // Obsługa kliknięcia w ikonę konta
    if (accountIcon) {
        accountIcon.addEventListener('click', function(event) {
            toggleDropdown(this);
            event.stopPropagation();
        });
    }

    // Zamykanie dropdownów i menu mobilnego po kliknięciu poza nimi lub poza polami formularza
    document.addEventListener('click', function(event) {
        const isClickInsideHeader = event.target.closest('header');
        const isClickInsideForm = event.target.closest('.search-form');

        if (!isClickInsideHeader && !isClickInsideForm) {
            closeAllDropdownsAndMenus();
        }
    });

    // Zapobieganie zamykaniu dropdownów po kliknięciu w ich zawartość
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
        });
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
                closeAllDropdowns(); // Zamknij dropdowny gdy otwierasz kalendarz
                mobileNav.classList.remove('open'); // Zamknij menu mobilne
            },
            onChange: function(selectedDates, dateStr, instance) {
                // Ta funkcja wykonuje się, gdy data zostanie zmieniona
                if (selectedDates.length === 2) {
                    // Jeśli wybrano datę wylotu i powrotu, możesz zamknąć kalendarz
                    instance.close();
                }
            }
        });
    }

    // --- Tymczasowe dane dla lotnisk i funkcja ich wyświetlania ---
    const airports = {
        "Polska": ["Warszawa (WAW)", "Kraków (KRK)", "Gdańsk (GDN)"],
        "Niemcy": ["Berlin (BER)", "Monachium (MUC)", "Frankfurt (FRA)"],
        "Wielka Brytania": ["Londyn (LHR)", "Manchester (MAN)"],
        "Francja": ["Paryż (CDG)", "Nicea (NCE)"]
    };

    function createAirportDropdown(inputElement, type) {
        const dropdown = document.createElement('div');
        dropdown.classList.add('airport-dropdown-content', 'dropdown-content');

        for (const country in airports) {
            const countryHeader = document.createElement('div');
            countryHeader.classList.add('dropdown-country-header');
            countryHeader.textContent = country;
            dropdown.appendChild(countryHeader);

            airports[country].forEach(airport => {
                const airportItem = document.createElement('div');
                airportItem.classList.add('dropdown-item');
                airportItem.textContent = airport;
                airportItem.addEventListener('click', () => {
                    inputElement.value = airport;
                    dropdown.classList.remove('show');
                });
                dropdown.appendChild(airportItem);
            });
        }
        inputElement.parentNode.appendChild(dropdown); // Dodaj dropdown obok inputa

        // Obsługa kliknięcia inputa
        inputElement.addEventListener('click', (event) => {
            closeAllDropdowns(); // Zamknij inne dropdowny i menu
            mobileNav.classList.remove('open');
            if (departureDateInput._flatpickr && departureDateInput._flatpickr.isOpen) {
                departureDateInput._flatpickr.close();
            }
            dropdown.classList.toggle('show');
            event.stopPropagation();
        });
    }

    // Inicjalizacja dropdownów lotnisk
    createAirportDropdown(departureAirportInput, 'departure');
    createAirportDropdown(arrivalAirportInput, 'arrival');

});

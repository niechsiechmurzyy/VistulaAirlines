document.addEventListener('DOMContentLoaded', () => {
    // === Elementy DOM ===
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    const departureAirportInput = document.getElementById('departureAirport');
    const arrivalAirportInput = document.getElementById('arrivalAirport');
    const departureDateInput = document.getElementById('departureDate');
    const passengerClassInput = document.getElementById('passengerClassInput');
    const passengerModal = document.getElementById('passengerModal');
    const closeModalButton = passengerModal ? passengerModal.querySelector('.close-button') : null;
    const confirmModalButton = passengerModal ? passengerModal.querySelector('.confirm-button') : null;

    let selectedTravelClass = 'Ekonomiczna';
    let adults = 1;
    let teens = 0;
    let children = 0;
    let infantsWithSeat = 0;
    let infantsLap = 0;

    let selectedDepartureAirport = null;
    let selectedArrivalAirport = null;

    // === Funkcje pomocnicze ===

    // Funkcja do zamykania wszystkich interaktywnych elementów
    const closeAllInteractiveElements = () => {
        document.querySelectorAll('.dropdown-content.show').forEach(el => el.classList.remove('show'));
        if (mobileNav) mobileNav.classList.remove('open');
        if (flatpickrInstance) flatpickrInstance.close();
        document.querySelectorAll('.airport-dropdown-content.show').forEach(el => el.classList.remove('show'));
        if (passengerModal) passengerModal.classList.remove('show-modal');
    };

    // Funkcja do aktualizacji tekstu w polu Pasażerowie i Klasa
    const updatePassengerClassInput = () => {
        const totalPassengers = adults + teens + children + infantsWithSeat + infantsLap;
        let passengerText = '';

        if (totalPassengers === 1) {
            passengerText = '1 Pasażer';
        } else if (totalPassengers > 1) {
            passengerText = `${totalPassengers} Pasażerów`;
        } else {
            passengerText = '0 Pasażerów'; // Should not happen if adults starts at 1
        }

        if (passengerClassInput) {
            passengerClassInput.value = `${passengerText}, ${selectedTravelClass}`;
        }
    };

    // Funkcja do generowania listy lotnisk
    const generateAirportDropdown = (inputElement, type) => {
        const airports = {
            "Polska": [
                "Warszawa (WAW)", "Kraków (KRK)", "Gdańsk (GDN)", "Wrocław (WRO)",
                "Katowice (KTW)", "Poznań (POZ)", "Łódź (LCJ)", "Szczecin (SZZ)",
                "Rzeszów (RZE)", "Lublin (LUZ)", "Bydgoszcz (BZG)", "Olsztyn (SZY)"
            ],
            "Niemcy": ["Berlin (BER)", "Monachium (MUC)", "Frankfurt (FRA)", "Hamburg (HAM)", "Düsseldorf (DUS)", "Kolonia (CGN)"],
            "Francja": ["Paryż (CDG)", "Nicea (NCE)", "Lyon (LYS)", "Marsylia (MRS)", "Tuluza (TLS)"],
            "Wielka Brytania": ["Londyn (LHR)", "Manchester (MAN)", "Edynburg (EDI)", "Birmingham (BHX)", "Glasgow (GLA)"],
            "Hiszpania": ["Madryt (MAD)", "Barcelona (BCN)", "Malaga (AGP)", "Palma de Mallorca (PMI)"],
            "Włochy": ["Rzym (FCO)", "Mediolan (MXP)", "Wenecja (VCE)", "Neapol (NAP)"],
            "USA": ["Nowy Jork (JFK)", "Los Angeles (LAX)", "Chicago (ORD)", "Miami (MIA)", "San Francisco (SFO)"],
            "Chiny": ["Pekin (PEK)", "Szanghaj (PVG)", "Guangzhou (CAN)"],
            "Indie": ["Delhi (DEL)", "Mumbaj (BOM)", "Bengaluru (BLR)"],
            "RPA": ["Johannesburg (JNB)", "Kapsztad (CPT)", "Durban (DUR)"],
            "Singapur": ["Singapur (SIN)"],
            "Rumunia": ["Bukareszt (OTP)", "Kluż-Napoka (CLJ)"]
        };

        let dropdown = inputElement.nextElementSibling;
        // Sprawdź, czy dropdown już istnieje i czy ma poprawną klasę
        if (!dropdown || !dropdown.classList.contains('airport-dropdown-content')) {
            dropdown = document.createElement('div');
            dropdown.classList.add('airport-dropdown-content');
            inputElement.parentNode.insertBefore(dropdown, inputElement.nextSibling);
        }
        dropdown.innerHTML = ''; // Wyczyść zawartość przed ponownym generowaniem

        // Przechowywanie aktualnie wybranego lotniska dla danego inputa
        let currentSelectedValue = inputElement.value;

        for (const country in airports) {
            const countryHeader = document.createElement('div');
            countryHeader.classList.add('dropdown-country-header');
            countryHeader.textContent = country;
            dropdown.appendChild(countryHeader);

            airports[country].forEach(airport => {
                const item = document.createElement('div');
                item.classList.add('dropdown-item');
                item.textContent = airport;

                item.addEventListener('click', () => {
                    inputElement.value = airport;
                    if (type === 'departure') {
                        selectedDepartureAirport = airport;
                    } else {
                        selectedArrivalAirport = airport;
                    }
                    validateAirportSelection(); // Dodana walidacja
                    dropdown.classList.remove('show');
                });
                dropdown.appendChild(item);
            });
        }
    };

    // === NOWA FUNKCJA WALIDACJI LOTNISK ===
    const validateAirportSelection = () => {
        if (selectedDepartureAirport && selectedArrivalAirport) {
            if (selectedDepartureAirport === selectedArrivalAirport) {
                alert('Lotnisko wylotu i przylotu nie może być takie samo. Proszę wybrać różne lotniska.');
                // Wyczyść pole przylotu, ponieważ to drugie zostało wybrane jako identyczne
                if (arrivalAirportInput) {
                    arrivalAirportInput.value = '';
                    selectedArrivalAirport = null;
                }
            }
        }
    };

    // === Listenery zdarzeń ===

    // Zamykanie wszystkich elementów po kliknięciu poza nimi
    document.addEventListener('click', (event) => {
        // Lista elementów, które powinny zamykać inne
        const clickableElements = [
            currencyIcon, countryIcon, accountIcon, menuToggle,
            mobileNav, departureAirportInput, arrivalAirportInput,
            departureDateInput, passengerClassInput, passengerModal
        ].filter(Boolean); // Usuń null/undefined z listy

        let isClickInsideAnyInteractiveElement = false;
        for (const el of clickableElements) {
            if (el.contains(event.target)) {
                isClickInsideAnyInteractiveElement = true;
                break;
            }
        }

        // Dodatkowo sprawdź, czy kliknięcie było wewnątrz airport-dropdown
        let isClickInsideAirportDropdown = false;
        document.querySelectorAll('.airport-dropdown-content').forEach(dropdown => {
            if (dropdown.contains(event.target)) {
                isClickInsideAirportDropdown = true;
            }
        });
        
        // Dodatkowo sprawdź, czy kliknięcie było wewnątrz Flatpickr
        let isClickInsideFlatpickr = false;
        if (flatpickrInstance && flatpickrInstance.calendarContainer) {
             if (flatpickrInstance.calendarContainer.contains(event.target)) {
                 isClickInsideFlatpickr = true;
             }
        }

        if (!isClickInsideAnyInteractiveElement && !isClickInsideAirportDropdown && !isClickInsideFlatpickr) {
            closeAllInteractiveElements();
        }
    });

    // Dropdowny waluty, kraju, konta (desktopowe)
    [currencyIcon, countryIcon, accountIcon].forEach(icon => {
        if (icon) {
            icon.addEventListener('click', (event) => {
                // Zamknij wszystkie inne dropdowny przed otwarciem nowego
                document.querySelectorAll('.dropdown-content.show').forEach(el => {
                    if (el.parentNode !== icon) { // Zamknij inne, ale nie rodzica bieżącego ikona
                        el.classList.remove('show');
                    }
                });
                closeAllInteractiveElements(); // Upewnij się, że inne typy elementów (np. mobilne menu) są zamknięte
                icon.querySelector('.dropdown-content').classList.toggle('show');
                event.stopPropagation(); // Zapobiega natychmiastowemu zamknięciu przez document click
            });

            // Obsługa kliknięcia w element dropdownu
            icon.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (event) => {
                    if (icon.id === 'currencyIcon') {
                        icon.querySelector('span').textContent = item.dataset.value;
                    } else if (icon.id === 'countryIcon') {
                        icon.querySelector('span').textContent = item.dataset.value;
                    }
                    closeAllInteractiveElements(); // Zamknij po wyborze
                    event.stopPropagation();
                });
            });
        }
    });

    // Mobilne menu
    if (menuToggle) {
        menuToggle.addEventListener('click', (event) => {
            closeAllInteractiveElements(); // Zamknij wszystko, co otwarte
            if (mobileNav) mobileNav.classList.toggle('open');
            event.stopPropagation();
        });
    }

    // Flatpickr (kalendarz)
    let flatpickrInstance = null;
    if (departureDateInput) {
        flatpickrInstance = flatpickr(departureDateInput, {
            mode: "range",
            dateFormat: "d.m.Y",
            locale: "pl",
            minDate: "today",
            onOpen: function(selectedDates, dateStr, instance) {
                closeAllInteractiveElements();
                instance.calendarContainer.style.zIndex = '99999';
                instance.calendarContainer.classList.add('open');
            },
            onClose: function(selectedDates, dateStr, instance) {
                instance.calendarContainer.classList.remove('open');
            }
        });
    }

    // Obsługa kliknięć/focusu na polach lotnisk
    if (departureAirportInput) {
        departureAirportInput.addEventListener('focus', () => {
            closeAllInteractiveElements();
            generateAirportDropdown(departureAirportInput, 'departure');
            departureAirportInput.nextElementSibling.classList.add('show');
        });
        departureAirportInput.addEventListener('click', (event) => {
            closeAllInteractiveElements();
            generateAirportDropdown(departureAirportInput, 'departure');
            departureAirportInput.nextElementSibling.classList.add('show');
            event.stopPropagation();
        });
        // Dodatkowo, aby zamykać po wyborze z listy
        departureAirportInput.nextElementSibling?.addEventListener('click', (event) => {
            if (event.target.classList.contains('dropdown-item')) {
                departureAirportInput.nextElementSibling.classList.remove('show');
            }
        });
    }

    if (arrivalAirportInput) {
        arrivalAirportInput.addEventListener('focus', () => {
            closeAllInteractiveElements();
            generateAirportDropdown(arrivalAirportInput, 'arrival');
            arrivalAirportInput.nextElementSibling.classList.add('show');
        });
        arrivalAirportInput.addEventListener('click', (event) => {
            closeAllInteractiveElements();
            generateAirportDropdown(arrivalAirportInput, 'arrival');
            arrivalAirportInput.nextElementSibling.classList.add('show');
            event.stopPropagation();
        });
        // Dodatkowo, aby zamykać po wyborze z listy
        arrivalAirportInput.nextElementSibling?.addEventListener('click', (event) => {
            if (event.target.classList.contains('dropdown-item')) {
                arrivalAirportInput.nextElementSibling.classList.remove('show');
            }
        });
    }

    // Modal Pasażerowie i Klasa
    if (passengerClassInput) {
        passengerClassInput.addEventListener('click', (event) => {
            closeAllInteractiveElements();
            if (passengerModal) passengerModal.classList.add('show-modal');
            event.stopPropagation();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (passengerModal) passengerModal.classList.remove('show-modal');
        });
    }

    if (confirmModalButton) {
        confirmModalButton.addEventListener('click', () => {
            if (passengerModal) passengerModal.classList.remove('show-modal');
            updatePassengerClassInput();
        });
    }

    // Wybór klasy podróży
    document.querySelectorAll('.travel-class-options .class-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.travel-class-options .class-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedTravelClass = option.dataset.class;
        });
    });

    // Kontrola ilości pasażerów
    document.querySelectorAll('.quantity-control button').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantitySpan = event.target.closest('.quantity-control').querySelector('.quantity');
            let currentQuantity = parseInt(quantitySpan.textContent);
            const type = quantitySpan.id;

            if (event.target.classList.contains('increment')) {
                currentQuantity++;
            } else if (event.target.classList.contains('decrement') && currentQuantity > 0) {
                currentQuantity--;
            }

            // Specjalna logika dla dorosłych (min. 1)
            if (type === 'adultsQuantity' && currentQuantity === 0) {
                currentQuantity = 1; // Zawsze musi być co najmniej 1 dorosły
            }

            quantitySpan.textContent = currentQuantity;

            // Aktualizacja zmiennych globalnych
            switch (type) {
                case 'adultsQuantity': adults = currentQuantity; break;
                case 'teensQuantity': teens = currentQuantity; break;
                case 'childrenQuantity': children = currentQuantity; break;
                case 'infantsWithSeatQuantity': infantsWithSeat = currentQuantity; break;
                case 'infantsLapQuantity': infantsLap = currentQuantity; break;
            }
        });
    });

    // Inicjalizacja wartości po załadowaniu strony
    updatePassengerClassInput();
});

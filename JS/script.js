document.addEventListener('DOMContentLoaded', () => {
    // === Elementy DOM ===
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');
    const menuToggle = document.getElementById('menuToggle'); // Hamburger menu po lewej
    const mobileNav = document.getElementById('mobileNav'); // Szufladka

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

    // Funkcja do zamykania wszystkich interaktywnych elementów (dropdownów, modali, menu mobilnego)
    const closeAllInteractiveElements = () => {
        document.querySelectorAll('.dropdown-content.show').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.airport-dropdown-content.show').forEach(el => el.classList.remove('show'));
        if (mobileNav) mobileNav.classList.remove('open');
        if (flatpickrInstance) flatpickrInstance.close();
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
                "Rzeszów (RZE)", "Lublin (LUZ)", "Bydgoszcz (BZG)", "Olsztyn (SZY)",
                "Zielona Góra (IEG)", "Radom (RDO)", "CPK (XER)"
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
        if (!dropdown || !dropdown.classList.contains('airport-dropdown-content')) {
            dropdown = document.createElement('div');
            dropdown.classList.add('airport-dropdown-content');
            inputElement.parentNode.insertBefore(dropdown, inputElement.nextSibling);
        }
        dropdown.innerHTML = '';

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
                    validateAirportSelection();
                    dropdown.classList.remove('show');
                });
                dropdown.appendChild(item);
            });
        }
    };

    // === Funkcja walidacji lotnisk ===
    const validateAirportSelection = () => {
        if (selectedDepartureAirport && selectedArrivalAirport) {
            if (selectedDepartureAirport === selectedArrivalAirport) {
                alert('Lotnisko wylotu i przylotu nie może być takie samo. Proszę wybrać różne lotniska.');
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
        const isClickInsideHeaderIcons = currencyIcon?.contains(event.target) || countryIcon?.contains(event.target) || accountIcon?.contains(event.target);
        const isClickInsideMenuToggle = menuToggle?.contains(event.target);
        const isClickInsideMobileNav = mobileNav?.contains(event.target);
        const isClickInsideAirportInput = departureAirportInput?.contains(event.target) || arrivalAirportInput?.contains(event.target);
        const isClickInsideAirportDropdown = event.target.closest('.airport-dropdown-content');
        const isClickInsideDateInput = departureDateInput?.contains(event.target);
        const isClickInsideFlatpickr = flatpickrInstance && flatpickrInstance.calendarContainer && flatpickrInstance.calendarContainer.contains(event.target);
        const isClickInsidePassengerInput = passengerClassInput?.contains(event.target);
        const isClickInsidePassengerModal = passengerModal?.contains(event.target);

        if (!(isClickInsideHeaderIcons || isClickInsideMenuToggle || isClickInsideMobileNav ||
            isClickInsideAirportInput || isClickInsideAirportDropdown || isClickInsideDateInput ||
            isClickInsideFlatpickr || isClickInsidePassengerInput || isClickInsidePassengerModal)) {
            closeAllInteractiveElements();
        }
    });

    // Obsługa dropdownów waluty, kraju, konta
    [currencyIcon, countryIcon, accountIcon].forEach(icon => {
        if (icon) {
            icon.addEventListener('click', (event) => {
                closeAllInteractiveElements(); // Zamknij inne elementy interaktywne
                icon.querySelector('.dropdown-content').classList.toggle('show');
                event.stopPropagation();
            });

            // Obsługa kliknięcia w element dropdownu
            icon.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (event) => {
                    if (icon.id === 'currencyIcon') {
                        icon.querySelector('span').textContent = item.dataset.value;
                    } else if (icon.id === 'countryIcon') {
                        icon.querySelector('span').textContent = item.dataset.value;
                    } else if (icon.id === 'accountIcon') {
                        // Tutaj można dodać logikę dla "Zaloguj się" / "Zarejestruj się"
                        console.log(`Wybrano: ${item.textContent}`);
                    }
                    closeAllInteractiveElements(); // Zamknij po wyborze
                    event.stopPropagation();
                });
            });
        }
    });

    // Mobilne menu (szufladka)
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
                currentQuantity = 1;
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

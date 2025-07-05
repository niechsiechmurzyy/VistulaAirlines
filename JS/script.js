document.addEventListener('DOMContentLoaded', () => {
    // --- Globalne zmienne i stałe ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const sections = document.querySelectorAll('main section'); // Wszystkie główne sekcje
    const dropdownToggles = document.querySelectorAll('.icon-item[id$="-dropdown-toggle"]');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav a');

    let selectedFlight = null; // Przechowuje wybrany lot
    let totalPassengers = { adults: 1, children: 0, infants: 0 };
    let travelClass = 'Ekonomiczna';
    let reservationDetails = null; // Przechowuje dane rezerwacji po potwierdzeniu

    const airports = [
        { code: 'WAW', name: 'Warszawa-Chopin', country: 'Polska' },
        { code: 'GDN', name: 'Gdańsk im. Lecha Wałęsy', country: 'Polska' },
        { code: 'KRK', name: 'Kraków-Balice im. Jana Pawła II', country: 'Polska' },
        { code: 'WRO', name: 'Wrocław-Strachowice im. Mikołaja Kopernika', country: 'Polska' },
        { code: 'POZ', name: 'Poznań-Ławica im. Henryka Wieniawskiego', country: 'Polska' },
        { code: 'KTW', name: 'Katowice-Pyrzowice', country: 'Polska' },
        { code: 'LHR', name: 'Londyn-Heathrow', country: 'Wielka Brytania' },
        { code: 'CDG', name: 'Paryż-Roissy-Charles de Gaulle', country: 'Francja' },
        { code: 'FRA', name: 'Frankfurt', country: 'Niemcy' },
        { code: 'JFK', name: 'Nowy Jork-JFK', country: 'USA' },
        { code: 'LAX', name: 'Los Angeles', country: 'USA' },
        { code: 'DXB', name: 'Dubaj', country: 'Zjednoczone Emiraty Arabskie' },
        { code: 'IST', name: 'Stambuł', country: 'Turcja' },
        { code: 'AMS', name: 'Amsterdam-Schiphol', country: 'Holandia' },
        { code: 'FCO', name: 'Rzym-Fiumicino', country: 'Włochy' },
        { code: 'MAD', name: 'Madryt-Barajas', country: 'Hiszpania' },
        { code: 'BER', name: 'Berlin Brandenburg', country: 'Niemcy' },
        { code: 'VIE', name: 'Wiedeń', country: 'Austria' },
        { code: 'PRG', name: 'Praga-Vaclav Havel', country: 'Czechy' },
        { code: 'CPH', name: 'Kopenhaga-Kastrup', country: 'Dania' },
        { code: 'OSL', name: 'Oslo-Gardermoen', country: 'Norwegia' },
        { code: 'ARN', name: 'Sztokholm-Arlanda', country: 'Szwecja' },
        { code: 'HEL', name: 'Helsinki-Vantaa', country: 'Finlandia' },
        { code: 'DUB', name: 'Dublin', country: 'Irlandia' },
        { code: 'LIS', name: 'Lizbona', country: 'Portugalia' },
        { code: 'ATH', name: 'Ateny', country: 'Grecja' },
        { code: 'ZRH', name: 'Zurych', country: 'Szwajcaria' },
        { code: 'BRU', name: 'Bruksela', country: 'Belgia' },
        { code: 'BUD', name: 'Budapeszt-Ferenc Liszt', country: 'Węgry' },
        { code: 'SOF', name: 'Sofia', country: 'Bułgaria' },
        { code: 'OTP', name: 'Bukareszt-Henri Coandă', country: 'Rumunia' },
        { code: 'RIX', name: 'Ryga', country: 'Łotwa' },
        { code: 'VNO', name: 'Wilno', country: 'Litwa' },
        { code: 'TLL', name: 'Tallinn', country: 'Estonia' },
        { code: 'KBP', name: 'Kijów-Boryspol', country: 'Ukraina' },
        { code: 'MOW', name: 'Moskwa-Szeremietiewo', country: 'Rosja' }, // Przykładowo, jeśli nadal używasz
        { code: 'SPB', name: 'Petersburg-Pułkowo', country: 'Rosja' }, // Przykładowo, jeśli nadal używasz
        { code: 'BKK', name: 'Bangkok-Suvarnabhumi', country: 'Tajlandia' },
        { code: 'SIN', name: 'Singapur-Changi', country: 'Singapur' },
        { code: 'NRT', name: 'Tokio-Narita', country: 'Japonia' },
        { code: 'PEK', name: 'Pekin-Capital', country: 'Chiny' },
        { code: 'SYD', name: 'Sydney-Kingsford Smith', country: 'Australia' },
        { code: 'GRU', name: 'São Paulo-Guarulhos', country: 'Brazylia' },
        { code: 'MEX', name: 'Meksyk-Benito Juárez', country: 'Meksyk' },
        { code: 'CPT', name: 'Kapsztad', country: 'Republika Południowej Afryki' },
        { code: 'TLV', name: 'Tel Awiw-Ben Gurion', country: 'Izrael' },
        { code: 'AMM', name: 'Amman-Queen Alia', country: 'Jordania' },
        { code: 'AUH', name: 'Abu Zabi', country: 'Zjednoczone Emiraty Arabskie' },
        { code: 'DOH', name: 'Doha-Hamad', country: 'Katar' },
        { code: 'KUL', name: 'Kuala Lumpur', country: 'Malezja' },
        { code: 'SCL', name: 'Santiago', country: 'Chile' }
    ];

    // --- Funkcje pomocnicze dla nawigacji między sekcjami ---
    function showSection(id) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(id).classList.remove('hidden');

        // Dodatkowe ukrywanie sekcji "Uzupełnij swoją podróż" i "Polecane kierunki" poza główną stroną
        const completeTripSection = document.querySelector('.complete-your-trip');
        const recommendedDestinationsSection = document.querySelector('.recommended-destinations');
        if (id === 'search-form-section') {
            completeTripSection.classList.remove('hidden');
            recommendedDestinationsSection.classList.remove('hidden');
        } else {
            completeTripSection.classList.add('hidden');
            recommendedDestinationsSection.classList.add('hidden');
        }

        // Przewiń do góry strony po zmianie sekcji
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Inicjalizacja Flatpickr ---
    flatpickr("#departure-date", {
        dateFormat: "d.m.Y",
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            // Ustaw minDate dla daty powrotu na wybraną datę odlotu
            flatpickr("#return-date", {
                dateFormat: "d.m.Y",
                minDate: dateStr
            });
        }
    });

    flatpickr("#return-date", {
        dateFormat: "d.m.Y",
        minDate: "today" // Domyślnie minDate na dziś, zostanie zaktualizowane przez departure-date
    });

    // --- Obsługa Dropdownów w nagłówku (waluta, język, konto) ---
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            const dropdownContent = this.querySelector('.dropdown-content');
            // Zamknij wszystkie inne otwarte dropdowny
            document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                if (openDropdown !== dropdownContent) {
                    openDropdown.classList.remove('show');
                }
            });
            // Przełącz widoczność klikniętego dropdownu
            dropdownContent.classList.toggle('show');
            event.stopPropagation(); // Zapobiega propagacji kliknięcia do document
        });
    });

    // Zamknij dropdowny po kliknięciu poza nimi
    document.addEventListener('click', function(event) {
        document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
            if (!dropdown.parentElement.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });

    // --- Obsługa mobilnego menu ---
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // Zamknij mobilne menu po kliknięciu linku
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            const sectionId = link.dataset.sectionId;
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // --- Obsługa modalu pasażerów i klasy podróży ---
    const passengersClassInput = document.getElementById('passengers-class-input');
    const passengersClassModal = document.getElementById('passengers-class-modal');
    const closeButton = passengersClassModal.querySelector('.close-button');
    const confirmButton = passengersClassModal.querySelector('.confirm-button');
    const travelClassOptions = passengersClassModal.querySelectorAll('.class-option');
    const quantityControls = passengersClassModal.querySelectorAll('.quantity-control button');

    passengersClassInput.addEventListener('click', () => {
        passengersClassModal.classList.add('show-modal');
    });

    closeButton.addEventListener('click', () => {
        passengersClassModal.classList.remove('show-modal');
    });

    confirmButton.addEventListener('click', () => {
        updatePassengersAndClassInput();
        passengersClassModal.classList.remove('show-modal');
    });

    window.addEventListener('click', (event) => {
        if (event.target === passengersClassModal) {
            passengersClassModal.classList.remove('show-modal');
        }
    });

    travelClassOptions.forEach(option => {
        option.addEventListener('click', function() {
            travelClassOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            travelClass = this.dataset.value;
        });
    });

    quantityControls.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const quantitySpan = document.getElementById(`${type}-qty`);
            let currentQty = parseInt(quantitySpan.textContent);

            if (this.classList.contains('increase-qty')) {
                // Logika dla dorosłych: min 1 dorosły, max 9
                if (type === 'adults') {
                    if (currentQty < 9) {
                        currentQty++;
                    }
                }
                // Logika dla dzieci i niemowląt: max 9
                else if (currentQty < 9) {
                    currentQty++;
                }
            } else if (this.classList.contains('decrease-qty')) {
                if (currentQty > 0) {
                    // Logika dla dorosłych: min 1 dorosły
                    if (type === 'adults') {
                        if (currentQty > 1) {
                            currentQty--;
                        }
                    } else { // Dzieci i niemowlęta mogą być 0
                        currentQty--;
                    }
                }
            }
            quantitySpan.textContent = currentQty;
            totalPassengers[type] = currentQty;
            updatePassengersAndClassInput(); // Aktualizuj podsumowanie na bieżąco
        });
    });

    function updatePassengersAndClassInput() {
        const total = totalPassengers.adults + totalPassengers.children + totalPassengers.infants;
        const passengersText = `${total} Pasażer${total > 1 ? 'owie' : ''}`;
        document.getElementById('passengers-input').value = `${passengersText}, ${travelClass}`;
    }
    updatePassengersAndClassInput(); // Ustaw początkową wartość

    // --- Obsługa pola lotniska (autocomplete) ---
    function setupAirportAutocomplete(inputId, dropdownId) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            dropdown.innerHTML = '';
            if (query.length < 2) {
                dropdown.classList.remove('show');
                return;
            }

            const filteredAirports = airports.filter(airport =>
                airport.name.toLowerCase().includes(query) ||
                airport.code.toLowerCase().includes(query)
            );

            // Grupuj lotniska według kraju
            const groupedAirports = filteredAirports.reduce((acc, airport) => {
                (acc[airport.country] = acc[airport.country] || []).push(airport);
                return acc;
            }, {});

            for (const country in groupedAirports) {
                const header = document.createElement('div');
                header.classList.add('dropdown-country-header');
                header.textContent = country;
                dropdown.appendChild(header);

                groupedAirports[country].forEach(airport => {
                    const item = document.createElement('div');
                    item.classList.add('dropdown-item');
                    item.textContent = `${airport.name} (${airport.code})`;
                    item.dataset.value = airport.code;
                    item.addEventListener('click', () => {
                        input.value = `${airport.name} (${airport.code})`;
                        dropdown.classList.remove('show');
                    });
                    dropdown.appendChild(item);
                });
            }

            if (filteredAirports.length > 0) {
                dropdown.classList.add('show');
            } else {
                dropdown.classList.remove('show');
            }
        });

        // Ukryj dropdown po kliknięciu poza nim
        document.addEventListener('click', (event) => {
            if (!input.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    setupAirportAutocomplete('departure-airport', 'departure-airport-dropdown');
    setupAirportAutocomplete('arrival-airport', 'arrival-airport-dropdown');

    // --- Symulowane dane lotów ---
    const mockFlights = [
        { id: 'FL001', departure: 'Warszawa (WAW)', arrival: 'Londyn-Heathrow (LHR)', date: '19.07.2025', time: '10:00', duration: '2h 30m', price: 350, availableSeats: 50 },
        { id: 'FL002', departure: 'Warszawa (WAW)', arrival: 'Paryż-Roissy-Charles de Gaulle (CDG)', date: '19.07.2025', time: '12:00', duration: '2h 15m', price: 420, availableSeats: 30 },
        { id: 'FL003', departure: 'Gdańsk (GDN)', arrival: 'Kraków (KRK)', date: '19.07.2025', time: '08:30', duration: '1h 00m', price: 150, availableSeats: 80 },
        { id: 'FL004', departure: 'Warszawa (WAW)', arrival: 'Nowy Jork-JFK (JFK)', date: '20.07.2025', time: '14:00', duration: '8h 30m', price: 1200, availableSeats: 20 },
        // Dodaj więcej lotów dla różnych dat/miejsc
        { id: 'FL005', departure: 'Warszawa (WAW)', arrival: 'Berlin Brandenburg (BER)', date: '21.07.2025', time: '07:00', duration: '1h 20m', price: 200, availableSeats: 60 },
        { id: 'FL006', departure: 'Warszawa (WAW)', arrival: 'Rzym-Fiumicino (FCO)', date: '22.07.2025', time: '09:00', duration: '2h 30m', price: 380, availableSeats: 45 },
    ];

    // --- Obsługa wyszukiwania lotów ---
    const searchFlightsBtn = document.getElementById('search-flights-btn');
    const flightResultsList = document.getElementById('flight-results-list');

    searchFlightsBtn.addEventListener('click', () => {
        const departureAirportInput = document.getElementById('departure-airport').value;
        const arrivalAirportInput = document.getElementById('arrival-airport').value;
        const departureDateInput = document.getElementById('departure-date').value;
        // const returnDateInput = document.getElementById('return-date').value; // Obecnie nieużywane w mocku, ale dostępne

        // Proste parsowanie kodów lotnisk z inputu (np. "Warszawa (WAW)" -> "WAW")
        const getAirportCode = (inputVal) => {
            const match = inputVal.match(/\((.*?)\)/);
            return match ? match[1] : '';
        };

        const depCode = getAirportCode(departureAirportInput);
        const arrCode = getAirportCode(arrivalAirportInput);

        const foundFlights = mockFlights.filter(flight =>
            flight.departure.includes(depCode) &&
            flight.arrival.includes(arrCode) &&
            flight.date === departureDateInput
        );

        displayFlightResults(foundFlights);
        showSection('flight-results-section');
    });

    function displayFlightResults(flights) {
        flightResultsList.innerHTML = ''; // Wyczyść poprzednie wyniki
        if (flights.length === 0) {
            flightResultsList.innerHTML = '<p>Brak lotów spełniających kryteria wyszukiwania.</p>';
            return;
        }

        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            flightCard.innerHTML = `
                <p><strong>Lot:</strong> ${flight.departure} do ${flight.arrival}</p>
                <p><strong>Data:</strong> ${flight.date}</p>
                <p><strong>Godzina:</strong> ${flight.time}</p>
                <p><strong>Czas trwania:</strong> ${flight.duration}</p>
                <p><strong>Cena:</strong> <strong>${flight.price} PLN</strong></p>
                <button class="button-primary select-flight-btn" data-flight-id="${flight.id}">Wybierz ten lot</button>
            `;
            flightResultsList.appendChild(flightCard);
        });

        // Dodaj słuchacze do nowych przycisków "Wybierz ten lot"
        document.querySelectorAll('.select-flight-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const flightId = event.target.dataset.flightId;
                selectedFlight = mockFlights.find(f => f.id === flightId);
                if (selectedFlight) {
                    displayBookingDetails();
                    showSection('booking-section');
                } else {
                    alert('Wystąpił błąd przy wyborze lotu. Spróbuj ponownie.');
                }
            });
        });
    }

    // --- Powrót do wyszukiwania ---
    document.getElementById('back-to-search-btn').addEventListener('click', () => {
        showSection('search-form-section');
    });

    // --- Obsługa sekcji rezerwacji ---
    const passengerForm = document.getElementById('passenger-form');
    const selectedFlightSummary = document.getElementById('selected-flight-summary');

    function displayBookingDetails() {
        if (!selectedFlight) return;

        selectedFlightSummary.innerHTML = `
            <p><strong>Wybrany lot:</strong> ${selectedFlight.departure} do ${selectedFlight.arrival}</p>
            <p><strong>Data:</strong> ${selectedFlight.date}</p>
            <p><strong>Godzina:</strong> ${selectedFlight.time}</p>
            <p><strong>Pasażerowie:</strong> ${totalPassengers.adults} dorosłych, ${totalPassengers.children} dzieci, ${totalPassengers.infants} niemowląt</p>
            <p><strong>Klasa podróży:</strong> ${travelClass}</p>
            <p><strong>Łączna cena:</strong> <strong>${selectedFlight.price * (totalPassengers.adults + totalPassengers.children)} PLN</strong></p>
        `;

        generatePassengerForms();
    }

    function generatePassengerForms() {
        passengerForm.innerHTML = '';
        const total = totalPassengers.adults + totalPassengers.children + totalPassengers.infants;

        for (let i = 0; i < total; i++) {
            const passengerType = (i < totalPassengers.adults) ? 'Dorosły' :
                                  (i < totalPassengers.adults + totalPassengers.children) ? 'Dziecko' : 'Niemowlę';
            const passengerDiv = document.createElement('div');
            passengerDiv.classList.add('passenger-details-card'); // Możesz dodać style dla tej klasy
            passengerDiv.innerHTML = `
                <h4>Pasażer ${i + 1} (${passengerType})</h4>
                <div class="form-group">
                    <label for="p${i}-name">Imię:</label>
                    <input type="text" id="p${i}-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="p${i}-surname">Nazwisko:</label>
                    <input type="text" id="p${i}-surname" name="surname" required>
                </div>
                <div class="form-group">
                    <label for="p${i}-email">E-mail:</label>
                    <input type="email" id="p${i}-email" name="email" ${i === 0 ? 'required' : ''}>
                </div>
                 <div class="form-group">
                    <label for="p${i}-phone">Telefon (opcjonalnie):</label>
                    <input type="tel" id="p${i}-phone" name="phone">
                </div>
            `;
            passengerForm.appendChild(passengerDiv);
        }
    }

    document.getElementById('proceed-to-payment-btn').addEventListener('click', (event) => {
        event.preventDefault(); // Zapobiegnij domyślnej wysyłce formularza
        if (passengerForm.checkValidity()) {
            collectPassengerData(); // Zbierz dane pasażerów
            displayPaymentDetails();
            showSection('payment-section');
        } else {
            alert('Proszę wypełnić wszystkie wymagane pola pasażerów.');
        }
    });

    document.getElementById('back-to-results-btn').addEventListener('click', () => {
        showSection('flight-results-section');
    });

    // --- Obsługa sekcji płatności ---
    const finalBookingSummary = document.getElementById('final-booking-summary');
    const paymentForm = document.getElementById('payment-form');

    function collectPassengerData() {
        const passengers = [];
        const total = totalPassengers.adults + totalPassengers.children + totalPassengers.infants;
        for (let i = 0; i < total; i++) {
            passengers.push({
                name: document.getElementById(`p${i}-name`).value,
                surname: document.getElementById(`p${i}-surname`).value,
                email: document.getElementById(`p${i}-email`).value,
                phone: document.getElementById(`p${i}-phone`).value,
                type: (i < totalPassengers.adults) ? 'adult' :
                      (i < totalPassengers.adults + totalPassengers.children) ? 'child' : 'infant'
            });
        }
        selectedFlight.passengers = passengers; // Dodaj dane pasażerów do obiektu lotu
    }

    function displayPaymentDetails() {
        if (!selectedFlight) return;

        finalBookingSummary.innerHTML = `
            <p><strong>Wybrany lot:</strong> ${selectedFlight.departure} do ${selectedFlight.arrival}</p>
            <p><strong>Data:</strong> ${selectedFlight.date}</p>
            <p><strong>Godzina:</strong> ${selectedFlight.time}</p>
            <p><strong>Pasażerowie:</strong> ${selectedFlight.passengers.length} (${totalPassengers.adults} dorosłych, ${totalPassengers.children} dzieci, ${totalPassengers.infants} niemowląt)</p>
            <p><strong>Klasa podróży:</strong> ${travelClass}</p>
            <p><strong>Łączna kwota do zapłaty:</strong> <strong style="font-size: 1.2em;">${selectedFlight.price * (totalPassengers.adults + totalPassengers.children)} PLN</strong></p>
        `;
    }

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (paymentForm.checkValidity()) {
            // Symulacja płatności
            alert('Płatność w toku...');
            setTimeout(() => {
                const confirmationCode = 'VIS' + Math.random().toString(36).substring(2, 10).toUpperCase();
                reservationDetails = {
                    flight: selectedFlight,
                    passengers: selectedFlight.passengers,
                    totalPrice: selectedFlight.price * (totalPassengers.adults + totalPassengers.children),
                    confirmationCode: confirmationCode,
                    bookingDate: new Date().toLocaleDateString('pl-PL')
                };
                displayConfirmation();
                showSection('confirmation-section');
            }, 2000);
        } else {
            alert('Proszę wypełnić wszystkie wymagane pola płatności.');
        }
    });

    document.getElementById('back-to-booking-btn').addEventListener('click', () => {
        showSection('booking-section');
    });

    // --- Obsługa sekcji potwierdzenia ---
    const confirmationCodeSpan = document.getElementById('confirmation-code');
    const confirmedBookingSummary = document.getElementById('confirmed-booking-summary');

    function displayConfirmation() {
        if (!reservationDetails) return;

        confirmationCodeSpan.textContent = reservationDetails.confirmationCode;
        confirmedBookingSummary.innerHTML = `
            <p><strong>Lot:</strong> ${reservationDetails.flight.departure} do ${reservationDetails.flight.arrival}</p>
            <p><strong>Data lotu:</strong> ${reservationDetails.flight.date}</p>
            <p><strong>Pasażerowie:</strong> ${reservationDetails.passengers.map(p => `${p.name} ${p.surname}`).join(', ')}</p>
            <p><strong>Klasa:</strong> ${travelClass}</p>
            <p><strong>Całkowita kwota:</strong> <strong>${reservationDetails.totalPrice} PLN</strong></p>
            <p><strong>Data rezerwacji:</strong> ${reservationDetails.bookingDate}</p>
        `;
    }

    document.getElementById('go-to-main-btn').addEventListener('click', () => {
        resetApplicationState();
        showSection('search-form-section');
    });

    // --- Obsługa przycisku "Przejdź do odprawy" z potwierdzenia ---
    document.getElementById('go-to-checkin-from-confirmation').addEventListener('click', () => {
        // Przed wypełnieniem pól, upewnij się, że reservationDetails istnieje i jest świeże
        if (reservationDetails) {
            document.getElementById('checkin-reservation-code').value = reservationDetails.confirmationCode;
            // Dla uproszczenia, bierzemy nazwisko pierwszego pasażera
            document.getElementById('checkin-surname').value = reservationDetails.passengers[0].surname;
        }
        showSection('check-in-section');
    });


    // --- Obsługa sekcji odprawy online ---
    const checkInForm = document.getElementById('check-in-form');
    const checkInFlightDetails = document.getElementById('check-in-flight-details');
    const performCheckInBtn = document.getElementById('perform-check-in-btn');
    const boardingPassPreview = document.getElementById('boarding-pass-preview');
    const timeUntilFlightSpan = document.getElementById('time-until-flight');

    checkInForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const reservationCode = document.getElementById('checkin-reservation-code').value.trim();
        const surname = document.getElementById('checkin-surname').value.trim();

        // Symulacja sprawdzenia rezerwacji (szukamy w `reservationDetails`)
        if (reservationDetails && reservationDetails.confirmationCode === reservationCode &&
            reservationDetails.passengers.some(p => p.surname.toLowerCase() === surname.toLowerCase())) {

            const flightDate = reservationDetails.flight.date; // np. "19.07.2025"
            const flightTime = reservationDetails.flight.time;   // np. "10:00"

            // Parsowanie daty i czasu lotu
            const [day, month, year] = flightDate.split('.').map(Number);
            const [hours, minutes] = flightTime.split(':').map(Number);
            const flightDateTime = new Date(year, month - 1, day, hours, minutes);
            const now = new Date();

            const timeDiffMs = flightDateTime.getTime() - now.getTime();
            const hoursUntilFlight = timeDiffMs / (1000 * 60 * 60);

            if (hoursUntilFlight <= 48 && hoursUntilFlight > 0) { // Lot jest w ciągu 48h i jeszcze nie odleciał
                document.getElementById('checkin-flight-info').textContent = `${reservationDetails.flight.departure} do ${reservationDetails.slice.arrival}`;
                document.getElementById('checkin-passenger-name').textContent = `${reservationDetails.passengers.find(p => p.surname.toLowerCase() === surname.toLowerCase()).name} ${surname}`;
                document.getElementById('checkin-flight-date').textContent = `${flightDate} ${flightTime}`;

                const days = Math.floor(hoursUntilFlight / 24);
                const remainingHours = Math.floor(hoursUntilFlight % 24);
                timeUntilFlightSpan.textContent = `${days} dni i ${remainingHours} godzin`;

                checkInFlightDetails.classList.remove('hidden');
                performCheckInBtn.classList.remove('hidden');
                boardingPassPreview.classList.add('hidden'); // Ukryj kartę, jeśli była wcześniej widoczna
            } else if (hoursUntilFlight <= 0) {
                 alert('Lot już odleciał lub jest w trakcie. Odprawa niemożliwa.');
                 checkInFlightDetails.classList.add('hidden');
                 performCheckInBtn.classList.add('hidden');
            }
            else {
                alert('Lot jest dostępny do odprawy online na 48 godzin przed odlotem.');
                checkInFlightDetails.classList.add('hidden');
                performCheckInBtn.classList.add('hidden');
            }
        } else {
            alert('Nie znaleziono rezerwacji o podanych danych.');
            checkInFlightDetails.classList.add('hidden');
            performCheckInBtn.classList.add('hidden');
        }
    });

    performCheckInBtn.addEventListener('click', () => {
        // Symulacja odprawy
        alert('Odprawa zakończona pomyślnie!');
        generateBoardingPass();
        performCheckInBtn.classList.add('hidden'); // Ukryj przycisk po odprawie
        checkInFlightDetails.classList.add('hidden'); // Ukryj szczegóły lotu
        boardingPassPreview.classList.remove('hidden'); // Pokaż kartę pokładową
    });

    function generateBoardingPass() {
        if (!reservationDetails) return;

        const passengerToBoard = reservationDetails.passengers.find(p => p.surname.toLowerCase() === document.getElementById('checkin-surname').value.toLowerCase());

        document.getElementById('bp-passenger-name').textContent = `${passengerToBoard.name} ${passengerToBoard.surname}`;
        document.getElementById('bp-flight-number').textContent = reservationDetails.flight.id;
        document.getElementById('bp-route').textContent = `${reservationDetails.flight.departure} - ${reservationDetails.flight.arrival}`;
        document.getElementById('bp-date').textContent = reservationDetails.flight.date;
        document.getElementById('bp-departure-time').textContent = reservationDetails.flight.time;
        // Symulowane miejsce i bramka
        document.getElementById('bp-seat').textContent = '12A';
        document.getElementById('bp-gate').textContent = 'B07';
    }

    document.getElementById('back-to-main-from-checkin-btn').addEventListener('click', () => {
        resetApplicationState();
        showSection('search-form-section');
    });


    // --- Funkcja resetująca stan aplikacji po powrocie na stronę główną ---
    function resetApplicationState() {
        selectedFlight = null;
        reservationDetails = null;
        totalPassengers = { adults: 1, children: 0, infants: 0 };
        travelClass = 'Ekonomiczna';

        // Reset pól formularza wyszukiwania
        document.getElementById('departure-airport').value = '';
        document.getElementById('arrival-airport').value = '';
        document.getElementById('departure-date').value = '';
        document.getElementById('return-date').value = '';
        document.getElementById('passengers-input').value = '1 Pasażer, Ekonomiczna';

        // Reset modalu pasażerów/klasy
        document.getElementById('adults-qty').textContent = '1';
        document.getElementById('children-qty').textContent = '0';
        document.getElementById('infants-qty').textContent = '0';
        travelClassOptions.forEach(option => {
            if (option.dataset.value === 'Ekonomiczna') {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });

        // Ukryj szczegóły odprawy i kartę pokładową
        checkInFlightDetails.classList.add('hidden');
        performCheckInBtn.classList.add('hidden');
        boardingPassPreview.classList.add('hidden');
        document.getElementById('checkin-reservation-code').value = '';
        document.getElementById('checkin-surname').value = '';

        // Ukryj wszystkie sekcje poza główną
        sections.forEach(section => {
            if (section.id !== 'search-form-section') {
                section.classList.add('hidden');
            }
        });
         // Upewnij się, że sekcje uzupełnij podróż i polecane kierunki są widoczne
        document.querySelector('.complete-your-trip').classList.remove('hidden');
        document.querySelector('.recommended-destinations').classList.remove('hidden');
    }

    // Pokaż domyślną sekcję przy ładowaniu strony
    showSection('search-form-section');
});

document.addEventListener('DOMContentLoaded', () => {
    // === Nawigacja mobilna ===
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });
    }

    // === Zmienne globalne do przechowywania stanu ===
    let allFlightTemplates = []; // Będą przechowywać szablony lotów z flights.json
    let currentSearchResults = []; // Loty znalezione po wyszukiwaniu
    let selectedFlight = null; // Wybrany lot do rezerwacji
    let passengerDetails = {}; // Dane pasażera
    let bookingReference = ''; // Numer rezerwacji

    const MIN_LAYOVER_MINUTES = 90; // Minimalny czas na przesiadkę w minutach (1.5 godziny)

    // === Elementy DOM (sekcje) ===
    const searchFormSection = document.getElementById('search-form-section');
    const flightResultsSection = document.getElementById('flight-results');
    const bookingDetailsSection = document.getElementById('booking-details');
    const paymentSection = document.getElementById('payment-section');
    const confirmationSection = document.getElementById('confirmation-section');
    const checkInSection = document.getElementById('check-in-section');

    // === Elementy DOM (formularze i przyciski) ===
    const flightSearchForm = document.getElementById('flight-search-form');
    const resultsList = document.getElementById('results-list');
    const backToSearchBtn = document.getElementById('back-to-search');
    const passengerForm = document.getElementById('passenger-form');
    const backToResultsBtn = document.getElementById('back-to-results');
    const paymentForm = document.getElementById('payment-form');
    const backToBookingBtn = document.getElementById('back-to-booking');
    const checkInButton = document.getElementById('check-in-button');
    const newSearchButton = document.getElementById('new-search-button');
    const checkInForm = document.getElementById('check-in-form');
    const backToConfirmationBtn = document.getElementById('back-to-confirmation');
    const checkInSeatSelect = document.getElementById('check-in-seat');
    const boardingPassPreview = document.getElementById('boarding-pass-preview');
    const printBoardingPassBtn = document.getElementById('print-boarding-pass');


    // === Funkcje pomocnicze ===

    // Funkcja do pokazywania/ukrywania sekcji
    function showSection(sectionToShow) {
        const sections = [
            searchFormSection,
            flightResultsSection,
            bookingDetailsSection,
            paymentSection,
            confirmationSection,
            checkInSection
        ];
        sections.forEach(section => section.classList.add('hidden'));
        sectionToShow.classList.remove('hidden');
    }

    // Funkcja do parsowania czasu (HH:MM) na minuty od północy
    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Funkcja do generowania unikalnego ID dla lotu na dany dzień
    function generateFlightId(template, date) {
        return `${template.flightNumber}-${date}`;
    }

    // Funkcja do generowania "dostępnych" lotów na podstawie szablonów i daty
    function generateDailyFlights(selectedDate) {
        const generatedFlights = [];
        allFlightTemplates.forEach(template => {
            if (template.frequency === 'daily') {
                const newFlight = { ...template }; // Kopiuj szablon
                newFlight.id = generateFlightId(template, selectedDate);
                newFlight.date = selectedDate; // Dodaj datę do instancji lotu
                generatedFlights.push(newFlight);
            }
            // Można dodać logikę dla innych częstotliwości (np. weekly, specific_days)
        });
        return generatedFlights;
    }

    // Funkcja do obliczania całkowitej ceny lotu (uwzględniając regułę o lotach międzynarodowych)
    function calculateFlightPrice(flightOption, selectedClass) {
        const classPrice = flightOption.classes.find(cls => cls.name === selectedClass)?.price || 0;
        let totalPrice = classPrice;

        // Jeśli to lot przesiadkowy i końcowy cel jest międzynarodowy, a pierwszy segment jest krajowy
        // (Na razie nie mamy międzynarodowych, ale zostawiamy logikę na przyszłość)
        // W obecnej konfiguracji (tylko CPK-GDN) ta logika nie zadziała,
        // ponieważ wszystkie loty są krajowe.
        // Jeśli dodasz loty międzynarodowe, będziesz musiał zaimplementować tę logikę.
        // Przykład: jeśli flightOption.isConnecting i flightOption.segments[1].isInternational
        // to totalPrice = flightOption.segments[1].classes.find(...).price;
        // W obecnym przypadku, po prostu bierzemy cenę bezpośredniego lotu.
        
        return totalPrice;
    }

    // === Obsługa zdarzeń ===

    // Wczytaj szablony lotów po załadowaniu strony
    fetch('data/flights.json')
        .then(response => response.json())
        .then(data => {
            allFlightTemplates = data;
            console.log('Załadowane szablony lotów:', allFlightTemplates);
        })
        .catch(error => {
            console.error('Błąd ładowania flights.json:', error);
            resultsList.innerHTML = '<p>Błąd ładowania danych lotów. Spróbuj ponownie później.</p>';
        });

    // Obsługa formularza wyszukiwania lotów
    flightSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const departureAirport = document.getElementById('departure-airport').value.toUpperCase();
        const arrivalAirport = document.getElementById('arrival-airport').value.toUpperCase();
        const departureDate = document.getElementById('departure-date').value;
        const numPassengers = parseInt(document.getElementById('num-passengers').value);
        const travelClass = document.getElementById('travel-class').value;

        if (!departureDate) {
            alert('Proszę wybrać datę odlotu.');
            return;
        }

        // Generuj loty na wybrany dzień
        const dailyFlights = generateDailyFlights(departureDate);
        console.log('Wygenerowane loty na dzień ' + departureDate + ':', dailyFlights);

        // Filtruj loty bezpośrednie
        const directFlights = dailyFlights.filter(flight =>
            flight.origin === departureAirport &&
            flight.destination === arrivalAirport &&
            flight.availableSeats >= numPassengers
        );

        // W obecnej konfiguracji (tylko CPK-GDN), nie mamy lotów przesiadkowych,
        // więc poniższa logika dla lotów przesiadkowych nie zwróci wyników.
        // Zostawiam ją jako "na przyszłość", gdy dodasz więcej tras.

        // Logika wyszukiwania lotów przesiadkowych (na przyszłość)
        const connectingFlights = [];
        // const hubAirports = ['WAW', 'XER']; // Centralne lotniska przesiadkowe
        // if (departureAirport !== arrivalAirport) { // Jeśli to nie jest ten sam port
        //     for (const firstLeg of dailyFlights) {
        //         // Sprawdź, czy pierwszy segment zaczyna się w miejscu odlotu i kończy na lotnisku przesiadkowym
        //         if (firstLeg.origin === departureAirport && hubAirports.includes(firstLeg.destination) && firstLeg.availableSeats >= numPassengers) {
        //             for (const secondLeg of dailyFlights) {
        //                 // Sprawdź, czy drugi segment zaczyna się na lotnisku przesiadkowym i kończy w miejscu docelowym
        //                 // i czy to jest to samo lotnisko przesiadkowe co z pierwszego segmentu
        //                 if (secondLeg.origin === firstLeg.destination && secondLeg.destination === arrivalAirport && secondLeg.availableSeats >= numPassengers) {
        //                     // Sprawdź, czy daty są takie same i czy jest wystarczająco czasu na przesiadkę
        //                     const arrivalTimeFirstLeg = parseTime(firstLeg.arrivalTime);
        //                     const departureTimeSecondLeg = parseTime(secondLeg.departureTime);

        //                     if (departureTimeSecondLeg - arrivalTimeFirstLeg >= MIN_LAYOVER_MINUTES) {
        //                         const combinedPrice = (firstLeg.isInternational || secondLeg.isInternational) ?
        //                             (secondLeg.isInternational ? secondLeg.classes.find(c => c.name === travelClass)?.price || 0 : firstLeg.classes.find(c => c.name === travelClass)?.price || 0) :
        //                             (firstLeg.classes.find(c => c.name === travelClass)?.price || 0) + (secondLeg.classes.find(c => c.name === travelClass)?.price || 0);

        //                         connectingFlights.push({
        //                             id: `${firstLeg.id}-${secondLeg.id}`,
        //                             type: 'connecting',
        //                             segments: [firstLeg, secondLeg],
        //                             origin: departureAirport,
        //                             destination: arrivalAirport,
        //                             classes: [{ name: travelClass, price: combinedPrice }],
        //                             totalPrice: combinedPrice,
        //                             numPassengers: numPassengers,
        //                             selectedClass: travelClass
        //                         });
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        currentSearchResults = [...directFlights.map(f => ({ ...f, type: 'direct', numPassengers, selectedClass: travelClass, totalPrice: calculateFlightPrice(f, travelClass) }))];
        // currentSearchResults = [...currentSearchResults, ...connectingFlights]; // Włącz loty przesiadkowe jeśli masz ich logikę

        displayFlights(currentSearchResults);
        showSection(flightResultsSection);
    });

    // Funkcja wyświetlająca loty
    function displayFlights(flights) {
        resultsList.innerHTML = ''; // Wyczyść poprzednie wyniki
        if (flights.length === 0) {
            resultsList.innerHTML = '<p>Brak dostępnych lotów dla wybranej trasy i daty. Spróbuj innej daty lub trasy.</p>';
            return;
        }

        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.classList.add('flight-card');
            
            const classPrice = flight.classes.find(cls => cls.name === flight.selectedClass)?.price || 'N/A';

            let flightDetailsHtml = '';
            if (flight.type === 'direct') {
                flightDetailsHtml = `
                    <p>Lot: <strong>${flight.flightNumber}</strong></p>
                    <p>Trasa: <strong>${flight.origin} → ${flight.destination}</strong></p>
                    <p>Data: <strong>${flight.date}</strong></p>
                    <p>Godziny: <strong>${flight.departureTime} → ${flight.arrivalTime}</strong></p>
                    <p>Samolot: ${flight.aircraftModel}</p>
                `;
            } else if (flight.type === 'connecting') {
                // Ta część będzie używana, gdy dodamy loty przesiadkowe
                flightDetailsHtml = `
                    <p>Lot przesiadkowy</p>
                    <p>Trasa: <strong>${flight.segments[0].origin} → ${flight.segments[0].destination} → ${flight.segments[1].destination}</strong></p>
                    <p>Data: <strong>${flight.segments[0].date}</strong></p>
                    <p>Godziny: <strong>${flight.segments[0].departureTime} → ${flight.segments[1].arrivalTime}</strong> (Przesiadka w: ${flight.segments[0].destination})</p>
                    <p>Samoloty: ${flight.segments[0].aircraftModel}, ${flight.segments[1].aircraftModel}</p>
                `;
            }

            flightCard.innerHTML = `
                ${flightDetailsHtml}
                <p>Klasa: <strong>${flight.selectedClass}</strong></p>
                <p>Cena za ${flight.numPassengers} os.: <strong>${(classPrice * flight.numPassengers).toFixed(2)} PLN</strong></p>
                <button class="button-primary select-flight-btn" data-flight-id="${flight.id}">Wybierz lot</button>
            `;
            resultsList.appendChild(flightCard);
        });

        // Obsługa wyboru lotu
        document.querySelectorAll('.select-flight-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const flightId = e.target.dataset.flightId;
                selectedFlight = currentSearchResults.find(f => f.id === flightId);
                if (selectedFlight) {
                    displayBookingDetails();
                    showSection(bookingDetailsSection);
                }
            });
        });
    }

    // Funkcja wyświetlająca szczegóły rezerwacji
    function displayBookingDetails() {
        const summaryDiv = document.getElementById('selected-flight-summary');
        if (!selectedFlight) {
            summaryDiv.innerHTML = '<p>Brak wybranego lotu.</p>';
            return;
        }

        const classPrice = selectedFlight.classes.find(cls => cls.name === selectedFlight.selectedClass)?.price || 'N/A';
        
        let flightDetailsHtml = '';
        if (selectedFlight.type === 'direct') {
            flightDetailsHtml = `
                <p>Lot: <strong>${selectedFlight.flightNumber}</strong></p>
                <p>Trasa: <strong>${selectedFlight.origin} → ${selectedFlight.destination}</strong></p>
                <p>Data: <strong>${selectedFlight.date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.departureTime} → ${selectedFlight.arrivalTime}</strong></p>
                <p>Samolot: ${selectedFlight.aircraftModel}</p>
            `;
        } else if (selectedFlight.type === 'connecting') {
            flightDetailsHtml = `
                <p>Lot przesiadkowy</p>
                <p>Trasa: <strong>${selectedFlight.segments[0].origin} → ${selectedFlight.segments[0].destination} → ${selectedFlight.segments[1].destination}</strong></p>
                <p>Data: <strong>${selectedFlight.segments[0].date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.segments[0].departureTime} → ${selectedFlight.segments[1].arrivalTime}</strong> (Przesiadka w: ${selectedFlight.segments[0].destination})</p>
                <p>Samoloty: ${selectedFlight.segments[0].aircraftModel}, ${selectedFlight.segments[1].aircraftModel}</p>
            `;
        }

        summaryDiv.innerHTML = `
            ${flightDetailsHtml}
            <p>Klasa: <strong>${selectedFlight.selectedClass}</strong></p>
            <p>Liczba pasażerów: <strong>${selectedFlight.numPassengers}</strong></p>
            <p>Całkowita cena: <strong>${(classPrice * selectedFlight.numPassengers).toFixed(2)} PLN</strong></p>
        `;
    }

    // Obsługa formularza danych pasażera
    passengerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        passengerDetails = {
            name: document.getElementById('passenger-name').value,
            surname: document.getElementById('passenger-surname').value,
            dob: document.getElementById('passenger-dob').value,
            email: document.getElementById('passenger-email').value
        };
        displayPaymentDetails();
        showSection(paymentSection);
    });

    // Funkcja wyświetlająca szczegóły płatności
    function displayPaymentDetails() {
        const paymentSummaryDiv = document.getElementById('payment-summary');
        if (!selectedFlight) {
            paymentSummaryDiv.innerHTML = '<p>Brak wybranego lotu.</p>';
            return;
        }

        const classPrice = selectedFlight.classes.find(cls => cls.name === selectedFlight.selectedClass)?.price || 0;
        const totalPayment = (classPrice * selectedFlight.numPassengers).toFixed(2);

        paymentSummaryDiv.innerHTML = `
            <h3>Do zapłaty: <span style="color: #007bff; font-weight: bold;">${totalPayment} PLN</span></h3>
            <p>Lot: <strong>${selectedFlight.origin} → ${selectedFlight.destination}</strong></p>
            <p>Data: <strong>${selectedFlight.date}</strong></p>
            <p>Pasażer: <strong>${passengerDetails.name} ${passengerDetails.surname}</strong></p>
            <p>Klasa: <strong>${selectedFlight.selectedClass}</strong></p>
        `;
    }

    // Obsługa formularza płatności (symulacja)
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // W rzeczywistości tutaj byłaby integracja z bramką płatniczą.
        // My tylko symulujemy sukces.
        
        // Generowanie prostego numeru rezerwacji
        bookingReference = 'VA' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('reservation-number').textContent = bookingReference;

        displayConfirmationDetails();
        showSection(confirmationSection);

        // Opcjonalnie: wyczyść formularz płatności
        paymentForm.reset();
    });

    // Funkcja wyświetlająca potwierdzenie
    function displayConfirmationDetails() {
        const confirmedBookingSummaryDiv = document.getElementById('confirmed-booking-summary');
        if (!selectedFlight) {
            confirmedBookingSummaryDiv.innerHTML = '<p>Brak danych rezerwacji.</p>';
            return;
        }

        const classPrice = selectedFlight.classes.find(cls => cls.name === selectedFlight.selectedClass)?.price || 0;
        
        let flightDetailsHtml = '';
        if (selectedFlight.type === 'direct') {
            flightDetailsHtml = `
                <p>Lot: <strong>${selectedFlight.flightNumber}</strong></p>
                <p>Trasa: <strong>${selectedFlight.origin} → ${selectedFlight.destination}</strong></p>
                <p>Data: <strong>${selectedFlight.date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.departureTime} → ${selectedFlight.arrivalTime}</strong></p>
                <p>Samolot: ${selectedFlight.aircraftModel}</p>
            `;
        } else if (selectedFlight.type === 'connecting') {
            flightDetailsHtml = `
                <p>Lot przesiadkowy</p>
                <p>Trasa: <strong>${selectedFlight.segments[0].origin} → ${selectedFlight.segments[0].destination} → ${selectedFlight.segments[1].destination}</strong></p>
                <p>Data: <strong>${selectedFlight.segments[0].date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.segments[0].departureTime} → ${selectedFlight.segments[1].arrivalTime}</strong> (Przesiadka w: ${selectedFlight.segments[0].destination})</p>
                <p>Samoloty: ${selectedFlight.segments[0].aircraftModel}, ${selectedFlight.segments[1].aircraftModel}</p>
            `;
        }
        
        confirmedBookingSummaryDiv.innerHTML = `
            ${flightDetailsHtml}
            <p>Pasażer: <strong>${passengerDetails.name} ${passengerDetails.surname}</strong></p>
            <p>Klasa: <strong>${selectedFlight.selectedClass}</strong></p>
            <p>Całkowita cena: <strong>${(classPrice * selectedFlight.numPassengers).toFixed(2)} PLN</strong></p>
        `;
    }

    // Obsługa odprawy online
    checkInButton.addEventListener('click', () => {
        displayCheckInDetails();
        showSection(checkInSection);
    });

    // Funkcja wyświetlająca szczegóły odprawy
    function displayCheckInDetails() {
        const checkInSummaryDiv = document.getElementById('check-in-summary');
        if (!selectedFlight || !passengerDetails) {
            checkInSummaryDiv.innerHTML = '<p>Brak danych do odprawy.</p>';
            return;
        }

        let flightDetailsHtml = '';
        if (selectedFlight.type === 'direct') {
            flightDetailsHtml = `
                <p>Lot: <strong>${selectedFlight.flightNumber}</strong></p>
                <p>Trasa: <strong>${selectedFlight.origin} → ${selectedFlight.destination}</strong></p>
                <p>Data: <strong>${selectedFlight.date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.departureTime} → ${selectedFlight.arrivalTime}</strong></p>
                <p>Samolot: ${selectedFlight.aircraftModel}</p>
            `;
        } else if (selectedFlight.type === 'connecting') {
            flightDetailsHtml = `
                <p>Lot przesiadkowy</p>
                <p>Trasa: <strong>${selectedFlight.segments[0].origin} → ${selectedFlight.segments[0].destination} → ${selectedFlight.segments[1].destination}</strong></p>
                <p>Data: <strong>${selectedFlight.segments[0].date}</strong></p>
                <p>Godziny: <strong>${selectedFlight.segments[0].departureTime} → ${selectedFlight.segments[1].arrivalTime}</strong> (Przesiadka w: ${selectedFlight.segments[0].destination})</p>
                <p>Samoloty: ${selectedFlight.segments[0].aircraftModel}, ${selectedFlight.segments[1].aircraftModel}</p>
            `;
        }

        checkInSummaryDiv.innerHTML = `
            ${flightDetailsHtml}
            <p>Pasażer: <strong>${passengerDetails.name} ${passengerDetails.surname}</strong></p>
            <p>Klasa: <strong>${selectedFlight.selectedClass}</strong></p>
        `;

        // Generuj miejsca do wyboru (przykładowo)
        checkInSeatSelect.innerHTML = '<option value="">Wybierz miejsce</option>';
        const totalSeats = selectedFlight.availableSeats; // Używamy dostępnych miejsc z wybranego lotu
        for (let i = 1; i <= totalSeats; i++) {
            const row = Math.ceil(i / 6); // Przykładowo 6 miejsc w rzędzie
            const seatChar = String.fromCharCode(65 + (i - 1) % 6);
            const seatNumber = `${row}${seatChar}`;
            const option = document.createElement('option');
            option.value = seatNumber;
            option.textContent = `Miejsce ${seatNumber}`;
            checkInSeatSelect.appendChild(option);
        }
    }

    // Obsługa formularza odprawy (symulacja)
    checkInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedSeat = checkInSeatSelect.value;
        if (!selectedSeat) {
            alert('Proszę wybrać miejsce.');
            return;
        }

        // Symulacja "odprawienia"
        passengerDetails.seat = selectedSeat;
        passengerDetails.checkedIn = true;

        displayBoardingPass();
        boardingPassPreview.classList.remove('hidden');
        alert('Odprawa zakończona sukcesem! Poniżej Twoja karta pokładowa.');
    });

    // Funkcja wyświetlająca kartę pokładową
    function displayBoardingPass() {
        if (!selectedFlight || !passengerDetails || !passengerDetails.checkedIn) {
            boardingPassPreview.innerHTML = '<p>Brak danych karty pokładowej.</p>';
            return;
        }
        
        const bpFlightNumber = selectedFlight.type === 'direct' ? selectedFlight.flightNumber : selectedFlight.segments[0].flightNumber + ' & ' + selectedFlight.segments[1].flightNumber;
        const bpOrigin = selectedFlight.type === 'direct' ? selectedFlight.origin : selectedFlight.segments[0].origin;
        const bpDestination = selectedFlight.type === 'direct' ? selectedFlight.destination : selectedFlight.segments[1].destination;
        const bpDate = selectedFlight.type === 'direct' ? selectedFlight.date : selectedFlight.segments[0].date;
        const bpTime = selectedFlight.type === 'direct' ? selectedFlight.departureTime : selectedFlight.segments[0].departureTime + ' - ' + selectedFlight.segments[1].arrivalTime;

        document.getElementById('bp-flight-number').textContent = bpFlightNumber;
        document.getElementById('bp-origin').textContent = bpOrigin;
        document.getElementById('bp-destination').textContent = bpDestination;
        document.getElementById('bp-date').textContent = bpDate;
        document.getElementById('bp-time').textContent = bpTime;
        document.getElementById('bp-passenger-name').textContent = passengerDetails.name;
        document.getElementById('bp-passenger-surname').textContent = passengerDetails.surname;
        document.getElementById('bp-seat').textContent = passengerDetails.seat || 'Brak';
    }

    // Obsługa przycisków "Wróć" i "Nowe wyszukiwanie"
    backToSearchBtn.addEventListener('click', () => showSection(searchFormSection));
    backToResultsBtn.addEventListener('click', () => {
        displayFlights(currentSearchResults); // Ponownie wyświetl wyniki
        showSection(flightResultsSection);
    });
    backToBookingBtn.addEventListener('click', () => showSection(bookingDetailsSection));
    backToConfirmationBtn.addEventListener('click', () => showSection(confirmationSection));
    newSearchButton.addEventListener('click', () => {
        // Resetuj wszystkie stany i wróć do wyszukiwania
        selectedFlight = null;
        passengerDetails = {};
        bookingReference = '';
        flightSearchForm.reset();
        document.getElementById('passenger-form').reset();
        document.getElementById('payment-form').reset();
        document.getElementById('check-in-form').reset();
        boardingPassPreview.classList.add('hidden');
        showSection(searchFormSection);
    });

    // Symulacja drukowania karty pokładowej
    printBoardingPassBtn.addEventListener('click', () => {
        alert('Symulacja drukowania karty pokładowej. W prawdziwym systemie otworzyłoby się okno drukowania.');
        // Tutaj można by dodać window.print() dla wydruku całej strony,
        // lub stworzyć wydrukową wersję karty pokładowej w nowym oknie/iframe.
    });

    // Ustawienie minimalnej daty w polu 'departure-date' na jutro
    const departureDateInput = document.getElementById('departure-date');
    const today = new Date();
    today.setDate(today.getDate() + 1); // Ustaw na jutro
    const tomorrow = today.toISOString().split('T')[0];
    departureDateInput.min = tomorrow;
});

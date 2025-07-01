document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const currencyIcon = document.getElementById('currencyIcon');
    const countryIcon = document.getElementById('countryIcon');
    const accountIcon = document.getElementById('accountIcon');

    // Funkcja do zamykania wszystkich dropdownów
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    // Obsługa kliknięcia w hamburger menu
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(event) {
            mobileNav.classList.toggle('open');
            // Zamknij wszystkie inne dropdowny, gdy otwiera się menu mobilne
            closeAllDropdowns();
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu na dokument
        });
    }

    // Obsługa kliknięcia w ikonę waluty
    if (currencyIcon) {
        currencyIcon.addEventListener('click', function(event) {
            const dropdown = this.querySelector('.dropdown-content');
            closeAllDropdowns(); // Zamknij inne dropdowny
            mobileNav.classList.remove('open'); // Zamknij menu mobilne
            dropdown.classList.toggle('show'); // Pokaż/ukryj ten dropdown
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu na dokument
        });
    }

    // Obsługa kliknięcia w ikonę państwa/języka
    if (countryIcon) {
        countryIcon.addEventListener('click', function(event) {
            const dropdown = this.querySelector('.dropdown-content');
            closeAllDropdowns(); // Zamknij inne dropdowny
            mobileNav.classList.remove('open'); // Zamknij menu mobilne
            dropdown.classList.toggle('show'); // Pokaż/ukryj ten dropdown
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu na dokument
        });
    }

    // Obsługa kliknięcia w ikonę konta
    if (accountIcon) {
        accountIcon.addEventListener('click', function(event) {
            const dropdown = this.querySelector('.dropdown-content');
            closeAllDropdowns(); // Zamknij inne dropdowny
            mobileNav.classList.remove('open'); // Zamknij menu mobilne
            dropdown.classList.toggle('show'); // Pokaż/ukryj ten dropdown
            event.stopPropagation(); // Zapobiegaj zamykaniu po kliknięciu na dokument
        });
    }

    // Zamykanie dropdownów i menu mobilnego po kliknięciu poza nimi
    document.addEventListener('click', function(event) {
        // Sprawdź, czy kliknięcie nie nastąpiło wewnątrz żadnego z elementów otwierających dropdowny
        const isClickInsideDropdownOrToggle = event.target.closest('.icon-item') || event.target.closest('.menu-toggle') || event.target.closest('.mobile-nav');
        
        if (!isClickInsideDropdownOrToggle) {
            closeAllDropdowns();
            mobileNav.classList.remove('open');
        }
    });

    // Zapobieganie zamykaniu dropdownów po kliknięciu w ich zawartość
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation(); // Zatrzymuje propagację zdarzenia, aby nie zamykało dropdownu
        });
    });
});

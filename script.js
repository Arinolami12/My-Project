document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userGrid = document.getElementById('userGrid');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const noResultsElement = document.getElementById('noResults');
    const retryButton = document.getElementById('retryButton');
    const searchInput = document.getElementById('search');
    const clearSearchButton = document.getElementById('clearSearch');
    const cityFilter = document.getElementById('cityFilter');
    const darkModeToggle = document.getElementById('darkModeToggle');
    // State
    let users = [];
    let cities = new Set();

    // Fetch users from the API
    fetchUsers();
    setupEventListeners();
    // functions
    function fetchUsers() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        userGrid.classList.add('hidden');
        noResultsElement.classList.add('hidden');

        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                    if (response.ok)
                }
                throw new Error('Network response was not ok');
                return response.json();
            })

    .then(data => {
            users = data;
            processUserData();
            renderUsers(users);
            populatefilters();
            loadingElement.classList.add('hidden');
            userGrid.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error fetching users data:', error);
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
        });
}

function processUserData() {
    users.forEach(user => {
        cities.add(user.address.city);
    });
}

function populatefilters() {
    // populate city filter
    const sortedCities = Array.from(cities).sort();
    sortedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

function renderUsers(usersToRender) {
    userGrid.innerHTML = '';
    if (usersToRender.length === 0) {
        noResultsElement.classList.remove('hidden');
        return;
    }
    noResultsElement.classList.add('hidden');
    usersToRender.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `

           <div class="user-header">
           <div class="user-avatar">$
           {user.name.charAt(0)}</div>
           <div class="user-info">
           <h2>${user.name}</h2>
           <p>@${user.username}</p>
           </div>
            </div>
            <div class="user-details">
            <div class="user-details-item">
            <svg viewbox="0 0 24 24">
            <path d="M3 817.89 5.26a2 2 0 002.22 0L21 
            8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:${user.email}">${user.email}</a>
            </div>
            <div class="detail-item">
            <svg viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0
             00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 
             0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5
              10v-5a1 1 0 011-1h2a1 1 0 011
               1v5m-4 0h4" />
               </svg>
               <span>$
               {user.company.name}</span>
               </div>
               <div class="detail-item">
               <svg viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 01-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>${user.address.city}</span>
                </div>
                </div>
                <div class="view-details">
                <button class="view-details-button">
                <span>View Details</span>
                <svg viewBox="0 0 24 24">
                <path d="M19 91-7 7-7-7" />
                </svg>
                </button>
               <div class="details-content">
               <div class="detail-item">
                <svg viewBox="0 0 24 24">
                <path d="M3 5a2 2 9 012-2h3.28a1 1 0 01.948.68411.498 4.493a1 1 0 01-.502 1.211-2.257
                1.13a11.042 11.042 0 005.516 5.51611.13-2.257a1 1 0 011.21-.50214.493 1.498a1 1 0 01.684.949V19a2
                2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>${user.phone}</span>
                </div>
                <div class="detail-item">
                <svg viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 01-4 4a4 4 0 105.656 5.65611.102-1.101m-.758-4899a4 4 0 
                005.656 014-4a4 4 0 00-5.656-5.6561-1.1 1.1" />
                </svg>
                <span>${user.website}</span>
                target="_blank">${user.website}</a>
                </div>
                <div class="detail-item">
                <svg viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 01-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${user.address.street}, 
                ${user.address.suite}<br>
                ${user.address.city},
                 ${user.address.zipcode}</span>
                </div>
                </div>
                </div>
                `;
        userGrid.appendChild(userCard);
    });
    // Add event listeners to all view details buttons
    document.querySelectorAll('.view-details-button').forEach(button => {
        button.addEventListener('click', function() {
            const detailsContent = this.parentElement.querySelector('.details-content');
            detailsContent.classList.toggle('show');
            this.classList.toggle('active');
            // Update button text 
            const span = this.querySelector('span');
            span.textContent = detailsContent.classList.contains('show') ? 'Hide Details' : 'View Details';
        });
    });
}

function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || user.username.toLowerCase().includes(searchTerm);
        const matchesCity = selectedCity ? user.address.city === selectedCity : true;
        return matchesSearch && matchesCity;
    });
    renderUsers(filteredUsers);
}

function setupEventListeners() {
    // Searchn input
    searchInput.addEventListener('input', function() {
        clearSearchButton.classList.toggle('hidden', !this.value);
        filterUsers();
    });
    // Clear search button
    clearSearchButton.addEventListener('click', function() {
        searchInput.value = '';
        this.classList.add('hidden');
        filterUsers();
    });
    // filter dropdowns
    cityFilter.addEventListener('change', filterUsers);
    // Retry button
    retryButton.addEventListener('click', fetchUsers);
    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDark);
    });
    // Load dark mode preference from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }

}
});
document.addEventListener('DOMContentLoaded', function() {
    const userGrid = document.getElementById('userGrid');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const noResultsElement = document.getElementById('noResults');
    const retryButton = document.getElementById('retryButton');
    const searchInput = document.getElementById('search');
    const clearSearchButton = document.getElementById('clearSearch');
    const cityFilter = document.getElementById('cityFilter');
    const darkModeToggle = document.getElementById('darkModeToggle');

    let users = [];
    let cities = new Set();

    fetchUsers();
    setupEventListeners();

    function fetchUsers() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        userGrid.classList.add('hidden');
        noResultsElement.classList.add('hidden');

        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
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
                    <div class="user-avatar">${user.name.charAt(0)}</div>
                    <div class="user-info">
                        <h2>${user.name}</h2>
                        <p>@${user.username}</p>
                    </div>
                </div>
                <div class="user-details">
                    <div class="detail-item">
                        <a href="mailto:${user.email}">${user.email}</a>
                    </div>
                    <div class="detail-item">
                        <span>${user.company.name}</span>
                    </div>
                    <div class="detail-item">
                        <span>${user.address.city}</span>
                    </div>
                </div>
                <div class="view-details">
                    <button class="view-details-button">
                        <span>View Details</span>
                    </button>
                    <div class="details-content">
                        <div class="detail-item">
                            <span>${user.phone}</span>
                        </div>
                        <div class="detail-item">
                            <a href="http://${user.website}" target="_blank">${user.website}</a>
                        </div>
                        <div class="detail-item">
                            <span>${user.address.street}, ${user.address.suite}<br>
                            ${user.address.city}, ${user.address.zipcode}</span>
                        </div>
                    </div>
                </div>
            `;
            userGrid.appendChild(userCard);
        });

        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', function() {
                const detailsContent = this.parentElement.querySelector('.details-content');
                detailsContent.classList.toggle('show');
                this.classList.toggle('active');
                const span = this.querySelector('span');
                span.textContent = detailsContent.classList.contains('show') ? 'Hide Details' : 'View Details';
            });
        });
    }

    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCity = cityFilter.value;
        const filteredUsers = users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm);
            const matchesCity = selectedCity ? user.address.city === selectedCity : true;
            return matchesSearch && matchesCity;
        });
        renderUsers(filteredUsers);
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', function() {
            clearSearchButton.classList.toggle('hidden', !this.value);
            filterUsers();
        });

        clearSearchButton.addEventListener('click', function() {
            searchInput.value = '';
            this.classList.add('hidden');
            filterUsers();
        });

        cityFilter.addEventListener('change', filterUsers);

        retryButton.addEventListener('click', fetchUsers);

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            this.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            localStorage.setItem('darkMode', isDark);
        });

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = 'Light Mode';
        }
    }
});
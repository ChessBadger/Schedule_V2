fetch('schedule_data.json')
  .then((response) => response.json())
  .then((schedule) => {
    const scheduleData = document.getElementById('scheduleData');

    for (const [day, runs] of Object.entries(schedule)) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('card');
      const dayHeader = document.createElement('h3');
      dayHeader.textContent = day;
      dayElement.appendChild(dayHeader);

      runs.forEach((run) => {
        const mainCard = document.createElement('div');
        // mainCard.classList.add('card');

        const displayAllStores = (run, card) => {
          run.store_name.forEach((store, index) => {
            const storeCard = document.createElement('div');
            storeCard.classList.add('store-card');

            displayName(run.store_name[index], storeCard);
            displayStoreItem(run.inv_type[index], storeCard);
            displayLink(run.store_address[index], run.store_link[index], storeCard);
            card.appendChild(storeCard);
          });
        };

        const displayRunItem = (label, value, container) => {
          const item = document.createElement('p');
          item.innerHTML = `<strong>${label}:</strong> ${value}`;
          container.appendChild(item);
        };

        const displayLink = (label, value, container) => {
          const item = document.createElement('a');
          item.textContent = label;
          item.setAttribute('href', value); // Set the href attribute to make the link clickable
          item.setAttribute('target', '_blank'); // Set the link to open in a new tab
          container.appendChild(item);
        };

        const displayName = (value, container) => {
          const item = document.createElement('h4');
          item.textContent = value;
          container.appendChild(item);
        };

        const displayStoreItem = (value, container) => {
          const item = document.createElement('p');
          item.textContent = value;
          container.appendChild(item);
        };

        const displayStoreCrew = (crew, container, isDriver, isSupervisor) => {
          const crewList = document.createElement('ul');
          crewList.style.listStyle = 'none'; // Removes bullets
          crewList.style.display = 'none'; // Initially hide crew list

          crew.forEach((member) => {
            const crewMember = document.createElement('li');
            crewMember.textContent = member;
            crewList.appendChild(crewMember);
          });

          const item = document.createElement('p');
          item.appendChild(crewList);
          container.appendChild(item);

          if (isDriver || isSupervisor) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex'; // Use Flexbox for positioning
            buttonContainer.style.justifyContent = 'flex-end'; // Align button to the right

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Toggle Crew';
            toggleButton.addEventListener('click', () => {
              if (crewList.style.display === 'none') {
                crewList.style.display = 'block';
                toggleButton.textContent = 'Hide Crew';
              } else {
                crewList.style.display = 'none';
                toggleButton.textContent = 'Show Crew';
              }
            });

            buttonContainer.appendChild(toggleButton);
            container.appendChild(buttonContainer);
          }
        };

        const displayCarLogo = (isDriver, container) => {
          if (isDriver) {
            const preferredMode = localStorage.getItem('preferredMode');
            const carLogo = document.createElement('img');

            if (preferredMode === 'dark') {
              carLogo.setAttribute('src', 'car_logo_dark.jpg'); // Replace 'car_logo.png' with your image URL
              carLogo.setAttribute('alt', 'Car Logo');
              carLogo.classList.add('car-logo'); // Add a class for styling
            } else {
              carLogo.setAttribute('src', 'car_logo_light.jpg'); // Replace 'car_logo.png' with your image URL
              carLogo.setAttribute('alt', 'Car Logo');
              carLogo.classList.add('car-logo'); // Add a class for styling
            }

            const logoContainer = document.createElement('div');
            logoContainer.classList.add('car-logo-container'); // Add a class for positioning

            logoContainer.appendChild(carLogo);
            container.appendChild(logoContainer);
          }
        };

        const displayAllStoresButton = (run) => {
          if (run.store_name.length > 1) {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Show All Stores';
            toggleButton.addEventListener('click', () => {
              mainCard.innerHTML = ''; // Clear the card before displaying

              if (showAll) {
                displayRunItem('Meet Time', run.meet_time, mainCard);
                displayRunItem('Start Time', run.start_time, mainCard);
                displayRunItem('Note', run.note, mainCard);
                displayRunItem('Supervisor', run.store_supervisor, mainCard);
                displayStoreCrew(run.store_crew, mainCard, run.is_driver, run.is_supervisor);
                displayCarLogo(run.is_driver, mainCard);

                showAll = false;
                toggleButton.textContent = 'Show All Stores';
              } else {
                displayRunItem('Meet Time', run.meet_time, mainCard);
                displayRunItem('Start Time', run.start_time, mainCard);
                displayRunItem('Note', run.note, mainCard);
                displayRunItem('Supervisor', run.store_supervisor, mainCard);
                displayStoreCrew(run.store_crew, mainCard, run.is_driver, run.is_supervisor);
                displayCarLogo(run.is_driver, mainCard);

                displayAllStores(run, mainCard);

                showAll = true;
                toggleButton.textContent = 'Show Less';
              }
              mainCard.appendChild(toggleButton); // Ensure the button remains in the card
            });

            mainCard.appendChild(toggleButton);
          } else {
            displayAllStores(run, mainCard);
          }
        };

        displayRunItem('Meet Time', run.meet_time, mainCard);
        displayRunItem('Start Time', run.start_time, mainCard);
        displayRunItem('Note', run.note, mainCard);
        displayRunItem('Supervisor', run.store_supervisor, mainCard);
        displayStoreCrew(run.store_crew, mainCard, run.is_driver, run.is_supervisor);
        displayCarLogo(run.is_driver, mainCard);

        let showAll = false; // Flag to toggle between displaying all stores and just the first

        displayAllStoresButton(run);

        dayElement.appendChild(mainCard);
      });

      scheduleData.appendChild(dayElement);
    }
  })
  .catch((error) => console.error('Error fetching the schedule:', error));

const toggleDarkMode = () => {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode'); // Toggle the 'dark-mode' class on the body
  const darkModeToggleButton = document.getElementById('darkModeToggle');

  if (isDarkMode) {
    darkModeToggleButton.textContent = 'Light Mode';
    // Change the car logo image source to the dark mode version
    const carLogos = document.querySelectorAll('.car-logo'); // Assuming car-logo is the class used for the car logo image
    carLogos.forEach((carLogo) => {
      carLogo.setAttribute('src', 'car_logo_dark.jpg'); // Change the src attribute for each car logo image
    });
    localStorage.setItem('preferredMode', 'dark'); // Store the user's preference in localStorage
  } else {
    darkModeToggleButton.textContent = 'Dark Mode';
    // Change the car logo image source to the light mode version
    const carLogos = document.querySelectorAll('.car-logo'); // Assuming car-logo is the class used for the car logo image
    carLogos.forEach((carLogo) => {
      carLogo.setAttribute('src', 'car_logo_light.jpg'); // Change the src attribute for each car logo image
    });
    localStorage.setItem('preferredMode', 'light'); // Store the user's preference in localStorage
  }
};

// Check for user's preferred mode in localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const preferredMode = localStorage.getItem('preferredMode');
  const darkModeToggleButton = document.getElementById('darkModeToggle');

  if (preferredMode === 'dark') {
    document.body.classList.add('dark-mode'); // Apply dark mode if preferredMode is 'dark'
    darkModeToggleButton.textContent = 'Light Mode'; // Change button text to Light Mode if dark mode is activated
  }
});

// Find the dark mode toggle button
const darkModeToggleButton = document.getElementById('darkModeToggle');

// Add an event listener to the dark mode toggle button
darkModeToggleButton.addEventListener('click', toggleDarkMode);

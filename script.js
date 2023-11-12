fetch('schedule_data.json')
  .then((response) => response.json())
  .then((schedule) => {
    const scheduleData = document.getElementById('scheduleData');

    for (const [day, runs] of Object.entries(schedule)) {
      const dayElement = document.createElement('div');
      const dayHeader = document.createElement('h3');
      dayHeader.textContent = day;
      dayElement.appendChild(dayHeader);

      runs.forEach((run) => {
        const mainCard = document.createElement('div');
        mainCard.classList.add('card');

        const displayAllStores = (run, card) => {
          run.store_name.forEach((store, index) => {
            const storeCard = document.createElement('div');
            storeCard.classList.add('store-card');

            displayName(run.store_name[index], storeCard);
            // displayRunItem('Store Address', run.store_address[index], storeCard);
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
                showAll = false;
                toggleButton.textContent = 'Show All Stores';
              } else {
                displayRunItem('Meet Time', run.meet_time, mainCard);
                displayRunItem('Start Time', run.start_time, mainCard);
                displayRunItem('Note', run.note, mainCard);
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

        let showAll = false; // Flag to toggle between displaying all stores and just the first

        displayAllStoresButton(run);

        dayElement.appendChild(mainCard);
      });

      scheduleData.appendChild(dayElement);
    }
  })
  .catch((error) => console.error('Error fetching the schedule:', error));

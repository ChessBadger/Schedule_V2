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

            displayItem('Store Name', run.store_name[index], storeCard);
            displayItem('Store Address', run.store_address[index], storeCard);
            displayItem('Inventory Type', run.inv_type[index], storeCard);
            displayItem('Store Link', `<a href="${run.store_link[index]}">${run.store_link[index]}</a>`, storeCard);

            card.appendChild(storeCard);
          });
        };

        const displayItem = (label, value, container) => {
          const item = document.createElement('p');
          item.innerHTML = `<strong>${label}:</strong> ${value}`;
          container.appendChild(item);
        };

        displayItem('Meet Time', run.meet_time, mainCard);
        displayItem('Start Time', run.start_time, mainCard);
        displayItem('Note', run.note, mainCard);
        displayItem('Store Name', run.store_name[0], mainCard);
        displayItem('Store Address', run.store_address[0], mainCard);
        displayItem('Inventory Type', run.inv_type[0], mainCard);
        displayItem('Store Link', `<a href="${run.store_link[0]}">${run.store_link[0]}</a>`, mainCard);

        dayElement.appendChild(mainCard);

        let showAll = false; // Flag to toggle between displaying all stores and just the first

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Show All Stores';
        toggleButton.addEventListener('click', () => {
          mainCard.innerHTML = ''; // Clear the card before displaying

          if (showAll) {
            displayItem('Meet Time', run.meet_time, mainCard);
            displayItem('Start Time', run.start_time, mainCard);
            displayItem('Note', run.note, mainCard);
            showAll = false;
            toggleButton.textContent = 'Show All Stores';
          } else {
            displayAllStores(run, mainCard);
            showAll = true;
            toggleButton.textContent = 'Show Less';
          }
          mainCard.appendChild(toggleButton); // Ensure the button remains in the card
        });

        mainCard.appendChild(toggleButton);
      });

      scheduleData.appendChild(dayElement);
    }
  })
  .catch((error) => console.error('Error fetching the schedule:', error));

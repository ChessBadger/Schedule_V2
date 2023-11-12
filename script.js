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
        const card = document.createElement('div');
        card.classList.add('card');

        const displayItem = (label, value) => {
          const item = document.createElement('p');
          item.innerHTML = `<strong>${label}:</strong> ${value}`;
          card.appendChild(item);
        };

        // Display the first item of each list
        displayItem('Meet Time', run.meet_time);
        displayItem('Start Time', run.start_time);
        displayItem('Inventory Type', run.inv_type[0]);
        displayItem('Store Name', run.store_name[0]);
        displayItem('Store Address', run.store_address[0]);
        displayItem('Store Link', `<a href="${run.store_link[0]}">${run.store_link[0]}</a>`);
        displayItem('Note', run.note);

        dayElement.appendChild(card);

        // If there are multiple items, create a button to cycle through them
        if (run.store_name.length > 1) {
          const button = document.createElement('button');
          button.textContent = 'Next Store';
          let index = 1; // Start with the second item
          button.addEventListener('click', () => {
            displayItem('Store Name', run.store_name[index]);
            displayItem('Store Address', run.store_address[index]);
            displayItem('Inventory Type', run.inv_type[index]);
            displayItem('Store Link', `<a href="${run.store_link[index]}">${run.store_link[index]}</a>`);
            index = (index + 1) % run.store_name.length; // Loop through the items

            // Hide the button when reaching the last item
            if (index === 0) {
              button.style.display = 'none';
            } else {
              button.style.display = 'block'; // Ensure it's visible for other items
            }
          });
          card.appendChild(button);
        }
      });

      scheduleData.appendChild(dayElement);
    }
  })
  .catch((error) => console.error('Error fetching the schedule:', error));

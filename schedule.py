import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime, timedelta
import re
import os
import json

# Load credentials from a JSON file
with open('config.json') as config_file:
    credentials = json.load(config_file)

# Set up the credentials
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = Credentials.from_service_account_info(credentials, scopes=scope)
client = gspread.authorize(creds)

# Open the Google Sheets document by its title
spreadsheet = client.open('Week1')

# Select the worksheet by title
worksheet = spreadsheet.sheet1

# Get the value of cell A1
sunday_value = worksheet.acell('A1').value


# Get the current year
current_year = datetime.now().year

# Convert the string to a datetime object with the current year
sunday_date = datetime.strptime(
    sunday_value + f", {current_year}", '%a, %b %d, %Y')

# Create an array with the days of the week
days_of_week = [sunday_date.strftime('%a, %b %d')]

# Add the next six days (Monday to Saturday)
for i in range(1, 7):
    next_day = sunday_date + timedelta(days=i)
    days_of_week.append(next_day.strftime('%a, %b %d'))
    # ['Sun, Nov 05', 'Mon, Nov 06', 'Tue, Nov 07', 'Wed, Nov 08', 'Thu, Nov 09', 'Fri, Nov 10', 'Sat, Nov 11']


class Store_Run:
    # Constructor (initializer) method
    def __init__(self, meet_time, start_time, inv_type, store_name, store_address, store_link, note):
        self.meet_time = meet_time
        self.start_time = start_time
        self.inv_type = inv_type
        self.store_name = store_name
        self.store_address = store_address
        self.store_link = store_link
        self.note = note


def process_employee(employee_name):
    # Convert employee_name to uppercase
    # employee_name = employee_name.upper()

    # Find all occurrences of employee_name in column 2
    cell_list = worksheet.findall(employee_name, in_column=18)

    # Iterate through each occurrence
    for cell in cell_list:
        # Initialize variables for each iteration
        store_link = None
        start_time = None

        # Step 2: Move up one cell at a time until a link is found
        current_cell = cell

        # Add the any notes next to name
        note = worksheet.cell(current_cell.row, current_cell.col + 1).value
        # Remove new line characters
        if note:
            note = note.replace("\n", " ")

        while current_cell.row > 1:
            current_cell = worksheet.cell(current_cell.row - 1, 18)

            # Check if the content of the cell is not None and is a hyperlink
            if current_cell.value and re.match(r'^https?://', current_cell.value):
                store_link = current_cell.value.replace("\n", " ")
                break

        if store_link:
            # Step 3: Move up once cell above the link and set that as the store_address
            store_address = worksheet.cell(
                current_cell.row - 1, 18).value.replace("\n", " ")

            # Step 4: Move up one cell from the store_address and set that cell as the store_name
            store_name = worksheet.cell(
                current_cell.row - 2, 18).value.replace("\n", " ")

            # Step 5: Move one cell up from the store_name and set that cell as the inv_type
            inv_type = worksheet.cell(
                current_cell.row - 3, 18).value.replace("\n", " ")

            # Step 6: Move up one cell at a time until a cell is found that starts with a time in the format of HH:MM or H:MM
            while current_cell.row > 1:
                current_cell = worksheet.cell(current_cell.row - 1, 18)
                cell_value = current_cell.value
                # Check for HH:MM format
                if cell_value and re.match(r'\d{1,2}:\d{2}', cell_value.strip()):
                    start_time = cell_value.strip()
                    break
                elif cell_value and re.match(r'^https?://', cell_value):
                    # If another link is found before a time is found, add that link to store_link and repeat steps 3-5
                    store_link = cell_value.replace("\n", " ")
                    store_address = worksheet.cell(
                        current_cell.row - 1, 18).value.replace("\n", " ")
                    store_name = worksheet.cell(
                        current_cell.row - 2, 18).value.replace("\n", " ")
                    inv_type = worksheet.cell(
                        current_cell.row - 3, 18).value.replace("\n", " ")

        # Step 7: Move up one cell from the start_time and set it to the meet_time
        if start_time:
            meet_time = worksheet.cell(current_cell.row - 1, 18).value
        else:
            meet_time = None

        # Create an instance of the Store_Run class
        store_run_instance = Store_Run(
            meet_time, start_time, inv_type, store_name, store_address, store_link, note)
        print(store_run_instance.__dict__)


process_employee('Lashaun')

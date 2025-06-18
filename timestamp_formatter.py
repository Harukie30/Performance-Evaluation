from datetime import datetime

# Current time
current_time = "2024-03-19T09:45:00.000Z"  # Today at 9:45 AM

# Parse the timestamp
dt = datetime.fromisoformat(current_time.replace('Z', '+00:00'))

# Different ways to format the date and time
formats = {
    "Full format": dt.strftime("%A, %B %d, %Y at %I:%M %p"),  # Tuesday, March 19, 2024 at 09:45 AM
    "Short day format": dt.strftime("%a, %B %d, %Y at %I:%M %p"),  # Tue, March 19, 2024 at 09:45 AM
    "Simple format": dt.strftime("%A, %m/%d/%Y %I:%M %p"),  # Tuesday, 03/19/2024 09:45 AM
    "Compact format": dt.strftime("%a %m/%d/%Y %H:%M"),  # Tue 03/19/2024 09:45
    "Day and time": dt.strftime("%A at %I:%M %p"),  # Tuesday at 09:45 AM
}

# Print all formats
print("Current time:", current_time)
print("\nDifferent formats with day name:")
for format_name, formatted_date in formats.items():
    print(f"{format_name}: {formatted_date}") 
# Free-For-All

## This project was created for Elliot Technologies's coding challenge.
The purpose was to create an algorithm that would read a csv file containing a list of events and find the largest block of time between 08:00 and 22:00 to host a meeting within one week of the request.

### Note:
1. A large part of this project incorporated copious amounts of momentjs. 
2. The csv reading function calls the main function, `findFreeTime()`, which return a moment.range of dates. Upon the competion of that function, the reader logs a simple statement that breaks up that date range into a date, a start time, and an end time.

export const groupShowtimesByDay = showtimes => {
  let groupedTimes = [];

  showtimes.forEach(showtime => {
    const date = new Date(showtime.time);

    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (groupedTimes.filter(time => time.day.getTime() === day.getTime()).length === 0) {
      groupedTimes.push({
        day,
        times: [{
          id: showtime.id,
          time: date
        }]
      });
    } else {
      groupedTimes = groupedTimes.map(time => {
        if (time.day.getTime() === day.getTime()) {
          time.times.push({
            id: showtime.id,
            time: date
          });
        }

        return time;
      });
    }
  });

  // Sort each group
  groupedTimes = groupedTimes.map(group => ({...group, times: group.times.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())}));

  // Sort groups
  groupedTimes = groupedTimes.sort((a, b) => a.day.getTime() - b.day.getTime());

  return groupedTimes;
};

export const getWeekDay = date => {
  // Create an array containing each day, starting with Sunday.
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
    // Use the getDay() method to get the day.
  const day = date.getDay();
  // Return the element that corresponds to that index.
  return weekdays[day];
};

export const getNow = () => {
  return new Date().getTime() - (5 * 60 * 60 * 1000);
};

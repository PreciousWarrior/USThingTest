import axios from "axios";

// Converts the hours provided by API to a better format
function convertHoursTo24HourFormat(hoursString) {
  const result = {
    startTime: null,
    endTime: null,
  };

  if (hoursString === "Closed") {
    return result; // Return null times for "Closed"
  }

  if (hoursString === "24 Hours") {
    result.startTime = "00:00";
    result.endTime = "23:59"; // You can use "23:59" or "00:00" for the end of the day
    return result;
  }

  const [start, end] = hoursString.split(" - ");

  result.startTime = convertTo24Hour(start.trim());
  result.endTime = convertTo24Hour(end.trim());

  return result;
}

// Convert ampm to 24-hour format
function convertTo24Hour(timeString) {
  const [time, modifier] = timeString.split(/(am|pm)/);
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "pm" && hours !== 12) {
    hours += 12; // Convert PM hours to 24-hour format
  }
  if (modifier === "am" && hours === 12) {
    hours = 0; // Convert 12 AM to 0 hours
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

async function hours(req, res, next) {
  try {
    const response = await axios.get(
      "https://lbcone.hkust.edu.hk/hours/hoursapi/gethours?func=calendar"
    );
    let data = response.data;
    const startDate = req.query.start ? new Date(req.query.start) : new Date();
    // endDate a week from now by default
    const endDate = req.query.end
      ? new Date(req.query.end)
      : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    data = data.filter((item) => {
      // filter out items that are not within the date range
      const date = new Date(item.start);

      return date >= startDate && date <= endDate;
    });
    const returnData = {};
    data.forEach((item) => {
      const date = new Date(item.start);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!returnData[key]) {
        returnData[key] = {};
      }
      if (item.name === "Learning Commons") {
        returnData[key].lc = convertHoursTo24HourFormat(item.desc);
      }
      if (item.name === "G/F Entrance") {
        returnData[key].library = convertHoursTo24HourFormat(item.desc);
      }
      if (item.name === "LG5 Entrance") {
        returnData[key].lg5 = convertHoursTo24HourFormat(item.desc);
      }
    });
    return res.status(200).json(returnData);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "An error occoured.",
    });
  }
}

export default {
  hours: hours,
};

import type { ApiResponse, Region, RegionResponse } from "./types";

const checkMonth = (month:number, itemRegion:RegionResponse) => {
  return itemRegion.months_array.includes(month);
}

// availability is a string like "4 PM - 9 AM"
// if "NA" return an empty array
// if "All Day" return an array of hours from 0 to 23
// example: "4 PM – 9 AM" returns [16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8]
// return an array of hours as numbers
const getHours = (availability:string) => {
  if (availability === "NA") return [];
  if (availability === "All day") return Array.from({ length: 24 }, (_, i) => i);
  
  const [start, end] = availability.split(" – ").length > 1 ? availability.split(" – ") : availability.split(" – ");
  
  // Parse start time
  const startParts = start.trim().split(" ");
  let startHour = parseInt(startParts[0]);
  if (startParts[1] === "PM" && startHour !== 12) startHour += 12;
  if (startParts[1] === "AM" && startHour === 12) startHour = 0;
  
  // Parse end time
  const endParts = end.trim().split(" ");
  let endHour = parseInt(endParts[0]);
  if (endParts[1] === "PM" && endHour !== 12) endHour += 12;
  if (endParts[1] === "AM" && endHour === 12) endHour = 0;
  
  // Handle time ranges that cross midnight
  if (endHour <= startHour) {
    // Range crosses midnight: from startHour to 23, then 0 to endHour
    const hours = [];
    for (let hour = startHour; hour <= 23; hour++) {
      hours.push(hour);
    }
    for (let hour = 0; hour <= endHour; hour++) {
      hours.push(hour);
    }
    return hours;
  } else {
    // Normal range within same day
    return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);;
  }
}

const checkHour = (month:number, hour:number, itemRegion:RegionResponse) => {
  const hours = getHours(itemRegion.times_by_month[month]);
  return hours.includes(hour);
}

export const getCurrentlyAvailableItems = (items: ApiResponse[], region:Region, date:Date):ApiResponse[] => {
  const month = date.getMonth() + 1;
  const time = date.getHours();
  return items.filter((item) => {
    const itemRegion = region === 'north' ? item.north : item.south;

    return checkMonth(month, itemRegion) && checkHour(month, time, itemRegion);
  });
}


export const getAddressFromCoords = async (lat: number, lon: number) => {
  try {
    // Improved validation: 0 is a valid coordinate!
    if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
      console.error("Invalid coordinates:", lat, lon);
      return "Invalid coordinates";
    }

    // Corrected Delay: Added () to resolve
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'UwingoAracTakip/1.0',
          'Accept': 'application/json'
        },
      }
    );

    if (!response.ok) {
      return `Error: HTTP ${response.status}`;
    }

    const data = await response.json();

    if (data && data.address) {
      const { road, suburb, town, city, village, state, province, country } = data.address;

      // Select the best available "locality"
      const locality = town || city || village || '';
      const region = province || state || '';

      const addressParts = [road, suburb, locality, region, country].filter(Boolean);
      return addressParts.join(', ');
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Geocoding Error: ", error);
    return "Error fetching address";
  }
};
/**
 * Free geocoding using OpenStreetMap Nominatim API
 */
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'WorkeroApp/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocoding - get address from coordinates
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'User-Agent': 'WorkeroApp/1.0',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}


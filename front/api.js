// api.js

// api.js

import axios from 'axios';

const API_KEY = 'CaQE6rLitl1ia5TUqVajDTzwtQW2WEHujwp6FkmWSJ28hQew5v';
const BASE_URL = 'https://plant.id/api/v3';

const fetchRandomPlantData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/kb/plants/name_search?q=`, {
      headers: {
        'Api-Key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching random plant data:', error);
    return null;
  }
};

export { fetchRandomPlantData };

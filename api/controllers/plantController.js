const axios = require('axios'); 
require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

exports.searchPlants = async (req, res) => {
  try {
    const { q } = req.query;

    const config = {
      method: 'get',
      url: `https://plant.id/api/v3/kb/plants/name_search?q=${q}`,
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios(config);
    const { entities } = response.data;

    // Sort entities to display common names first
    entities.sort((a, b) => {
      if (a.matched_in_type === 'common_name' && b.matched_in_type !== 'common_name') {
        return -1;
      }
      if (a.matched_in_type !== 'common_name' && b.matched_in_type === 'common_name') {
        return 1;
      }
      return 0;
    });

    res.json(entities);
  } catch (error) {
    console.error('Error searching plants:', error);
    res.status(500).json({ error: 'Failed to search plants' });
  }
};

exports.getPlantDetails = async (req, res) => {
    try {
      const { accessToken } = req.params;
  
      const config = {
        method: 'get',
        url: `https://plant.id/api/v3/kb/plants/${accessToken}?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods&lang=en`,
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      };
  
      const response = await axios(config);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching plant details:', error);
      res.status(500).json({ error: 'Failed to fetch plant details' });
    }
  };

const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

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

exports.identifyPlant = async (req, res) => {
  try {
    //console.log('Request files in controller:', req.file);
    // Get base64 image data from request file
    const imageBase64 = await readFileAsync(req.file.path);
    console.log('Image Base64:', imageBase64);

    // Set up request data
    const requestData = {
      images: [imageBase64],
    };
    console.log('Request Data:', requestData);

    // Set up request config
    const config = {
      method: 'post',
      //url: 'https://plant.id/api/v3/identification',
      url: 'https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
      headers: {
        'Api-Key': apiKey, // Replace with your actual API key
        'Content-Type': 'application/json',
      },
      data: requestData,
    };
    console.log('Request Config:', config);

    // Send identification request
    const response = await axios(config);
    console.log('Identification Response:', response.data);

    // Handle response
    console.log('Identification Result:', response.data);

    // Send identification result back to client
    res.json(response.data);
  } catch (error) {
    console.error('Error identifying plant:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
};

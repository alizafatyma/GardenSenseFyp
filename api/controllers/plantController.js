const axios = require('axios');
const fs = require('fs');
const plantFact = require('../models/plantFact')

require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

function readFileAsync(file) {
  // console.log('File object:', file); // Log the file object for debugging
  return new Promise((resolve, reject) => {
    // Check if the file object is valid
    if (!file || !file.buffer) {
      reject(new Error('Invalid file object'));
      return;
    }

    try {
      // Convert buffer to base64 encoding
      const data = file.buffer.toString('base64');
      resolve(data);
    } catch (error) {
      reject(error);
    }
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
    // Check if file is present in request
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read image file asynchronously
    const imageBase64 = await readFileAsync(req.file);

    // Set up request data
    const requestData = {
      images: [imageBase64],
    };

    // Set up request config
    const config = {
      method: 'post',
      url: 'https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,propagation_methods,watering',
      headers: {
        'Api-Key': apiKey, // Replace with your actual API key
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    // Send identification request
    const identificationResult = await axios(config);

    // Check if identification result is present
    if (!identificationResult.data || !identificationResult.data.result) {
      return res.status(400).json({ error: 'Invalid identification result' });
    }

    const { result } = identificationResult.data;

    // Check if plant identification was successful
    if (!result.is_plant || !result.is_plant.binary) {
      return res.status(400).json({ error: 'Unable to identify a plant' });
    }

    // Check if plant identification probability is above threshold
    if (result.is_plant.probability < result.is_plant.threshold) {
      return res.status(400).json({ error: 'Identification probability too low' });
    }

    // Check if suggestions are present
    if (!result.classification || !result.classification.suggestions || result.classification.suggestions.length === 0) {
      return res.status(400).json({ error: 'No suggestions found for identification' });
    }

    // Extract the top suggestion
    const topSuggestion = result.classification.suggestions[0];

    // Prepare response for frontend
    const response = {
      access_token: identificationResult.data.access_token,
      id: topSuggestion.id,
      plant_name: topSuggestion.name,
      common_names: topSuggestion.details.common_names,
      probability: result.is_plant.probability,
      taxonomy: topSuggestion.details.taxonomy,
      description: topSuggestion.details.description,
      image: topSuggestion.details.image.value,
      edible_parts: topSuggestion.details.edible_parts,
      propagation_methods: topSuggestion.details.propagation_methods,
      watering: topSuggestion.details.watering,
      related_links: {
        wikipedia: topSuggestion.details.url,
        license: topSuggestion.details.image.license_url
      }
    };


    // Send response to frontend
    res.json(response);
  } catch (error) {
    console.error('Error identifying plant:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
};

exports.getPlantFacts = async (req, res) => {
  try {
    const facts = await plantFact.find();
    res.status(200).json(facts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facts: ' + error.message });
  }
}


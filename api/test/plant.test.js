(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../index'); // Replace with your server entry point
    const should = chai.should();
  
    chai.use(chaiHttp);
  
    describe('Plant Controller', () => {
  
      describe('GET /api/plants/search', () => {
        it('should search plants by name', (done) => {
          const query = 'rose'; // Replace with a valid plant name
          chai.request(server.default)
            .get('/api/plants/search')
            .query({ q: query })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for searchPlants as needed
      });
  
      describe('GET /api/plants/details/:accessToken', () => {
        it('should fetch plant details', (done) => {
          const accessToken = 'valid_access_token'; // Replace with a valid access token
          chai.request(server.default)
            .get(`/api/plants/details/${accessToken}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.have.property('plant_name');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for getPlantDetails as needed
      });
  
      describe('POST /api/plants/identify', () => {
        it('should identify a plant from an image', (done) => {
          // Replace with a valid image file for testing
          const imageFilePath = '/path/to/your/test/image.jpg';
          chai.request(server.default)
            .post('/api/plants/identify')
            .attach('image', fs.readFileSync(imageFilePath), 'image.jpg')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.have.property('plant_name');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for identifyPlant as needed
      });
  
      describe('GET /api/plants/facts', () => {
        it('should fetch plant facts', (done) => {
          chai.request(server.default)
            .get('/api/plants/facts')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for getPlantFacts as needed
      });
  
    });
  
  })();

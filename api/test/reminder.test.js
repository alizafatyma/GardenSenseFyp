(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../index'); // Replace with your server entry point
    const should = chai.should();
  
    chai.use(chaiHttp);
  
    describe('Reminder Controller', () => {
  
      describe('POST /reminders/:userId', () => {
        it('should create a new reminder', (done) => {
          const userId = '667712783eb0028a4e5c4a84'; // Replace with a valid user ID
          const newReminder = {
            plantId: 'valid_plant_id',
            dateTime: new Date(),
            category: 'Watering',
            frequency: 'Daily',
            plantDetails: {
              // Provide necessary plant details as required by your application
            },
            isPlantSaved: false // Set to true if the plant is already saved
          };
  
          chai.request(server.default)
            .post(`/reminders/${userId}`)
            .send(newReminder)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.an('object');
              res.body.should.have.property('message').eql('Reminder created successfully');
              res.body.should.have.property('reminder');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for createReminder as needed
      });
  
      describe('GET /reminders/user/:userId', () => {
        it('should fetch all reminders for a user', (done) => {
          const userId = '667712783eb0028a4e5c4a84'; // Replace with a valid user ID
          chai.request(server.default)
            .get(`/reminders/user/${userId}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for getReminders as needed
      });
  
      describe('DELETE /reminders/:reminderId', () => {
        it('should delete a reminder', (done) => {
          const reminderId = '6688469346ee1f003814872a'; // Replace with a valid reminder ID
          chai.request(server.default)
            .delete(`/reminders/${reminderId}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.have.property('message').eql('Reminder deleted successfully');
              // Add more assertions based on your expected output
              done();
            });
        });
  
        // Add more test cases for deleteReminder as needed
      });
  
    });
  })();
  
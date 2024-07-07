(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../index');
    const should = chai.should();
  
    chai.use(chaiHttp);
  
    describe('User Routes', () => {
  
      describe('POST /api/users/signup', () => {
        it('should register a new user', (done) => {
          const user = {
            fullName: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
            fcmToken: "samplefcmToken"
          };
          chai.request(server.default)
            .post('/api/users/signup')
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('User registered successfully. Verification email sent.');
              done();
            });
        });
  
        it('should not register a user with an existing email', (done) => {
          const user = {
            fullName: "Jane Doe",
            username: "janedoe",
            email: "johndoe@example.com", // existing email
            password: "password123",
            fcmToken: "samplefcmToken2"
          };
          chai.request(server.default)
            .post('/api/users/signup')
            .send(user)
            .end((err, res) => {
              res.should.have.status(409);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('User already exists');
              done();
            });
        });
      });
  
      describe('POST /api/users/login', () => {
        it('should login an existing user', (done) => {
          const user = {
            email: "johndoe@example.com",
            password: "password123"
          };
          chai.request(server.default)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              done();
            });
        });
  
        it('should not login a user with incorrect password', (done) => {
          const user = {
            email: "johndoe@example.com",
            password: "wrongpassword"
          };
          chai.request(server.default)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Invalid password');
              done();
            });
        });
  
        it('should not login a non-existent user', (done) => {
          const user = {
            email: "nonexistent@example.com",
            password: "password123"
          };
          chai.request(server.default)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Email not found');
              done();
            });
        });
      });
  
    });
  })();
  
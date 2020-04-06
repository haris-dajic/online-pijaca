const request = require('supertest');
const bcrypt = require('bcrypt');
const { User, createUser } = require('../../models/user');

let server;

describe('/api/auth', () => {
    let userInput;
    beforeEach(() => {
        server = require("../../app");
    });
    afterEach(async () => {
        await server.close();
        await User.remove({}).exec();
    });

    beforeEach(() => {
        userInput = {
            firstName: "Haris",
            lastName: "Dajić",
            username: "hdajic",
            email: "hdajic@gmail.com",
            password: "test225883"
        };
    });

    describe('/register', () => {
        it('should return 200 if input data are valid', async () => {
            const result = await request(server)
                    .post('/api/auth/register')
                    .send(userInput);
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('username', userInput.username);
            //expect(result.header['Authorization']).toBeDefined();
        });

        it('should return 400 if user already exist', async () => {
            const user = createUser(userInput);
            await user.save();
            const result = await request(server)
                    .post('/api/auth/register')
                    .send(userInput);
            expect(result.status).toBe(400);
        });

        it('should return 400 if input data are not valid', async () => {
            userInput.email = '';
            const result = await request(server)
                    .post('/api/auth/register')
                    .send(userInput);
            expect(result.status).toBe(400);
        });
    });

    describe('/login', () => {
        let loginData;

        beforeEach(() => {
            loginData = {
                username: 'hdajic',
                password: "test225883"
            };
        })

        it('should return 400 if input data are not valid', async () => {
            loginData.user = '';
            const result = await request(server)
                    .post('/api/auth/login')
                    .send(loginData);
            expect(result.status).toBe(400);
        });


        it('should return 200 if input data are valid and if user exists', async () => {
            const user = createUser(userInput);
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            const result = await request(server)
                    .post('/api/auth/login')
                    .send(loginData);
            expect(result.status).toBe(200);
        });
        
        it('should return 400 if password is not correct', async () => {
            const user = createUser(userInput);
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            loginData.password = 'novipassword123';
            const result = await request(server)
                    .post('/api/auth/login')
                    .send(loginData);
            expect(result.status).toBe(400);
        });

        it('should return 400 if user dont exists', async () => {
            const result = await request(server)
                    .post('/api/auth/login')
                    .send(loginData);
            expect(result.status).toBe(400);
        });
    });
});
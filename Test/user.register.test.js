const app = require('../app');
const express = require('express');
const request = require("supertest");
const mongoose = require('mongoose');
const User = require('../Models/user'); 
const {tokenGenerator} = require('../helpers/tokenGenerator');


it('Testing if jest is working', ()=>{
    expect(1).toBe(1)
})

jest.mock('../helpers/tokenGenerator', () => ({
    tokenGenerator: jest.fn(),
}));



 describe ("POST /api/auth/register", ()=>{
    
    beforeEach(() => {
        const app = express();
        app.post("/api/auth/register");
        request(app);
  });

    afterAll(async () => {
    await mongoose.disconnect();
  });

    test('validation of name is missing', async()=>{
        user = {
            email:"bouhamidi.sal@gmail.com",
            password: "test12345",
            phone: [{
                countrycode: "+11",
                phonenumber: "67877777676"
            }],
        };
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("\"name\" is required");
    })


    test('Validation of name less than 3 charcters', async()=>{
        user = {
            name: "sa",
            email:"bouhamidi.sal@gmail.com",
            password: "test12345",
            phone: [{
                countrycode: "+11",
                phonenumber: "67877777676"
            }],
        };
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("\"name\" length must be at least 3 characters long");
    });

    test('the email is duplicated', async()=>{
        user = {
            name: "Test",
            email:"bouhamidi.saluu@gmail.com",
            password: "test12345",
            phone: [{
                countrycode: "+11",
                phonenumber: "67877777676"
            }],
        };
        const response = await request(app).post('/api/auth/register').send(user);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email already exists");
    })

    test('password is hashed', async()=>{
        user = {
            name: "Test",
            email:"bouhamidi.saluu@gmail.com",
            password: "test12345",
            phone: [{
                countrycode: "+11",
                phonenumber: "67877777676"
            }],
        };
        const response = await request(app).post('/api/auth/register').send(user);
        const saveduser = await User.findOne({ email: user.email });
        expect(user.password).not.toBe(saveduser.password);
    })

    test('The user being save into my databse', async()=>{
            user = {
                name: "Test",
                email:"Test.saluu@gmail.com",
                password: "test12345",
                phone: [{
                    countrycode: "+11",
                    phonenumber: "67877777676"
                }],
            };
            const response = await request(app).post('/api/auth/register').send(user);
            const saveduser = await User.findOne({ email: user.email });
            expect(saveduser).not.toBeNull();
    });

    // test('should generate token after the user has been submitted', async () => {
    //     user = {
    //         name: "Test",
    //         email:"Test.saluu@gmail.com",
    //         password: "test12345",
    //         phone: [{
    //             countrycode: "+11",
    //             phonenumber: "67877777676"
    //         }],
    //     };  
        
    //     const response = await request(app).post('/api/auth/register').send(user);
    //     const usersaved = await User.findOne({ email: user.email });
    //     expect(usersaved).not.toBeNull();
    //     token = await tokenGenerator(usersaved, 10);
    //     expect(token).toBeDefined();
    //     });


})

describe("POST /api/auth/login", ()=>{
    test('the email is not correct', async()=>{
        user = {
            email:"TESThhh@gmail.com",
            password: "test12345"
        };
        const response = await request(app).post('/api/auth/login').send(user);
        // const saveduser = await User.findOne({email: user.email });
        // expect(saveduser).toBeNull();
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("The login is failed smth bad happened");
    });

})




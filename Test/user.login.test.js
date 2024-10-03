const app = require('../app');
const express = require('express');
const request = require("supertest");
const mongoose = require('mongoose');
const User = require('../Models/user'); 
const {tokenGenerator} = require('../helpers/tokenGenerator');
const checkHashedPassword = require('../helpers/checkHashedPassword');
const OTPGenerator = require('../helpers/OTPGenerator');
const emailConfirmation = require('../helpers/emailConfirmation');


it('Testing if jest is working', ()=>{
    expect(1).toBe(1)
})
describe("POST /api/auth/login", ()=>{

    beforeEach(() => {
        const app = express();
        app.post("/api/auth/login");
        request(app);
  });

    afterAll(async () => {
    await mongoose.disconnect();
  });


    test('the email is not correct', async()=>{
        user = {
            email:"TESThhh@gmail.com",
            password: "test12345"
        };
        const response = await request(app).post('/api/auth/login').send(user);
        const saveduser = await User.findOne({email: user.email });
        expect(saveduser).toBeNull();
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid email or password");
    });
    test('the password is incorrect', async()=>{
        user = {
            email: "bouhamidi.sal@gmail.com",
            password: 'wrongpass'
        }
        const response = await request(app).post('/api/auth/login').send(user);
        const saveduser = await User.findOne({email: user.email });
        expect(saveduser).not.toBeNull();
        await checkHashedPassword(user.password, saveduser.password);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid email or password")
    });

    test("valid email and password",async()=>{
        user = {
            email: "test@gmail.com",
            password: 'test12345'
        };
        const response = await request(app).post('/api/auth/login').send(user);
        const saveduser = await User.findOne({email: user.email });
        expect(saveduser).not.toBeNull();
        await checkHashedPassword(user.password, saveduser.password);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("user successfully loged")

    });
    test("The OTP Is Generated for user in the login",async()=>{
        user = {
            email: "bouhamidi.sal@gmail.com",
            password: 'test12345'
        };
        const response = await request(app).post('/api/auth/login').send(user);
        const saveduser = await User.findOne({email: user.email });
        expect(saveduser).not.toBeNull();
        await checkHashedPassword(user.password, saveduser.password);
        let otpgenerator =  await OTPGenerator(saveduser);
        expect(otpgenerator).not.toBeNull();

    });

    test("test that the OTP code is encoded and sent To the user", async()=>{
        user = {
            email: "bouhamidi.sal@gmail.com",
            password: 'test12345'
        };
        const response = await request(app).post('/api/auth/login').send(user);
        const saveduser = await User.findOne({email: user.email });
        expect(saveduser).not.toBeNull();
        await checkHashedPassword(user.password, saveduser.password);
        let otpgenerator =  await OTPGenerator(saveduser);
        console.log("otp codddddddde",otpgenerator);
        expect(otpgenerator).not.toBeNull();
        let code = btoa(`${otpgenerator.otpCode}/${otpgenerator.expiresIn}`);
        expect(code).not.toBeNull();
        expect(code).not.toBe(otpgenerator);
        let url = `http://localhost:3000/api/auth/verify-otp/${saveduser._id}/${code}`;
        let subject = `Your Verifictaion code is ${otpgenerator.otpCode}`
        let result = await  emailConfirmation( saveduser, url, subject);
        console.log('result issss', result);
        expect(result).not.toBeNull();
        expect(result).toBe("sent");
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("user successfully loged");

    });

})
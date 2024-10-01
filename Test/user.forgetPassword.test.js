const app = require('../app');
const express = require('express');
const request = require("supertest");
const mongoose = require('mongoose');
const User = require('../Models/user'); 
const tokenGenerator = require('../helpers/tokenGenerator');
const emailConfirmation = require('../helpers/emailConfirmation')

it('Testing if jest is working', ()=>{
    expect(1).toBe(1)
})
describe("POST /auth/forgetpassword", ()=>{
    beforeEach(() => {
        const app = express();
        app.post("/api/auth/register");
        request(app);
  });

    afterAll(async () => {
    await mongoose.disconnect();
  }); 

  test("the email is incorrect", async()=>{
        email = "Testyyyyy@gmail.com"
        const response = await request(app).post('/api/auth/forgetpassword').send(email);
        const user = await User.findOne({email:email});
        expect(user).toBeNull()
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Your Email is not valid");
  });

  test('the email is valid', async()=>{
    email = "bouhamidi.sal@gmail.com"
    const response = await request(app).post('/api/auth/forgetpassword').send(email);
    const user = await User.findOne({email:email});
    expect(user).not.toBeNull();
  });

  test('the token is generated and sent', async()=>{
    email= "bouhamidi.sal@gmail.com"
    const response = await request(app).post('/api/auth/forgetpassword').send({email});
    const user = await User.findOne({email:email});
    expect(user).not.toBeNull();
    let token = await tokenGenerator(user, 1);
    expect(token).not.toBeNull();
    let url =`http://localhost:3000/api/auth/resetpassword/${user._id}/${token}`;
    let subject = 'Reset Your password';
    let result = await emailConfirmation(user, url, subject);
    expect(result).not.toBeNull();
    expect(result).toBe("sent");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("email to reset your password is sent successfully");

  })
})
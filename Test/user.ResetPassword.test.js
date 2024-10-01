const app = require('../app');
const express = require('express');
const request = require("supertest");
const mongoose = require('mongoose');
const User = require('../Models/user'); 
const tokenGenerator = require('../helpers/tokenGenerator');
const VerifyJwt = require('../helpers/verifyJwt')

it('Testing if jest is working', ()=>{
    expect(1).toBe(1)
});
jest.setTimeout(10000);

describe("POST /auth/resetpassword/:id/:token", ()=>{
    beforeEach(() => {
        const app = express();
        app.post("/api/auth/register");
        request(app);
  });

    afterAll(async () => {
    await mongoose.disconnect();
  }); 
  test("test of non matching password", async()=>{
    let req = {
        params: {
            id:'66fc0170b0ef1f8e219ee115',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmMwMTcwYjBlZjFmOGUyMTllZTExNSIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTcyNzc5MTQ3MiwiZXhwIjoxNzI3ODI3NDcyfQ.TEApWTX7RCB1-Mll_oCM4LBFe6LDBq0d7CS1sA9zvuI'
        }
    }
    let user = {
        password:"test12345",
        confirmPassword: "test123456"
    };
    const response = await request(app).post(`/api/auth/resetpassword/${req.params.id}/${req.params.token}`).send(user);
    expect(user.password).not.toMatch(`/${user.confirmPassword}/i`)
    expect(response.body.message).toBe("The two passwords do not match")
});

  test("verification of jwt", async()=>{
            let req = {
                params: {
                    id:'66fc0170b0ef1f8e219ee115',
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmMwMTcwYjBlZjFmOGUyMTllZTExNSIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTcyNzc5MjMzOSwiZXhwIjoxNzI3Nzk1OTM5fQ.qGjN9AgBpP74nTcQimrKPd5irqbbaY6ZDngRjLJCXDc'
                }
            }
            let user = {
                password:"test12345",
                confirmPassword: "test12345"
            };
            const response = await request(app).post(`/api/auth/resetpassword/${req.params.id}/${req.params.token}`).send(user);
            let verification = await VerifyJwt(req.params.token, req.params.id);
            expect(response.status).toBe(200);
        });

        test("verification of updating password", async()=>{
            let req = {
                params: {
                    id:'66fc0170b0ef1f8e219ee115',
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmMwMTcwYjBlZjFmOGUyMTllZTExNSIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTcyNzc5MjMzOSwiZXhwIjoxNzI3Nzk1OTM5fQ.qGjN9AgBpP74nTcQimrKPd5irqbbaY6ZDngRjLJCXDc'
                }
            }
            let user = {
                password:"test12345",
                confirmPassword: "test12345"
            };
            const response = await request(app).post(`/api/auth/resetpassword/${req.params.id}/${req.params.token}`).send(user);
            await VerifyJwt(req.params.token, req.params.id);
            let userfound = await User.findOne({_id:req.params.id});
            expect(userfound).not.toBeNull();
            let userUpdated = await User.updateOne({_id:req.params.id}, {password:user.password});
            console.log(userUpdated);
            expect(userUpdated).not.toBeNull()
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("password reseted successfully")
        });


});
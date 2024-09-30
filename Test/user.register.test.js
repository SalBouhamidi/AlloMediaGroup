const userController  = require('../controllers/UserContoller');
const Joi = require('joi');
const {emailConfirmation, hashpassword, tokenGenerator} = require('../helpers');
const User = require('../Models/user');


it('Testing if jest is working', ()=>{
    expect(1).toBe(1)
})

// jest.mock('../helpers/emailConfirmation');
// jest.mock('../helpers/hashPassword');
// jest.mock('../helpers/tokenGenerator');
// jest.mock('../Models/user.js') 

// describe("userController.Register", ()=>{

//     beforeEach(()=>{
//         let req = {
//             body: {
//                 // name: 'Test',
//                 // email: 'unitTest@gmail.com',
//                 // password: 'password123',
//                 // phone:[{
//                 //     countrycode:'+212',
//                 //     phonenumber: '67363873983'
//                 // }],
//                 // isvalid: false,
//             }
//         }
//     let res = {
//         json: jest.fn(),
//         status: jest.fn().mockReturnThis(),
//     }
// })
 
// it('should give an error since the name is missing', async()=>{
//     req.body = {
//         email: 'unitTest@gmail.com',
//         password: 'password123',
//         countrycode:'+212',
//         phonenumber: '67363873983',
//     }
//     await userController.Register(req, res);
//     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: expect.any(Object)}))
// })




// //check hashed password


// //add user 


// //check if the user is added


// //generate a token



// //send email

// //return status 201 with msg user created successflly


// //if the user does not exist 


// //status 500

// })
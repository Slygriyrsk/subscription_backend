import { Router } from 'express';

//used from comtrollers to write clean code
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

//we have to send back the res to the client as JSON
authRouter.post('/sign-up', signUp/* (req, res) => {
    res.send({ 
        title: 'Sign up to your account'
    })
} */)

authRouter.post('/sign-in', signIn/* (req, res) => {
    res.send({ 
        title: 'Sign in to your account'
    })
} */)

authRouter.post('/sign-out', signOut /* (req, res) => {
    res.send({ 
        title: 'Sign out of your account'
    })
} */)

export default authRouter;
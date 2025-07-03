import { Router } from 'express';

const authRouter = Router();

//we have to send back the res to the client as JSON
authRouter.get('/sign-up', (req, res) => {
    res.send({ 
        title: 'Sign up to your account'
    })
})
authRouter.get('/sign-in', (req, res) => {
    res.send({ 
        title: 'Sign in to your account'
    })
})
authRouter.get('/sign-out', (req, res) => {
    res.send({ 
        title: 'Sign out of your account'
    })
})

export default authRouter;
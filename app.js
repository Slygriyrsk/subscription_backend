import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import cookieParser from 'cookie-parser';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

//need to use this to allow the req.body to be parsed and available in the req.body
app.use(express.json());//this is a middleware to parse JSON bodies we will not use this instead use other routes
app.use(express.urlencoded({ extended: false })); // another middleware to parse URL-encoded bodies by deault that express gives us
app.use(cookieParser()); // this is a middleware to parse cookies, we will not use this instead use other routes
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware); // Global error handling middleware and up there are the default middleware express has

app.get('/', (req, res) => {
  res.send('WELCOME TO SUBSCRIPTION TRACKER!');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);

  //database connection and since its a asyn operation we will use await
  await connectToDatabase();
});

export default app;
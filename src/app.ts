import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { IError } from './types/error.type';
import errorHandler from './middleware/errorhandler.middleware';
import router from './routes';

dotenv.config();

const app: Application = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
      success: true,
      message:  "Hello, TypeScript with Express!",
  })
})


app.use('/api', router);
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IError = new Error(
      `API Endpoint Not found - ${req.originalUrl}`,
  )
  error.status = 404
  next(error)
})



app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});


export default app;

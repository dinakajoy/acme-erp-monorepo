/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import createError from 'http-errors';
import session from 'express-session';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv-safe';
import swaggerUi from 'swagger-ui-express';
import authRoute from './api/routes/auth.route';
import employeeRoute from './api/routes/employee.route';
import clientRoute from './api/routes/client.route';
import jobRoute from './api/routes/job.route';
import financeRoute from './api/routes/finance.route';
import corsOption from './config/corsOptions';
import allowedOrigins from './config/allowedOrigins';
import store from './config/sessionStore';
import * as swaggerDocument from './api-docs.json';

dotenv.config();

declare module 'express-session' {
  interface SessionData {
    isAuthenticated: string | any;
  }
}

const app: Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const { origin } = req.headers || '';
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Headers', 'true');
    res.header('Content-Type', 'application/json');
  }
  next();
});

app.use(cors(corsOption));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET || 'mysecrets',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      // sameSite: true,
      httpOnly: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/clients', clientRoute);
app.use('/api/jobs', jobRoute);
app.use('/api/finance', financeRoute);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) =>
  res.status(err.status || 500).json({
    status: 'error',
    errors: err.message,
  })
);

export default app;

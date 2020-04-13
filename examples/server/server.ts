import * as express from 'express';
import * as graphQLHTTP from 'express-graphql';
import {schema} from './data/schema';

import * as cors from 'cors';

const APP_PORT: number = 3000;

const app = express();

app.use('*', cors({origin: 'http://localhost:4200'}));
app.use(
  '/graphql',
  graphQLHTTP({
    schema: schema,
    pretty: true,
  }),
);

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});

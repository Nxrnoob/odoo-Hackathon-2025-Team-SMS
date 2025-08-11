import express from 'express';
import cors from 'cors';
import authRoutes from './api/v1/auth/auth.controller';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

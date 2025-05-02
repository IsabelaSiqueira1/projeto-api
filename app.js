import express from 'express';
import pessoaRoutes from './routes/pessoaRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api Rodandooo');
});

app.use('/pessoas', pessoaRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

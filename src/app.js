const express = require('express');
const nocache = require('nocache');
const path = require('path');
const homeRouter = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(nocache());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', homeRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

// Importando módulos
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Definindo constantes
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Para visualização dos arquivos .ejs
app.set('views', __dirname + '/views/pages')
app.set('view engine', 'ejs')

// Definindo local dos arquivos estáticos
const pathPublic = path.join(__dirname, '..', 'public');
app.use(express.static(pathPublic));

//Definindo rotas
import indexRoute from './routes/indexRoute.js';
import gameRoute from './routes/gameRoute.js'


// Configurando Rotas
app.use('/', indexRoute);
app.use('/game', gameRoute);

// O servidor começa a 'rodar' na porta, apenas após a conexão com o banco de dados
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
 
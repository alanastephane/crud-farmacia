// Primeiro instalar o módulo mysql
// npm install mysql


const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'teste',
    database: 'farmacia'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para analisar o corpo das solicitações
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para salvar um remédio
app.post('/salvarRemedio', (req, res) => {
    const { nome, fabricante, indicacao, utilizacao } = req.body;

    const sql = 'INSERT INTO remedios (nome, fabricante, indicacao, utilizacao) VALUES (?, ?, ?, ?)';
    connection.query(sql, [nome, fabricante, indicacao, utilizacao], (err, result) => {
        if (err) {
            console.error('Erro ao salvar remédio:', err);
            res.status(500).send('Erro ao salvar remédio');
            return;
        }
        console.log('Remédio salvo com sucesso!');
        res.sendStatus(200);
    });
});

// Rota para listar os remédios
app.get('/listarRemedios', (req, res) => {
    const sql = 'SELECT * FROM remedios';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao obter lista de remédios:', err);
            res.status(500).send('Erro ao obter lista de remédios');
            return;
        }
        res.json(results);
    });
});

// Rota para atualizar um remédio
app.put('/atualizarRemedio', (req, res) => {
    const { id, nome, fabricante, indicacao, utilizacao } = req.body;

    const sql = 'UPDATE remedios SET nome=?, fabricante=?, indicacao=?, utilizacao=? WHERE id=?';
    connection.query(sql, [nome, fabricante, indicacao, utilizacao, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar remédio:', err);
            res.status(500).send('Erro ao atualizar remédio');
            return;
        }
        console.log('Remédio atualizado com sucesso!');
        res.sendStatus(200);
    });
});

// Rota para excluir um remédio
app.delete('/excluirRemedio/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM remedios WHERE id=?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir remédio:', err);
            res.status(500).send('Erro ao excluir remédio');
            return;
        }
        console.log('Remédio excluído com sucesso!');
        res.sendStatus(200);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

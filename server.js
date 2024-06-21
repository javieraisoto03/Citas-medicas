import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';

const app = express();
const PORT = 3000;

let users = [];

app.use(express.json());

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const user = response.data.results[0];
        
        const newUser = {
            id: uuidv4(),
            nombre: user.name.first,
            apellido: user.name.last,
            sexo: user.gender,
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        };
        
        users.push(newUser);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send({ error: 'Error registrando usuario' });
    }
});

// Ruta para consultar usuarios
app.get('/users', (req, res) => {
    const groupedUsers = _.groupBy(users, 'sexo');
    const mujeres = groupedUsers.female || [];
    const hombres = groupedUsers.male || [];
    
    console.log(chalk.bgWhite.blue('Mujeres:'));
    mujeres.forEach((user, index) => {
        console.log(chalk.bgWhite.blue(`${index + 1}. Nombre:${user.nombre}-Apellido:${user.apellido}-ID:${user.id}-Timestamp:${user.timestamp}`));
    });
    
    console.log(chalk.bgWhite.blue('Hombres:'));
    hombres.forEach((user, index) => {
        console.log(chalk.bgWhite.blue(`${index + 1}. Nombre:${user.nombre}-Apellido:${user.apellido}-ID:${user.id}-Timestamp:${user.timestamp}`));
    });

    res.send({ mujeres, hombres });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

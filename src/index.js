import { createServer } from 'node:http';
import { setTimeout } from 'node:timers/promises';
import { select, insert } from "./db.js";
import SqlBricks from 'sql-bricks';
import { once } from 'node:events';

const server = createServer(async (request, response) => {
  if (request.method === 'GET') {
    const query = SqlBricks
      .select('name, phone')
      .orderBy('name')
      .from('students')
      .toString();

    const items = await select(query);  // Aguarda a execução da consulta
    response.setHeader('Content-Type', 'application/json');
    return response.end(JSON.stringify(items));
  }

  if (request.method === 'POST') {
    try {
      const body = await once(request, 'data');
      const item = JSON.parse(body);

      await insert({ table: 'students', items: [item] });  // Aguarda a inserção no banco

      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        message: `Student: ${item.name} created with success`
      }));
    } catch (error) {
      response.statusCode = 400;
      response.end(JSON.stringify({
        error: 'Invalid request data'
      }));
    }
  }
});

server.listen(3000, () => console.log("Server is running at port 3000"));

// Simulando um pequeno atraso
await setTimeout(500);

// Fazendo uma requisição POST
{
  const result = await (await fetch('http://localhost:3000', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Wilson',
      phone: '76666dd565'
    }),
    headers: { 'Content-Type': 'application/json' }
  })).json();

  console.log('POST', result);
}

// Fazendo uma requisição GET
const getResult = await (await fetch('http://localhost:3000')).json();
console.log('GET', getResult);

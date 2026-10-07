require('dotenv').config();

console.log('####### SERVER BUILD MARKER 12345 #######');

const { seedIfEmpty, init } = require('./src/db/connection');
const taskService = require('./src/services/tasks.service');

const { createApp } = require('./src/app');

async function start() {
  // database start
  await init();
  const seedCount = await seedIfEmpty();
  
  // app start
  const app = createApp();
  const port = process.env.PORT || 3000;

  // database test
  console.log(seedCount);
  
  app.listen(port, () => {
    console.log(`CRUD API listening on port ${port}`);
  });

}

start();

module.exports = taskService;
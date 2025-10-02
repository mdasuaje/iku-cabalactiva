const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

app.post('/run-test', (req, res) => {
  const { filepath } = req.body;
  if (!filepath) {
    return res.status(400).json({ error: 'filepath es requerido' });
  }
  // Nota: En un entorno real, sanitizar la entrada es CRÍTICO.
  exec(`npx jest ${filepath} --json`, (error, stdout, stderr) => {
    if (error) {
      // Jest devuelve un error si las pruebas fallan, lo cual es esperado.
      // Devolvemos el stdout que contiene los resultados JSON.
      try {
        res.status(200).json(JSON.parse(stdout));
      } catch(e) {
        res.status(500).json({ error: stderr, rawOutput: stdout });
      }
      return;
    }
    res.status(200).json(JSON.parse(stdout));
  });
});

app.listen(8080, () => {
  console.log('MCP TDD Server escuchando en el puerto 8080');
});
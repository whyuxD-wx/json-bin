const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors()); 
app.use(express.json())

const xapikey = 'fuck-whyuxD'

app.use((req, res, next) => {
  const apikey = req.headers['x-api-key']
  if (!apikey || apikey !== xapikey) {
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' })
  }
  next()
})

const binFolder = path.join(__dirname, 'bins');
if (!fs.existsSync(binFolder)) fs.mkdirSync(binFolder);

// GET
app.get('/bin/:id', (req, res) => {
  const filePath = path.join(binFolder, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
  const data = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// CREATE
app.post('/bin/:id', (req, res) => {
  const filePath = path.join(binFolder, `${req.params.id}.json`);
  if (fs.existsSync(filePath)) return res.status(400).json({ error: 'Bin already exists' });
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ success: true, message: 'Bin created' });
});

// UPDATE
app.put('/bin/:id', (req, res) => {
  const filePath = path.join(binFolder, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ success: true, message: 'Bin updated' });
});

// DELETE
app.delete('/bin/:id', (req, res) => {
  const filePath = path.join(binFolder, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
  fs.unlinkSync(filePath);
  res.json({ success: true, message: 'Bin deleted' });
});

// LIST
app.get('/bins', (req, res) => {
  const files = fs.readdirSync(binFolder)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  res.json({ bins: files });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));


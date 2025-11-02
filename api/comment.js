import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'api', 'db.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newComment = JSON.parse(body);
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      data.push({ 
        name: newComment.name, 
        comment: newComment.comment, 
        date: new Date().toISOString() 
      });
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Ucapan tersimpan!' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

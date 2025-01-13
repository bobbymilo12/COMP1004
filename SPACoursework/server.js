const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the root directory

// Serve main.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.post('/saveFlashcard', (req, res) => {
    const flashcard = req.body;
    
    fs.readFile('flashcards.json', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to read file' });
        }
        
        const flashcards = data ? JSON.parse(data) : [];
        flashcards.push(flashcard);
        
        fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write file' });
            }
            res.json({ message: 'Flashcard saved successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
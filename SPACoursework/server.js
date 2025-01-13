const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/saveFlashcard', (req, res) => {
    const flashcard = req.body;
    fs.readFile('flashcards.json', (err, data) => {
        if (err) throw err;
        let flashcards = JSON.parse(data);
        flashcards.push(flashcard);
        fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), (err) => {
            if (err) throw err;
            res.status(200).json({ message: 'Flashcard saved successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
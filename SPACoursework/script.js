// filepath: /c:/Users/kamer/OneDrive/UNI/Year1/COMP1004/SPA Coursework/script.js
function showContent(contentId) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
}

function hideContent() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

document.getElementById('flashcardForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveFlashcard();
});

function saveFlashcard() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    const flashcard = {
        question: question,
        answer: answer
    };

    fetch('http://localhost:3000/saveFlashcard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcard)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        hideContent();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
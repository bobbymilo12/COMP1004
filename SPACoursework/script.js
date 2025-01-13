function showContent(contentId) {
    console.log('showContent called with contentId:', contentId);
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(contentId).style.display = 'block';
}

function hideContent() {
    console.log('hideContent called');
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('content').style.display = 'none';
}

function addFlashcardField() {
    console.log('addFlashcardField called');
    const flashcardFields = document.getElementById('flashcardFields');
    const newField = document.createElement('div');
    newField.classList.add('flashcardField');
    newField.innerHTML = `
        <label for="question">Question:</label>
        <input type="text" class="question" name="question" required><br><br>
        <label for="answer">Answer:</label>
        <input type="text" class="answer" name="answer" required><br><br>
    `;
    flashcardFields.appendChild(newField);
}

document.getElementById('flashcardForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('flashcardForm submit event');

    const questions = document.querySelectorAll('.question');
    const answers = document.querySelectorAll('.answer');
    const flashcards = [];

    for (let i = 0; i < questions.length; i++) {
        flashcards.push({
            question: questions[i].value,
            answer: answers[i].value
        });
    }

    console.log('Submitting flashcards:', flashcards);

    fetch('/saveFlashcard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcards)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        hideContent();
        loadFlashcards(); // Reload flashcards after saving
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function loadFlashcards() {
    console.log('loadFlashcards called');
    fetch('/flashcards')
        .then(response => {
            console.log('Response from /flashcards:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(flashcards => {
            console.log('Flashcards loaded:', flashcards); // Debugging log
            const container = document.getElementById('flashcardContainer');
            container.innerHTML = ''; // Clear existing flashcards
            flashcards.forEach((flashcard, index) => {
                const card = document.createElement('div');
                card.classList.add('flashcard');
                card.innerHTML = `
                    <div class="flashcard-inner" onclick="flipCard(this)">
                        <div class="flashcard-front">${flashcard.question}</div>
                        <div class="flashcard-back">${flashcard.answer}</div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading flashcards:', error));
}

function showFlashcards() {
    console.log('showFlashcards called');
    const container = document.getElementById('flashcardContainer');
    container.style.display = 'block';
    loadFlashcards();
}

function hideFlashcards() {
    console.log('hideFlashcards called');
    const container = document.getElementById('flashcardContainer');
    container.style.display = 'none';
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscKey);
}

function handleOutsideClick(event) {
    const container = document.getElementById('flashcardContainer');
    if (!container.contains(event.target)) {
        hideFlashcards();
    }
}

function handleEscKey(event) {
    const container = document.getElementById('flashcardContainer');
    if (event.key === 'Escape') {
        hideFlashcards();
    }
}

function flipCard(card) {
    console.log('flipCard called');
    card.classList.toggle('flipped');
}

// Load flashcards on page load
document.addEventListener('DOMContentLoaded', loadFlashcards);
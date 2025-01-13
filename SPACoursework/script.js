document.getElementById('flashcardForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    
    const flashcard = {
        question: question,
        answer: answer
    };
    
    fetch('/saveFlashcard', {
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
});
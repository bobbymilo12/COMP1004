$(document).ready(function() {
    // Load the home content by default
    loadHomeContent();

    // Handle navigation clicks
    $('#homeLink').click(function(event) {
        event.preventDefault();
        loadHomeContent();
    });

    $('#createLink').click(function(event) {
        event.preventDefault();
        loadCreateContent();
    });

    $('#viewLink').click(function(event) {
        event.preventDefault();
        loadViewContent();
    });

    function loadHomeContent() {
        $('#content').html(`
            <div class="text-center my-4">
                <h2>Welcome to Flash.io</h2>
                <p>Create and manage your own flashcards!</p>
            </div>
        `);
    }

    function loadCreateContent() {
        $('#content').html(`
            <div class="text-center my-4">
                <h2>Create Flashcards</h2>
                <form id="flashcardForm">
                    <div id="flashcardFields">
                        <div class="flashcardField">
                            <label for="question">Question:</label>
                            <input type="text" class="form-control question" name="question" required><br>
                            <label for="answer">Answer:</label>
                            <input type="text" class="form-control answer" name="answer" required><br>
                        </div>
                    </div>
                    <button type="button" class="btn btn-secondary" id="addFlashcardFieldBtn">Add Another Question</button><br><br>
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-danger" id="cancelBtn">Cancel</button>
                </form>
            </div>
        `);

        // Add event listeners for the form
        $('#addFlashcardFieldBtn').click(function() {
            $('#flashcardFields').append(`
                <div class="flashcardField">
                    <label for="question">Question:</label>
                    <input type="text" class="form-control question" name="question" required><br>
                    <label for="answer">Answer:</label>
                    <input type="text" class="form-control answer" name="answer" required><br>
                </div>
            `);
        });

        $('#flashcardForm').submit(function(event) {
            event.preventDefault();
            const flashcards = [];
            $('.flashcardField').each(function() {
                const question = $(this).find('.question').val();
                const answer = $(this).find('.answer').val();
                flashcards.push({ question, answer });
            });
            localStorage.setItem('flashcards', JSON.stringify(flashcards));
            alert('Flashcards saved!');
        });

        $('#cancelBtn').click(function() {
            $('#flashcardForm')[0].reset();
        });
    }

    function loadViewContent() {
        $('#content').html(`
            <div class="text-center my-4">
                <h2>View Flashcards</h2>
                <div id="flashcardContainer" class="overlay">
                    <!-- Flashcards will be dynamically inserted here -->
                </div>
                <button class="btn btn-secondary" id="loadFlashcardsBtn">Load Flashcards</button>
                <button class="btn btn-secondary" id="saveFlashcardsBtn">Save Flashcards</button>
                <input type="file" id="loadFlashcardsInput" style="display: none;">
            </div>
        `);

        // Add event listeners for loading and saving flashcards
        $('#loadFlashcardsBtn').click(function() {
            const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
            displayFlashcards(flashcards);
        });

        $('#saveFlashcardsBtn').click(function() {
            const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
            const blob = new Blob([JSON.stringify(flashcards, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flashcards.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        $('#loadFlashcardsInput').change(function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const flashcards = JSON.parse(e.target.result);
                    localStorage.setItem('flashcards', JSON.stringify(flashcards));
                    displayFlashcards(flashcards);
                };
                reader.readAsText(file);
            }
        });

        function displayFlashcards(flashcards) {
            const container = $('#flashcardContainer');
            container.empty();
            flashcards.forEach((flashcard, index) => {
                const card = $(`
                    <div class="flashcard">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">${flashcard.question}</div>
                            <div class="flashcard-back">${flashcard.answer}</div>
                        </div>
                    </div>
                `);
                card.find('.flashcard-inner').click(function() {
                    $(this).toggleClass('flipped');
                });
                container.append(card);
            });
        }
    }
});
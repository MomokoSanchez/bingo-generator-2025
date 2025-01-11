// Current version of the bingo entries (useful for debugging or future enhancements)
const BINGO_VERSION = "1.0.0"; 

// Load bingo entries and handle grid and popup
fetch('bingo-entries.json')
    .then(response => response.json())
    .then(data => {
        const savedGrid = JSON.parse(localStorage.getItem('bingoGrid'));

        // Populate the popup with all entries
        populateEntryList(data);

        // Check if a saved grid exists
        if (savedGrid) {
            generateBingoGrid(savedGrid); // Load saved grid
        } else {
            const newGrid = generateNewGrid(data);
            localStorage.setItem('bingoGrid', JSON.stringify(newGrid)); // Save new grid
            generateBingoGrid(newGrid);
        }
    })
    .catch(err => {
        console.error("Failed to load bingo entries:", err);
    });

/**
 * Generates a new 5x5 bingo grid with a fixed center cell.
 * @param {Array} entries - Array of bingo entry strings.
 * @returns {Array} - The grid as a flattened array.
 */
function generateNewGrid(entries) {
    const selectedEntries = [];

    // Randomly select 24 unique entries (excluding the center)
    while (selectedEntries.length < 24) {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        if (!selectedEntries.includes(randomEntry)) {
            selectedEntries.push(randomEntry);
        }
    }

    // Insert the "FREE SPACE" at the center
    return [...selectedEntries.slice(0, 12), 
            "FREE SPACE – Something that felt too absurd to be true", 
            ...selectedEntries.slice(12)];
}

/**
 * Populates the bingo grid in the DOM.
 * @param {Array} gridEntries - Flattened array of grid entries.
 */
function generateBingoGrid(gridEntries) {
    const grid = document.getElementById('bingo-grid');
    grid.innerHTML = ''; // Clear any existing cells

    gridEntries.forEach((entry, index) => {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = entry;

        // Highlight the center cell
        if (index === 12) {
            cell.classList.add('free-space');
        }

        grid.appendChild(cell);
    });
}

/**
 * Populates the popup list with all bingo entries.
 * @param {Array} entries - Array of bingo entry strings.
 */
function populateEntryList(entries) {
    const entryList = document.getElementById('entry-list');
    entryList.innerHTML = ''; // Clear existing list

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        entryList.appendChild(li);
    });
}

/**
 * Clears the grid and regenerates a new one.
 */
function regenerateGrid() {
    fetch('bingo-entries.json')
        .then(response => response.json())
        .then(data => {
            const newGrid = generateNewGrid(data);
            localStorage.setItem('bingoGrid', JSON.stringify(newGrid)); // Save new grid
            generateBingoGrid(newGrid); // Update the DOM
        })
        .catch(err => {
            console.error("Failed to regenerate grid:", err);
        });
}

// Add event listener to the "Regenerate" button
document.getElementById('regenerate').addEventListener('click', regenerateGrid);

// Popup functionality for viewing all entries
document.getElementById('show-all').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('hidden');
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
});

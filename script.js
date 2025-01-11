// Load bingo entries and generate grid
fetch('bingo-entries.json')
    .then(response => response.json())
    .then(data => {
        generateBingoGrid(data);
        populateEntryList(data);
    });

function generateBingoGrid(entries) {
    const grid = document.getElementById('bingo-grid');
    const selectedEntries = [];

    // Randomly select 25 unique entries
    while (selectedEntries.length < 25) {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        if (!selectedEntries.includes(randomEntry)) {
            selectedEntries.push(randomEntry);
        }
    }

    // Create grid cells
    selectedEntries.forEach(entry => {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = entry;
        grid.appendChild(cell);
    });
}

function populateEntryList(entries) {
    const entryList = document.getElementById('entry-list');
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        entryList.appendChild(li);
    });
}

// Popup functionality
document.getElementById('show-all').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('hidden');
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
});

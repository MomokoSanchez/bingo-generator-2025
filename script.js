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
    
        // Randomly select 24 unique entries (excluding the center)
        while (selectedEntries.length < 24) {
            const randomEntry = entries[Math.floor(Math.random() * entries.length)];
            if (!selectedEntries.includes(randomEntry)) {
                selectedEntries.push(randomEntry);
            }
        }
    
        // Add the "FREE SPACE" in the center
        const gridEntries = [...selectedEntries.slice(0, 12), 
                             "FREE SPACE – Something that felt too absurd to be true", 
                             ...selectedEntries.slice(12)];
    
        // Create grid cells
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

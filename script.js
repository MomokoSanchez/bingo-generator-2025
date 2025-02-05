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
            "FREE SPACE – Something too absurd to be true", 
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

document.getElementById('regenerate').addEventListener('click', regenerateGrid);

// Popup functionality for viewing all entries
document.getElementById('show-all').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('hidden');
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
});

// Close the popup when clicking outside, excluding the "Show All Entries" button
document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const showAllButton = document.getElementById('show-all');

    if (popup && !popup.classList.contains('hidden')) {
        // Check if the click is outside the popup content and not on the "Show All Entries" button
        if (!popupContent.contains(event.target) && event.target !== showAllButton) {
            popup.classList.add('hidden'); // Close the popup
        }
    }
});


// Add HTML2Canvas library dynamically
const html_canvas_script = document.createElement('script');
html_canvas_script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

document.head.appendChild(html_canvas_script);

document.getElementById('download-image').addEventListener('click', () => {
    const bingoGrid = document.getElementById('bingo-grid');
    const footerText = "Made by Momoko - madebymomoko.com/2025-bingo";

    html2canvas(bingoGrid).then(originalCanvas => {
        // Set up a new canvas
        const newCanvas = document.createElement('canvas');
        const ctx = newCanvas.getContext('2d');

        // Set dimensions for the new canvas
        const extraHeight = 50; // Space for the footer
        newCanvas.width = originalCanvas.width;
        newCanvas.height = originalCanvas.height + extraHeight;

        // Draw the original canvas onto the new canvas
        ctx.drawImage(originalCanvas, 0, 0);

        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, originalCanvas.height, newCanvas.width, extraHeight);

        // Add the footer text
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(footerText, newCanvas.width / 2, originalCanvas.height + 30); // Centered in footer

        // Convert the canvas to a downloadable image
        const imgData = newCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'bingo-card-2025.png';
        link.href = imgData;
        link.click();

        // Clean up the temporary canvas
        document.body.removeChild(newCanvas);
    }).catch(err => {
        console.error("Failed to capture image:", err);
    });
});


// PDF Download
const jspdf_script = document.createElement('script');
jspdf_script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
document.head.appendChild(jspdf_script);

document.getElementById('download-pdf').addEventListener('click', () => {
    const bingoGrid = document.getElementById('bingo-grid');
    const footerText = "Made by Momoko - madebymomoko.com/2025-bingo";

    html2canvas(bingoGrid).then(canvas => {
        // Get the canvas as an image
        const imgData = canvas.toDataURL('image/png');

        // Create a jsPDF instance
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'px', 'a4'); // Portrait, pixels, A4 size

        // Calculate scaling to fit the grid in the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Add the footer text
        pdf.setFontSize(12);
        pdf.text(footerText, pdfWidth / 2, pdfHeight + 20, { align: 'center' });

        // Save the PDF
        pdf.save('bingo-card-2025.pdf');
    }).catch(err => {
        console.error("Failed to generate PDF:", err);
    });
});


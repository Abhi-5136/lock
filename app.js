// State management
let selectedFiles = [];
let currentMode = 'encrypt';
let showPassword = false;
let selectionType = 'files';

// DOM elements
const modeButtons = document.querySelectorAll('.mode-btn');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const selectedFilesContainer = document.getElementById('selectedFiles');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordStrengthDiv = document.getElementById('passwordStrength');
const passwordErrorDiv = document.getElementById('passwordError');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const resultsDiv = document.getElementById('results');
const selectionModeDiv = document.getElementById('selectionMode');
const dropZoneText = document.getElementById('dropZoneText');

// Event listeners
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        updateButtons();
        updateFileInput();
        clearPasswordError();
    });
});

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFileSelect({ target: { files: e.dataTransfer.files } });
});

togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = showPassword ? '🙈' : '👁️';
});

passwordInput.addEventListener('input', () => {
    if (currentMode === 'encrypt') {
        validatePassword();
    } else {
        clearPasswordError();
    }
});

encryptBtn.addEventListener('click', handleEncrypt);
decryptBtn.addEventListener('click', handleDecrypt);

// Selection mode radio buttons
selectionModeDiv.addEventListener('change', (e) => {
    if (e.target.name === 'selectionType') {
        selectionType = e.target.value;
        updateFileInput();
        
        // Update active class on radio labels
        document.querySelectorAll('.radio-label').forEach(label => {
            label.classList.remove('active');
            if (label.querySelector('input').value === selectionType) {
                label.classList.add('active');
            }
        });
    }
});

// Initialize active state for default selection
document.querySelector('.radio-label input[value="files"]').parentElement.classList.add('active');

// Update file input based on mode
function updateFileInput() {
    fileInput.value = '';
    selectedFiles = [];
    updateSelectedFilesDisplay();
    
    // In decrypt mode, accept any file (no restrictions)
    if (currentMode === 'decrypt') {
        fileInput.removeAttribute('webkitdirectory');
        fileInput.removeAttribute('directory');
        fileInput.removeAttribute('accept');
        selectionModeDiv.style.display = 'none';
        dropZoneText.textContent = 'Drag & drop files here or click to select';
        return;
    }
    
    // In encrypt mode, show selection mode options
    selectionModeDiv.style.display = 'flex';
    
    if (selectionType === 'folder') {
        // Folder selection mode
        fileInput.removeAttribute('accept');
        fileInput.setAttribute('webkitdirectory', '');
        fileInput.setAttribute('directory', '');
        dropZoneText.textContent = 'Drag & drop a folder here or click to select folder';
    } else {
        // Files selection mode
        fileInput.removeAttribute('webkitdirectory');
        fileInput.removeAttribute('directory');
        fileInput.removeAttribute('accept');
        dropZoneText.textContent = 'Drag & drop files here or click to select';
    }
}

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    selectedFiles = files;
    updateSelectedFilesDisplay();
}

// Update selected files display
function updateSelectedFilesDisplay() {
    selectedFilesContainer.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        return;
    }
    
    selectedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        `;
        selectedFilesContainer.appendChild(fileItem);
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Validate password
function validatePassword() {
    const password = passwordInput.value;
    passwordStrengthDiv.className = 'password-strength';
    passwordStrengthDiv.textContent = '';
    passwordErrorDiv.textContent = '';
    
    if (!password) {
        return false;
    }
    
    let strength = 0;
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength < 3) {
        passwordStrengthDiv.classList.add('weak');
        passwordStrengthDiv.textContent = 'Weak password';
    } else if (strength < 5) {
        passwordStrengthDiv.classList.add('medium');
        passwordStrengthDiv.textContent = 'Medium strength';
    } else {
        passwordStrengthDiv.classList.add('strong');
        passwordStrengthDiv.textContent = 'Strong password';
    }
    
    if (!checks.length || !checks.uppercase || !checks.lowercase || !checks.number || !checks.special) {
        passwordErrorDiv.textContent = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character';
        return false;
    }
    
    return true;
}

// Clear password error
function clearPasswordError() {
    passwordErrorDiv.textContent = '';
}

// Update buttons state
function updateButtons() {
    if (currentMode === 'encrypt') {
        encryptBtn.disabled = false;
        decryptBtn.disabled = true;
    } else {
        encryptBtn.disabled = true;
        decryptBtn.disabled = false;
    }
}

// Handle encrypt
async function handleEncrypt() {
    if (selectedFiles.length === 0) {
        alert('Please select files to encrypt');
        return;
    }
    
    const password = passwordInput.value;
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    if (!validatePassword()) {
        alert('Password does not meet requirements');
        return;
    }
    
    resultsDiv.innerHTML = '';
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    
    try {
        // Check if files are from a folder (have webkitRelativePath)
        const isFolder = selectedFiles.length > 1 || (selectedFiles.length === 1 && selectedFiles[0].webkitRelativePath);
        
        if (isFolder) {
            // Encrypt as folder archive
            const encryptedBlob = await encryptFolder(selectedFiles, password);
            const fileName = 'encrypted_folder.secure';
            const resultItem = createResultItem('Folder', 'encrypted', encryptedBlob, fileName);
            resultsDiv.appendChild(resultItem);
        } else {
            // Encrypt individual files
            for (const file of selectedFiles) {
                const encryptedBlob = await encryptFile(file, password);
                const fileName = file.name + '.enc';
                const resultItem = createResultItem(file.name, 'encrypted', encryptedBlob, fileName);
                resultsDiv.appendChild(resultItem);
            }
        }
        
    } catch (error) {
        alert('Encryption failed: ' + error.message);
    }
    
    encryptBtn.disabled = false;
    decryptBtn.disabled = false;
}

// Handle decrypt
async function handleDecrypt() {
    if (selectedFiles.length === 0) {
        alert('Please select files to decrypt');
        return;
    }
    
    const password = passwordInput.value;
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    resultsDiv.innerHTML = '';
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    
    try {
        for (const file of selectedFiles) {
            if (file.name.endsWith('.secure')) {
                const decryptedFiles = await decryptFolder(file, password);
                
                decryptedFiles.forEach(decryptedFile => {
                    const resultItem = createResultItem(decryptedFile.name, 'decrypted', decryptedFile, decryptedFile.name);
                    resultsDiv.appendChild(resultItem);
                });
            } else {
                const decryptedBlob = await decryptFile(file, password);
                const fileName = file.name.replace('.enc', '');
                const resultItem = createResultItem(fileName, 'decrypted', decryptedBlob, fileName);
                resultsDiv.appendChild(resultItem);
            }
        }
    } catch (error) {
        alert('Decryption failed: ' + error.message);
    }
    
    encryptBtn.disabled = false;
    decryptBtn.disabled = false;
}

// Create result item
function createResultItem(name, type, blob, fileName) {
    const resultItem = document.createElement('div');
    resultItem.className = `result-item ${type}`;
    
    const url = URL.createObjectURL(blob);
    
    resultItem.innerHTML = `
        <div class="result-info">
            <div class="result-name">${name}</div>
            <div class="result-status">${type === 'encrypted' ? 'Encrypted successfully' : 'Decrypted successfully'}</div>
        </div>
        <div class="result-actions">
            ${type === 'decrypted' ? `<button class="action-icon-btn view-btn" onclick="viewFile('${url}')">👁️ View</button>` : ''}
            <button class="action-icon-btn download-btn" onclick="downloadFile('${url}', '${fileName}')">⬇️ Download</button>
        </div>
    `;
    
    return resultItem;
}

// View file in new tab
function viewFile(url) {
    window.open(url, '_blank');
}

// Download file
function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

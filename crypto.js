// ============================================================================
// ENCRYPTION PARAMETERS - MAXIMUM SECURITY LEVEL
// ============================================================================
// This implementation uses military-grade encryption standards:
// - AES-256-GCM: Authenticated encryption with 256-bit key (NSA-approved)
// - PBKDF2: Password-based key derivation with 5 million iterations
// - SHA-512: Cryptographic hash function for key derivation
// - 256-bit salt: Unique random salt for each encryption
// - 96-bit IV: Unique initialization vector for each encryption
//
// SECURITY LEVEL: Practically unbreakable with current technology
// - Brute-force attack: 5M PBKDF2 iterations make password cracking extremely slow
// - Rainbow table attacks: Prevented by unique 256-bit salt for each file
// - Known-plaintext attacks: Prevented by unique 96-bit IV for each encryption
// - Chosen-ciphertext attacks: Prevented by GCM authentication tag
// - Side-channel attacks: Mitigated by Web Crypto API (hardware-accelerated)
//
// Without the correct password, it is computationally infeasible to decrypt files.
// ============================================================================

const PBKDF2_ITERATIONS = 5000000; // 5 million iterations for extreme brute-force resistance
const SALT_LENGTH = 32; // 256 bits - unique salt for each encryption
const IV_LENGTH = 12; // 96 bits for GCM - standard IV length
const KEY_LENGTH = 32; // 256 bits for AES-256 - maximum key size

// Generate random bytes
function getRandomBytes(length) {
    return window.crypto.getRandomValues(new Uint8Array(length));
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Convert ArrayBuffer to Hex
function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Derive key from password using PBKDF2 with SHA-512 for maximum security
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );
    
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-512'
        },
        keyMaterial,
        { name: 'AES-GCM', length: KEY_LENGTH * 8 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Encrypt data using AES-256-GCM
async function encryptData(data, password) {
    const salt = getRandomBytes(SALT_LENGTH);
    const iv = getRandomBytes(IV_LENGTH);
    const key = await deriveKey(password, salt);
    
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        data
    );
    
    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return combined;
}

// Decrypt data using AES-256-GCM
async function decryptData(encryptedData, password) {
    const salt = encryptedData.slice(0, SALT_LENGTH);
    const iv = encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = encryptedData.slice(SALT_LENGTH + IV_LENGTH);
    
    const key = await deriveKey(password, salt);
    
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encrypted
        );
        return decrypted;
    } catch (error) {
        throw new Error('Decryption failed. Check your password and try again.');
    }
}

// Encrypt file
async function encryptFile(file, password) {
    const arrayBuffer = await file.arrayBuffer();
    const encrypted = await encryptData(arrayBuffer, password);
    return new Blob([encrypted], { type: 'application/octet-stream' });
}

// Decrypt file
async function decryptFile(file, password) {
    const arrayBuffer = await file.arrayBuffer();
    const encryptedData = new Uint8Array(arrayBuffer);
    const decrypted = await decryptData(encryptedData, password);
    return new Blob([decrypted], { type: 'application/octet-stream' });
}

// Encrypt folder (create archive)
async function encryptFolder(files, password) {
    const archive = {
        files: []
    };
    
    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        archive.files.push({
            name: file.name,
            type: file.type,
            size: file.size,
            relativePath: file.webkitRelativePath || file.name,
            data: base64
        });
    }
    
    const archiveString = JSON.stringify(archive);
    const encoder = new TextEncoder();
    const archiveBuffer = encoder.encode(archiveString);
    const encrypted = await encryptData(archiveBuffer, password);
    
    return new Blob([encrypted], { type: 'application/octet-stream' });
}

// Decrypt folder (extract archive)
async function decryptFolder(encryptedBlob, password) {
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    const encryptedData = new Uint8Array(arrayBuffer);
    const decrypted = await decryptData(encryptedData, password);
    const decoder = new TextDecoder();
    const archiveString = decoder.decode(decrypted);
    const archive = JSON.parse(archiveString);
    
    const files = [];
    for (const fileData of archive.files) {
        const arrayBuffer = base64ToArrayBuffer(fileData.data);
        const blob = new Blob([arrayBuffer], { type: fileData.type });
        const file = new File([blob], fileData.name, { type: fileData.type });
        file.relativePath = fileData.relativePath;
        files.push(file);
    }
    
    return files;
}

# SecureEncrypt - AES-256 File Encryption 

A secure client-side file encryption website that encrypts and decrypts various file types using military-grade AES-256-GCM encryption with PBKDF2 key derivation. Built with pure HTML, CSS, and JavaScript - no frameworks required.

## Features

- **Multiple Encryption Modes:**
- **Military-Grade Security:**
- **User-Friendly Interface:**

## Installation

No installation required!.

Simply open `index.html` in your web browser.

For best results, use a modern browser that supports Web Crypto API:
- Chrome 37+
- Firefox 34+
- Edge 12+
- Safari 11+


## Security Information

- **AES-256-GCM:** 
- **PBKDF2:**
- **SHA-256:**
- **256-bit Salt & 96-bit IV:**
- **Client-side only:** 

## Password Requirements

For encryption, passwords must meet the following criteria:
- At least 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character


## Browser Compatibility

Works in all modern browsers that support Web Crypto API (Chrome, Firefox, Edge, Safari).

## How It Works

### Encryption Process

1. User selects files and enters password
2. Password is combined with random salt (256 bits)
3. PBKDF2 derives a 256-bit encryption key (1,000,000 iterations)
4. Random IV (96 bits) is generated for each encryption
5. Data is encrypted using AES-256-GCM
6. Salt + IV + encrypted data are combined and saved

### Decryption Process

1. User selects encrypted files and enters password
2. Salt and IV are extracted from the encrypted data
3. Password is combined with salt to derive the key
4. Data is decrypted using AES-256-GCM
5. Original file is restored

### Folder Encryption

- Folders are encrypted as archives (similar to BitLocker)
- All files in the folder are combined into a single encrypted archive
- File structure and metadata are preserved
- Archive format: JSON with base64-encoded file data

## Security Guarantees

- **Zero-knowledge:** 
- **Brute-force resistant:**
- **No backdoors:** 
- **Mathematical security:** 


## Note

All encryption happens in your browser. Your files never leave your device. The encryption is mathematically unbreakable with current technology when using strong passwords.
No build process or server required!

# SecureEncrypt - AES-256 File Encryption (HTML/CSS/JavaScript)

A secure client-side file encryption website that encrypts and decrypts various file types using military-grade AES-256-GCM encryption with PBKDF2 key derivation. Built with pure HTML, CSS, and JavaScript - no frameworks required.

## Features

- **Multiple Encryption Modes:**
  - Individual file encryption
  - Folder encryption (BitLocker-style archive)
  - PDF file encryption
  - Image encryption

- **Military-Grade Security:**
  - AES-256-GCM encryption
  - PBKDF2 with 1,000,000 iterations (OWASP recommended)
  - SHA-256 cryptographic hash
  - 256-bit salt and 96-bit IV for each encryption
  - Client-side only - files never leave your device

- **User-Friendly Interface:**
  - Password visibility toggle
  - File preview after decryption (opens in new tab)
  - Download encrypted/decrypted files
  - Strong password validation
  - Step-by-step usage instructions
  - Modern, responsive UI

## Tech Stack

- **Frontend:** Pure HTML, CSS, JavaScript (ES6+)
- **Styling:** Custom CSS with modern design
- **Encryption:** Web Crypto API (AES-256-GCM, PBKDF2, SHA-256)

## Installation

No installation required! This is a static HTML/CSS/JavaScript application.

Simply open `index.html` in your web browser.

For best results, use a modern browser that supports Web Crypto API:
- Chrome 37+
- Firefox 34+
- Edge 12+
- Safari 11+

## Usage

### Encrypting Files

1. Select encryption type (Individual File, Folder, PDF, or Images)
2. Click "Encrypt" mode
3. Select files or folder to encrypt
4. Enter a strong password (12+ chars, uppercase, lowercase, number, special character)
5. Click "Encrypt Files"
6. Download the encrypted files

### Decrypting Files

1. Select encryption type
2. Click "Decrypt" mode
3. Select encrypted files (.enc or .secure)
4. Enter the password used for encryption
5. Click "Decrypt Files"
6. View or download the decrypted files

## Security Information

- **AES-256-GCM:** Military-grade encryption with authenticated mode
- **PBKDF2:** 1,000,000 iterations (OWASP recommended) for maximum brute-force resistance
- **SHA-256:** Cryptographic hash for key derivation
- **256-bit Salt & 96-bit IV:** Maximum security parameters
- **Client-side only:** Files never leave your browser

## Password Requirements

For encryption, passwords must meet the following criteria:
- At least 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## File Formats

- **Encrypted individual files:** `.enc` extension
- **Encrypted folders:** `.secure` extension (archive format)

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

- **Zero-knowledge:** Files are encrypted locally, never sent to any server
- **Brute-force resistant:** 1,000,000 PBKDF2 iterations make password cracking extremely slow
- **No backdoors:** Uses standard, audited cryptographic algorithms
- **Mathematical security:** AES-256-GCM is unbreakable with current technology when using strong passwords

## License

This project is open source and available for personal and commercial use.

## Note

All encryption happens in your browser. Your files never leave your device. The encryption is mathematically unbreakable with current technology when using strong passwords.

## Deployment

This is a static website that can be deployed anywhere:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service
- Local file system (just open index.html)

No build process or server required!

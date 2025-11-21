# mp3tag

Use filenames to add ID3 metadata to MP3 files.

This small Node.js script reads MP3 files from the `mp3/` directory, parses the filename for artist, album, track number and title, updates the ID3 tags, and moves processed files to `mp3/updated` (or `mp3/error` on failure).

## Quick summary

- Main entry: `index.js`
- Default input directory: `./mp3`
- Processed files moved to: `./mp3/updated`
- Files with incorrect filename format or errors moved to: `./mp3/error`

## Installation

Requirements:

- Node.js (recommended v14+)

To install dependencies, run:

```bash
npm install
```

## Filename format

The script expects filenames in this format:

Artist -- Album -- TrackNumber - Title.mp3

Examples:

- `Radiohead -- OK Computer -- 01 - Airbag.mp3`
- `Coldplay -- Parachutes -- 03 - Yellow.mp3`

Notes:

- The script splits on `--` to get Artist and Album. Everything after the second `--` is treated as track info.
- Track info expects `TrackNumber - Title...`, the number is parsed for `trackNumber` and the rest (after the first `-`) is the `title`.

If a file does not match the expected format the file will be moved to `mp3/error` and an error will be logged.

## Usage

1. Put your `.mp3` files into the `mp3/` directory at the repository root.
2. Install dependencies (`npm install`).
3. Run the script:

```bash
node index.js
```

Console output will show how many files were found and the progress of processing. Processed files are moved to `mp3/updated`.

## Customization

If you want to use a different directory, edit the `directoryPath` variable at the top of `index.js`:

```js
const directoryPath = "./mp3";
```

Change it to an absolute or relative path of your choosing.

## Troubleshooting

- Permission errors: ensure Node has permission to read/write the target directory.
- No files processed: verify your files end with `.mp3` and are in the configured directory.
- Unexpected metadata: the script uses `node-id3` to read and update ID3 tags. If tags are malformed the library may throw—such files will be moved to `mp3/error`.

## Tests

There is a `test` script configured in `package.json` that uses Vitest, but no tests are included by default. Run tests with:

```bash
npm test
```

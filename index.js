const fs = require('fs')
const NodeID3 = require('node-id3')

const directoryPath = './mp3'

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }
  console.log(`Found ${files.length} files in ${directoryPath}`)

  if (files.length === 0) {
    console.log('No files found in directory')
    return
  }

  if (!fs.existsSync(`${directoryPath}/updated`)) {
    fs.mkdirSync(`${directoryPath}/updated`)
  }

  if (!fs.existsSync(`${directoryPath}/error`)) {
    fs.mkdirSync(`${directoryPath}/error`)
  }

  for (const file of files) {
    console.log(
      `Processing ${files.indexOf(file) + 1} of ${files.length}: ${file}`
    )
    if (file.endsWith('.mp3')) {
      const filePath = `${directoryPath}/${file}`
      try {
        const metadata = await NodeID3.read(filePath)
        const filenameParts = file.split(' -- ')

        if (filenameParts.length >= 3) {
          metadata.artist = filenameParts[0].trim()
          metadata.album = filenameParts[1].trim()
          trackParts = filenameParts.slice(2)
          metadata.trackNumber = parseInt(
            trackParts[0].split(' - ')[0].trim(),
            10
          )
          metadata.title = trackParts[0]
            .split(' - ')
            .slice(1)
            .join(' - ')
            .trim()
            .replace('.mp3', '')

          await NodeID3.update(metadata, filePath)
          console.log(`Updated metadata for ${file}`)

          // move file to updated folder
          fs.rename(filePath, `${directoryPath}/updated/${file}`, () => {
            console.log(`Moved ${file} to updated`)
          })
        } else {
          console.error(`Filename format incorrect for ${file}`)
          fs.rename(filePath, `${directoryPath}/error/${file}`, () => {
            console.log(`Moved ${file} to error`)
          })
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
        fs.rename(filePath, `${directoryPath}/error/${file}`)
      }
    } else {
      console.log(`Skipping ${file}`)
    }
  }
})

const fs = require('fs')
const NodeID3 = require('node-id3')

const directoryPath = './mp3'

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }
  console.log(`Found ${files.length} files in ${directoryPath}`)

  for (const file of files) {
    console.log(
      `Processing ${files.indexOf(file) + 1} of ${files.length}: ${file}`
    )
    if (file.endsWith('.mp3')) {
      const filePath = `${directoryPath}/${file}`
      try {
        const metadata = await NodeID3.read(filePath)
        const filenameParts = file.split(' - ')
        if (filenameParts.length === 4) {
          metadata.artist = filenameParts[0].trim()
          metadata.album = filenameParts[1].trim()
          metadata.trackNumber = parseInt(filenameParts[2].trim(), 10)
          metadata.title = filenameParts[3].replace('.mp3', '').trim()
          await NodeID3.update(metadata, filePath)
          console.log(`Updated metadata for ${file}`)
          fs.rename(filePath, `${directoryPath}/updated/${file}`)
        } else {
          console.error(`Filename format incorrect for ${file}`)
          fs.rename(filePath, `${directoryPath}/error/${file}`)
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

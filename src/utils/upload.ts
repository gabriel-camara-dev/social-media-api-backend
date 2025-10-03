import { promises as fsPromises } from 'fs'
import path from 'path'
import sharp from 'sharp'

export const UploadService = {
  async deleteFile(filePath: string) {
    const fullPath = path.resolve(__dirname, '..', '..', 'uploads', filePath)

    try {
      await fsPromises.access(fullPath)
      await fsPromises.unlink(fullPath)
      return { success: true }
    } catch (err) {
      console.error('Error deleting file:', err)
      return { success: false, message: 'Error deleting file' }
    }
  },

  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = path.resolve(__dirname, '..', '..', 'uploads', filePath)
    try {
      await fsPromises.access(fullPath)
      return true
    } catch {
      return false
    }
  },

  async compressImage(filePath: string) {
    const inputPath = path.resolve(__dirname, '..', '..', 'uploads', filePath)
    const compressedFilename = `compressed-${filePath}`
    const outputPath = path.resolve(
      __dirname,
      '..',
      '..',
      'uploads',
      compressedFilename
    )

    try {
      await sharp(inputPath)
        .resize(1200)
        .jpeg({ quality: 80 })
        .toFile(outputPath)

      await this.deleteFile(filePath)

      return compressedFilename
    } catch (error) {
      console.error('Error compressing image:', error)
      return filePath
    }
  },
}

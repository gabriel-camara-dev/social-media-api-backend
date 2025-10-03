import { promises as fsPromises } from 'fs'
import path from 'path'

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
}

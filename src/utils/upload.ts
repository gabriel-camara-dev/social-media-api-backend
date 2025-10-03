import { promises as fsPromises } from 'fs'
import path from 'path'

export const UploadService = {
  async deleteDocument(docPath: string) {
    const fullPath = path.resolve(__dirname, '..', '..', 'uploads', docPath)

    try {
      await fsPromises.access(fullPath)
      await fsPromises.unlink(fullPath)
    } catch (err) {
      return { message: 'Error deleting image' }
    }
  },
}

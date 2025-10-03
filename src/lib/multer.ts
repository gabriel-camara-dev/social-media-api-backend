import multer from 'fastify-multer'
import path from 'path'
import crypto from 'crypto'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const fileName = `${fileHash}-${file.originalname}`
    cb(null, fileName)
  },
})

export const upload = multer({ storage })

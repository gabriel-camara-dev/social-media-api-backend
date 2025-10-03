// src/lib/multer.ts
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

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error('Invalid file type. Only JPEG, JPG, PNG and GIF are allowed')
      )
    }
  },
})

import sharp from 'sharp'

export class ImageCompressor {
  static async compressImage(
    inputPath: string,
    outputPath: string,
    options = { quality: 80, width: 1200 }
  ) {
    try {
      await sharp(inputPath)
        .resize(options.width)
        .jpeg({ quality: options.quality })
        .toFile(outputPath)

      return { success: true, outputPath }
    } catch (error) {
      return { success: false, error }
    }
  }
}

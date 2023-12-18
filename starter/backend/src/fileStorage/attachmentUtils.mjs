import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()
export const BUCKET_NAME = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function getUploadUrl(attachmentId) {
  console.log(`Generating presigned url for attachment id ${attachmentId}`)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: attachmentId
  })

  return await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
}

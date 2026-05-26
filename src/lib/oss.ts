import OSS from 'ali-oss'

let client: OSS | null = null

export function getOSSClient(): OSS {
  if (client) return client

  const region = process.env.OSS_REGION
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET
  const bucket = process.env.OSS_BUCKET

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error(
      'OSS 配置不完整，请设置 OSS_REGION, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET 环境变量'
    )
  }

  client = new OSS({ region, accessKeyId, accessKeySecret, bucket })
  return client
}

export function getOSSBucket(): string {
  return process.env.OSS_BUCKET || ''
}

export function getOSSEndpoint(): string {
  const region = process.env.OSS_REGION || ''
  return `https://${getOSSBucket()}.${region}.aliyuncs.com`
}

import axios from '../axios';

const awsS3Api = {
  async generateUploadUrl() {
    const response = await axios.private.get('/aws-s3/upload-url');
    return response.data;
  },
  async uploadFile(file: File) {
    const presign = await this.generateUploadUrl();
    const uploadUrl: string = presign?.data?.uploadUrl;
    const fileKey: string =
      presign?.data?.fileKey ?? presign?.data?.fileInfo?.fileKey;
    const bucketName: string = presign?.data?.fileInfo?.bucketName;

    if (!uploadUrl) throw new Error('Missing uploadUrl from presign response');

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    console.log('putResishere', putRes);

    if (!putRes.ok) {
      throw new Error(`S3 upload failed with status ${putRes.status}`);
    }

    return {
      fileKey,
      size: file.size,
      mimetype: file.type || 'application/octet-stream',
      rawResponse: presign,
    } as const;
  },
};

export default awsS3Api;

import axios from '../axios';

export type FileDeleteInput = { id: string };

const filesApi = {
  async deleteFilesByIds(fileIds: string[]) {
    const payload: FileDeleteInput[] = fileIds.map((id) => ({ id }));
    const response = await axios.private.delete('/files/delete', {
      data: payload,
    });
    return response.data;
  },
};

export default filesApi;

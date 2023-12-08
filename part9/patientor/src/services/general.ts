import axios from 'axios';
import { apiBaseUrl } from '../constants';

const ping = async (): Promise<void> => {
  void (await axios.get<void>(`${apiBaseUrl}/ping`));
};

export default { ping };

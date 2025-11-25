import axios from 'axios';

import env from '@/config/env';

const apiPrefix = 'api/v1';

const apiClient = axios.create({
  baseURL: `${env.journeyBuilderServerBaseUrl}/${apiPrefix}`,
});

export default apiClient;

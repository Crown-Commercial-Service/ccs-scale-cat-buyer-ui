import config from 'config';
import { genericFecthGet } from '../helpers/api';
import { FetchResult } from '../helpers/api.types';
import { ContentServiceMenu, EndPoints } from './api.types';
import { baseURL } from './helpers';

const timeout = Number(config.get('settings.fetch-timelimit'));

// GET /wp-json/wp-api-menus/v2/menus/:menu-id
const getMenu = async (menuId: string): Promise<FetchResult<ContentServiceMenu>> => {
  return genericFecthGet<ContentServiceMenu>(
    {
      baseURL: baseURL,
      path: EndPoints.MENU,
      params: { menuId }
    },
    {
      'Content-Type': 'application/json',
    },
    {
      key: `get_content_service_menu_${menuId}`,
      seconds: 3600
    },
    {
      name: 'content service',
      message: `Feached menu from the Content service API for menu: ${menuId}`
    },
    timeout
  );
};

const contentServiceAPI = {
  getMenu
};

export { contentServiceAPI };

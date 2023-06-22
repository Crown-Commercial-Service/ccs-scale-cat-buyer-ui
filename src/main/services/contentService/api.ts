import config from 'config';
import { genericFecthGet } from '../helpers/api';
import { FetchResult } from '../types/helpers/api';
import { ContentServiceMenu, EndPoints } from '../types/contentService/api';

const baseURL: string = config.get('contentService.BASEURL');
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
    timeout
  );
};

const contentServiceAPI = {
  getMenu
};

export { contentServiceAPI };

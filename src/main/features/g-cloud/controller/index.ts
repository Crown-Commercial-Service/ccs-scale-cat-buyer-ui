import { GET_CHOOSE_A_CATEGORY, POST_CHOOSE_A_CATEGORY } from './chooseACategory';
import { POST_SAVE_YOUR_SEARCH_RESULTS, POST_SAVE_YOUR_SEARCH, GET_SAVE_YOUR_SEARCH } from './saveYourSearch';
import { GET_DOWNLOAD_YOUR_SEARCH } from './downloadYourSearch';
import { GET_NEW_SEARCH, POST_NEW_SEARCH } from './newSearch';
import { GET_EXPORT_RESULTS, POST_EXPORT_RESULTS } from './exportResults';
import { GET_SEARCH } from './search';
import { GET_SAVED_SEARCHES, DELETE_SAVED_SEARCHES } from './savedSearches';
import { GET_NAME_PROJECT, POST_NAME_PROJECT } from './nameAProject';
import {
  GET_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR_TO_JAGGER,
  POST_PROCEED_COLLABORATORS,
  POST_ADD_COLLABORATOR_JSENABLED,
  POST_DELETE_COLLABORATOR_TO_JAGGER,
} from './addcollaborator';

import { GET_SERVICES } from './services';

export const gcloudController = {
  /**
   * @GET_VIEW
   */
  GET_CHOOSE_A_CATEGORY,
  POST_CHOOSE_A_CATEGORY,
  POST_SAVE_YOUR_SEARCH_RESULTS,
  POST_SAVE_YOUR_SEARCH,
  GET_DOWNLOAD_YOUR_SEARCH,
  GET_NEW_SEARCH,
  POST_NEW_SEARCH,
  GET_EXPORT_RESULTS,
  POST_EXPORT_RESULTS,
  GET_SEARCH,
  GET_SAVED_SEARCHES,
  DELETE_SAVED_SEARCHES,
  GET_NAME_PROJECT,
  POST_NAME_PROJECT,
  GET_SAVE_YOUR_SEARCH,
  GET_SERVICES,
  GET_ADD_COLLABORATOR,

  /**
   * @POST_VIEW
   */
  // POST_FILTER,
  POST_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR_TO_JAGGER,
  POST_ADD_COLLABORATOR_JSENABLED,
  POST_DELETE_COLLABORATOR_TO_JAGGER,
  POST_PROCEED_COLLABORATORS,
};

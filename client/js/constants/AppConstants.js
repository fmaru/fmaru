import keyMirror from 'keymirror';
export default {
  ActionTypes: keyMirror({
    RECEIVE_MANGA_LIST: null,
    RECEIVE_MANGA_DETAIL: null,
    RECEIVE_IMAGE_LIST: null,
    SEARCH: null,
    CHANGE_PAGE: null,
    SET_CURRENT_EPISODE: null
  })
};

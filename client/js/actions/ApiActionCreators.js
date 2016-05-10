import AppDispatcher from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes;

export default {
  receiveMangaList: function(mangaList){
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_MANGA_LIST,
      list:mangaList
    });
  },
  receiveMangaDetail: function(mangaId, mangaDetail){
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_MANGA_DETAIL,
      id: mangaId,
      detail: mangaDetail
    });
  },
  receiveImageList: function(mangaId, title, imageList){
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_IMAGE_LIST,
      id: mangaId,
      title: title,
      list: imageList
    });
  }

};

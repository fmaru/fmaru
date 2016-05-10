import AppDispatcher from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes;

export default {
  changePage: function (page) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PAGE,
      page: page
    });
  },
  setCurrentEpisode: function (id, title) {
    AppDispatcher.dispatch({
      type: ActionTypes.SET_CURRENT_EPISODE,
      id: id,
      title: title
    });
  }
};



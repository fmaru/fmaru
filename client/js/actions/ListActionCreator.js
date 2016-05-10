import AppDispatcher from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes;

export default {
  search: function(searchText){
    AppDispatcher.dispatch({
      type: ActionTypes.SEARCH,
      searchText: searchText
    })
  }
}


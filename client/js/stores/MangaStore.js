import AppDispatcher from '../dispatchers/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';
import EventEmitter from 'events';

const ActionTypes = AppConstants.ActionTypes;
const CHANGE_EVENT = 'change';

class MangaStore extends EventEmitter {
  constructor() {
    super();
    this.list = [];
    this.dispatchToken = null
    this.searchText = "";
  }

  searchList() {
    if (!this.searchText || this.searchText.length == 0){
      return [];
    }
    var result = this.list.filter((item) =>{
      return item.title.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
    });
    return result;

  }

  getInfo(id){
    var l = this.list.filter(function(value){
      return value.id == id
    });
    if(l.length > 0){
      return l[0];
    }
    return null;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

const store = new MangaStore();
store.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.RECEIVE_MANGA_LIST:
      store.list = action.list;
      store.emitChange();
      break;
    case ActionTypes.SEARCH:
      store.searchText = action.searchText
      store.emitChange();
      break;
  }

});
export default store;

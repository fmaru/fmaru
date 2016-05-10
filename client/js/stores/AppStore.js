import AppDispatcher from '../dispatchers/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';
import EventEmitter from 'events';

const ActionTypes = AppConstants.ActionTypes;
const CHANGE_EVENT = 'change';

class AppStore extends EventEmitter {
  constructor() {
    super();
    this.page = "search";
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback){
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

const store = new AppStore();
store.dispatchToken = AppDispatcher.register(function(action){
  switch(action.type) {
    case ActionTypes.CHANGE_PAGE:
      store.page = action.page;
      store.emitChange();
      break;
  }
});

export default store;



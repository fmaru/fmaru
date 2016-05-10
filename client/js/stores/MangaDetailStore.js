import AppDispatcher from '../dispatchers/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';
import EventEmitter from 'events';

const ActionTypes = AppConstants.ActionTypes;
const CHANGE_EVENT = 'change';

class MangaDetailStore extends EventEmitter {
  constructor() {
    super();
    this.detailTable = {}
    this.setMaxListeners(110);
  }

  emitChange(id) {
    this.emit(CHANGE_EVENT, id);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getDetail(id) {
    return this.detailTable[id];
  }
}

const store = new MangaDetailStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.type){
    case ActionTypes.RECEIVE_MANGA_DETAIL:
      store.detailTable[action.id] = action.detail;
      store.emitChange(action.id);
      break;
  }
});

export default store;

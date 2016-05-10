import AppDispatcher from '../dispatchers/AppDispatcher.js';
import AppConstants from '../constants/AppConstants.js';
import EventEmitter from 'events';

const ActionTypes = AppConstants.ActionTypes;
const CHANGE_EVENT = 'change';

class EpisodeStore extends EventEmitter {
  constructor() {
    super();
    // key: id, {key: title, value: data}
    this.episodes = {};
    this.curId = null;
    this.curTitle = null;
  }

  getData(id, title) {
    if (this.episodes[id] && this.episodes[id][title])
      return this.episodes[id][title];
  }

  emitChange(id, title) {
    this.emit(CHANGE_EVENT, id, title);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

const store = new EpisodeStore();
store.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.RECEIVE_IMAGE_LIST:
      if (!store.episodes[action.id]){
        store.episodes[action.id] = {};
      }
      store.episodes[action.id][action.title] = action.list
      store.emitChange(action.id, action.title);
      break;
    
    case ActionTypes.SET_CURRENT_EPISODE:
      console.log("set_current_episode");
      store.curId = action.id;
      store.curTitle = action.title;
      store.emitChange(action.id, action.title);
      break;
  }

});

export default store;

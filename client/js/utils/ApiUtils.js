import $ from 'jquery';
import ApiActionCreators from '../actions/ApiActionCreators.js';

export default {
  getMangaList: function() {
    $.get({
      url: config.apiUrl + "/api/manga_list",
    }).done(function(data){
      if(typeof data == "string" ){
        data = JSON.parse(data);
      }
      ApiActionCreators.receiveMangaList(data.list);
    });
  },

  getMangaDetail: function(mangaId, href) {
    $.get({
      url: config.apiUrl + "/api/manga",
      data: {
        href: href
      },
      success: function(data) {
        if(typeof data == "string" ){
          data = JSON.parse(data);
        }
        ApiActionCreators.receiveMangaDetail(mangaId, data);
      }
    });
  },

  getImageList: function(mangaId, title, href) {
    $.get({
      url: config.apiUrl + "/api/images",
      data: {
        href: href
      },
      success: function(data) {
        if(typeof data == "string" ){
          data = JSON.parse(data);
        }

        ApiActionCreators.receiveImageList(mangaId, title, data.images);
      }
    });
   
  }
};


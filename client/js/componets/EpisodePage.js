import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Paper from 'material-ui/Paper';
import AppStore from '../stores/AppStore';
import EpisodeStore from '../stores/EpisodeStore';
import MangaStore from '../stores/MangaStore';
import MangaDetailStore from '../stores/MangaDetailStore';
import ApiUtils from '../utils/ApiUtils';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AppActionCreators from '../actions/AppActionCreators';

class EpisodePage extends React.Component {
  constructor(props){
    super(props);
    this.state = this.makeState();
  }

  makeState(){
    var id = EpisodeStore.curId;
    var mangaTitle = MangaStore.getInfo(id).title;
    var episodeTitle = EpisodeStore.curTitle;
    var data = EpisodeStore.getData(EpisodeStore.curId, EpisodeStore.curTitle)
    var episodes = MangaDetailStore.getDetail(id).episodes;
    var idx = episodes.findIndex(function(value){
      return value.title == episodeTitle;
    });

    var title = episodeTitle.trim().replace(mangaTitle, "");

    if(mangaTitle.length > 15){
      title = mangaTitle.slice(0, 15) + "..." + " (" + title + ")";
    }
    else{
      title = mangaTitle + " (" + title + ")";
    }


    var state = {
      id: id,
      title: title,
      mangaTitle: mangaTitle,
      episodeTitle: episodeTitle,
      data: data,
      idx: idx,
      episodes: episodes
    };

    return state;
  }


  componentDidMount() {
    EpisodeStore.addChangeListener(this._onEpisodeStoreChanged);
  }

  componentWillUnmount() {
    EpisodeStore.removeChangeListener(this._onEpisodeStoreChanged);
  }

  _convertUrl(url) {
    if (url.endsWith("dat")){
      return config.apiUrl + "/dat?url=" + url;

    }
    else if (url.toLowerCase().indexOf("yuncomic") > -1){
      var comps = url.split('/').slice(3);
      return config.apiUrl + "/image/" + comps.join("/");
    }
    return url;
  }

  renderToolbar() {
    var icons = [];
    if(this.state.idx != 0){
      icons.push(
        <FontIcon
          key="prev"
          className="material-icons"
          onClick={this._prev}
        >
          keyboard_arrow_left
        </FontIcon>
      );
    }

    if(this.state.idx + 1 < this.state.episodes.length){
      icons.push(
        <FontIcon
          key="next"
          className="material-icons"
          onClick={this._next}
        >
          keyboard_arrow_right
        </FontIcon>
      );

    }
    
    return (
      <Toolbar style={{position:"fixed", width:"100%"}}>
        <ToolbarGroup>
          <ToolbarTitle text={this.state.title}></ToolbarTitle>
        </ToolbarGroup>
        <ToolbarGroup>
          {icons}
        </ToolbarGroup>
      </Toolbar>
     );
  }

  _prev = () => {
    console.log("onPrev");
    var idx = this.state.idx - 1;
    AppActionCreators.setCurrentEpisode(
      this.state.id, this.state.episodes[idx].title);
  }

  _next = () => {
    var idx = this.state.idx + 1;
    AppActionCreators.setCurrentEpisode(
      this.state.id, this.state.episodes[idx].title);

  }

  render() {
    if (!this.state.data){
      var detail = MangaDetailStore.getDetail(this.state.id);
      const title = this.state.episodeTitle;
      var hrefs = detail.episodes.filter(function(value){
        return value.title == title;
      }).map(function(value){
        return value.href
      });
      if (hrefs.length > 0){
        ApiUtils.getImageList(
          this.state.id,
          this.state.episodeTitle,
          hrefs[0]
        );
      }
    }
    var contents = null;
    if (!this.state.data) {
      contents = (
        <div style={{height:"120px"}}>
          <RefreshIndicator
            left={0}
            top={30}
            status="loading"
            style={{display: "inline-block", position: "relative"}}>
          </RefreshIndicator>
        </div>
      );
    }
    else {
      var images = [];
      const convertUrl = this._convertUrl;
      this.state.data.forEach(function(value, idx){
        images.push(
          <div key={idx} style={{width:"100%", textAlign:"center"}}>
            <img key={idx} src={convertUrl(value)} style={{maxWidth:"100%"}}/>
          </div>
        );
      });

      contents = (
        <div>
          {images}
        </div>
      );
    }

    var toolBar = this.renderToolbar();
    return (
      <Paper>
        {toolBar}
        <div style={{paddingTop:"56px", textAlign:"center"}}>
          {contents}
        </div>
      </Paper>
    );
  }

  _onEpisodeStoreChanged = (id, title) => {
    if (this.state.id == id){
      this.setState(this.makeState());
    }
  }
}

export default EpisodePage;

import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import ApiUtils from './utils/ApiUtils';
import MangaStore from './stores/MangaStore';
import AppStore from './stores/AppStore';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import TopBar from './componets/TopBar';
import MangaSearchPage from './componets/MangaSearchPage';
import EpisodePage from './componets/EpisodePage';

class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state = {showMenu: props.showMenu};
  }

  render() {
    return (
      <Drawer
        docked={false}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
      >
      </Drawer>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      page: AppStore.page
    };
  }

  componentDidMount() {
    MangaStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onAppStoreChange);
    ApiUtils.getMangaList();
  }
  componentWillUnmount() {
    MangaStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onAppStoreChange);
  }

  createLoadingIndicator() {
    const indicatorStyle = {
      display: "inline-block",
      position: "relative"
    };

    return (
      <div style={{
        textAlign: 'center'
      }}>
        <RefreshIndicator left={0} top={24} status="loading" style={indicatorStyle}>
        </RefreshIndicator>
        <div style={{paddingTop:"50px"}}>
          만화 목록을 가져오고 있습니다.
        </div>
      </div>
    );

  }
  createPage() {
    if (this.state.list.length == 0){
      return this.createLoadingIndicator()
    }
    switch(this.state.page){
      case "search":
        return (
          <MangaSearchPage list={this.state.list}>
          </MangaSearchPage>
        );
      case "episode":
        return (
          <EpisodePage>
          </EpisodePage>
        );
    }
  }
  

  render() {
    const contentStyle = {
      paddingTop: "64px"
    }

    var page = this.createPage();

    return (
      <div>
        <TopBar>
        </TopBar>
        <div style={contentStyle}>
        {page}
        </div>
      </div>
    );
  }
  toggleMenu = () => {
    this.setState({showMenu: !this.state.showMenu});
  }

  _onChange = () => {
    this.setState({list: MangaStore.list});
  }

  _onAppStoreChange = () => {
    this.setState({page: AppStore.page});
  }

}
export default Main;

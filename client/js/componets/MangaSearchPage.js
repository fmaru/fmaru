import React from 'react';
import SearchBar from './SearchBar';
import MangaList from './MangaList';

import MangaStore from '../stores/MangaStore';
import ApiUtils from '../utils/ApiUtils';

class MangaSearchPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const indicatorStyle = {
      display: "inline-block",
      position: "relative"
    };
    return (
      <div>
        <SearchBar list={this.props.list}></SearchBar>
        <div style={{paddingTop:"56px"}}>
          <MangaList></MangaList>
        </div>
      </div>
    );
  }

}

export default MangaSearchPage;

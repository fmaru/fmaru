import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ListActionCreator from '../actions/ListActionCreator';
import {grey100} from 'material-ui/styles/colors';

class SearchBar extends React.Component {
  render() {
    const barStyle = {
      position: "fixed",
      width: "100%",
      paddingTop: "0px",
      display: "flex",
      zIndex:8,
      backgroundColor: grey100
    }
    const iconStyles = {
      marginRight: 5,
    };

    var dataSource = this.props.list.map(function(item){
      return item.title;
    });
    this.autoComplete = (
      <AutoComplete
        dataSource={dataSource}
        maxSearchResults={5}
        filter={AutoComplete.caseInsensitiveFilter}
        hintText="만화 제목"
        onUpdateInput={this._onUpdateInput}
        onKeyDown={this._onKeyDown}
        onNewRequest={this._onNewRequest}>
      </AutoComplete>);

    global.autoComplete = this.autoComplete;

    return (
      <Toolbar style={barStyle}>
        <ToolbarGroup>
          {this.autoComplete}
          <FlatButton label="검색" icon={<ActionSearch/>} onClick={this._onSearch}>
					</FlatButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }

  _onUpdateInput = (t) => {
    this.searchText = t;
  }

	_onKeyDown = (event) => {
		if (event.key == "Enter"){
			this._onSearch();
		}
	}
  _onNewRequest = (t) => {
    this.searchText = t;
  }
	_onSearch = () => {
    ListActionCreator.search(this.searchText);
	}
}

export default SearchBar;

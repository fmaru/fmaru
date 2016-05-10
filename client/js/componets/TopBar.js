import React from 'react';
import AppBar from 'material-ui/AppBar';
import AppStore from '../stores/AppStore';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import AppActionCreators from '../actions/AppActionCreators';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: this._getTitle()}
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  }

 
  render() {
    const appBarStyle = {
      position: 'fixed'
    }
    return (
      <AppBar
        iconElementLeft={<IconButton onClick={this._onHomeTap}><ActionHome/></IconButton>}
        title={this.state.title}
        style={appBarStyle}> 
      </AppBar>
    )
  }
  _onHomeTap = () => {
    AppActionCreators.changePage("search");
  }

  _onChange = () => {
    this.setState({
      title: this._getTitle()
    });
  }

  _getTitle() {
    const page = AppStore.page;
    switch (page) {
      case "search":
        return "만화 검색";
      case "episode":
        return "만화 보기";
    }
  }
}

export default TopBar;

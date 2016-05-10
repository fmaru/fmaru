import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import MangaDetailStore from '../stores/MangaDetailStore';
import ApiUtils from '../utils/ApiUtils'
import {Grid, Row, Col} from 'react-bootstrap';
import AppActionCreators from '../actions/AppActionCreators';

class MangaItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: MangaDetailStore.getDetail(props.id)
    }
  }

  componentDidMount() {
    MangaDetailStore.addChangeListener(this._onChange);
    if (!this.state.detail){
      ApiUtils.getMangaDetail(this.props.id, this.props.href);
    }
  }
  componentWillUnmount() {
    MangaDetailStore.addChangeListener(this._onChange);
  }

  _createIndicator() {
    const indicatorStyle = {
      display: "inline-block",
      position: "relative"
    };

    const indicator = (
      <div style={{
        textAlign: 'center',
        height: '100px'
      }}>
        <RefreshIndicator left={0} top={30} status="loading" style={indicatorStyle}>
        </RefreshIndicator>
      </div>
    )

    return indicator;
  }

  _createContent() {
    const episodes = [];
    this.state.detail.episodes.forEach((value) => {
      const onClick = () => {
        AppActionCreators.changePage("episode");
        AppActionCreators.setCurrentEpisode(this.props.id, value.title);
      }
      var title = value.title.replace(this.props.title, "").trim();
      if (title.length < 2) {
        title = value.title;
      }
      episodes.push(
        <Col xs={6} md={2} key={value.title} style={{verticalAlign:"middle", textAlign: "center", height:50, cursor:"pointer"}} onClick={onClick}><span>{title}</span></Col>
      );
    });

    var imageUrl = this.state.detail.cover;
    if (imageUrl.indexOf("marumaru.in") > -1){
      var comps = imageUrl.split("\/").slice(3);
      imageUrl = config.apiUrl + "/preview/" + comps.join("/");
    }

    const content = (
      <Grid style={{padding:"20px"}}>
        <Row>
          <Col xs={6} md={3}>
            <img src={imageUrl} width="100%"/>
          </Col>
          <Col xs={6} md={9}>
            <Row>
              {episodes}
            </Row>
          </Col>
        </Row>
      </Grid>
    );

    return content;

  }

  render() {
    const style = {
      margin: "24px"
    };

    var contents = null;

    if (this.state.detail){
      contents = this._createContent();
    }
    else{
      contents = this._createIndicator();
    }

    const barStyle = {
      cursor: "pointer"
    };
    return (
      <Paper style={style}>
        <Toolbar style={barStyle}>
          <ToolbarGroup>
            <ToolbarTitle text={this.props.title}></ToolbarTitle>
          </ToolbarGroup>
        </Toolbar>
        {contents}
      </Paper>
    );
  }

  _onChange = (id) => {
    if(this.props.id == id){
      this.setState({
        detail: MangaDetailStore.getDetail(this.props.id)
      });
    }
  }
}

export default MangaItem;

import React from 'react';
import MangaItem from './MangaItem';
import MangaStore from '../stores/MangaStore';
import LazyLoad from 'react-lazyload';

const MAX_LIST = 10;
class MangaList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: MangaStore.searchList().slice(0, MAX_LIST)
    };
  }

  componentDidMount() {
    MangaStore.addChangeListener(this._onChange);
  }
  componentWillUnmount() {
    MangaStore.removeChangeListener(this._onChange);
  }
  render() {
    var items = [];
    this.state.list.forEach(function(value){
      items.push(
        <LazyLoad key={value.id} once height={156} offset={100}>
          <MangaItem id={value.id} title={value.title} href={value.href}/>
        </LazyLoad>
      );

    });
    return (
      <div>
          {items}
      </div>
    );
  }
  _onChange = () => {
    var list = MangaStore.searchList().slice(0, MAX_LIST);
    this.setState({list:list});
  }
}

export default MangaList;

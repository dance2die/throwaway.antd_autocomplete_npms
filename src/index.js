import React from "react";
import ReactDOM from "react-dom";
import debounce from "tiny-debounce";

import { AutoComplete, Icon, Input } from "antd";

import { getSuggestions } from "./data/SearchRepository";
import Suggestions from "./components/Suggestions";
import AutocompleteInput from "./components/AutoCompleteInput";

import "antd/dist/antd.css";
import "./styles.css";

const searchInput = React.createRef();
const Option = AutoComplete.Option;

function onSelect(value) {
  console.log("onSelect", value);
}

function renderOption(suggestion) {
  // console.log(`renderOption.suggestion`, suggestion);
  return (
    <Option key={suggestion.name}>
      <span>{suggestion.name}</span>
      <div>{suggestion.description}</div>
    </Option>
  );
}

class App extends React.Component {
  state = { suggestions: [] };

  componentDidCatch(err, info) {
    console.log(`err, info`, err, info);
  }

  fetchSuggestions = debounce(query => {
    console.log(`debounced with query=${query}`);

    if (query === "") {
      this.setState({ suggestions: [] });
      return;
    }

    getSuggestions(query).then(suggestions => this.setState({ suggestions }));
  }, 300);

  onSearch = query => {
    // console.log(`onSearch`, query);
    // const { value: query } = searchInput.current;
    this.fetchSuggestions(query);
  };

  onSearchSubmit = value => {
    console.log(`App.onSearchSubmit.value`, value);
  };

  render() {
    const { suggestions } = this.state;

    return (
      <div>
        {/*<label>
          <input onChange={this.onSearch} ref={searchInput} type="text" />
          🔍
        </label>
        {suggestions.length > 0 && <Suggestions suggestions={suggestions} />}*/}
        {/*<AutocompleteInput onSearchSubmit={this.onSearchSubmit} />*/}
        <AutoComplete
          dataSource={suggestions.map(renderOption)}
          style={{ width: "75vw" }}
          onSelect={onSelect}
          onSearch={this.onSearch}
          placeholder="input here"
        >
          <Input suffix={<Icon type="search" />} />
        </AutoComplete>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

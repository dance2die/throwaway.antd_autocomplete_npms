import React from "react";
import ReactDOM from "react-dom";
import debounce from "tiny-debounce";

import {
  AutoComplete,
  Icon,
  Input,
  Steps,
  Button,
  List,
  message,
  Avatar,
  Spin
} from "antd";

import { getSuggestions, getVersions } from "./data/SearchRepository";
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
  state = { suggestions: [], versions: [] };

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
    this.fetchSuggestions(query);
  };

  onSelect = packageName => {
    getVersions(packageName).then(versions => {
      console.log(`onSelect.versions`, versions);
      this.setState({ versions });
    });
  };

  onSearchSubmit = value => {
    console.log(`App.onSearchSubmit.value`, value);
  };

  render() {
    const { suggestions, versions } = this.state;

    return (
      <div>
        <header>
          <h2>Get Package versions</h2>
        </header>
        <section>
          <AutoComplete
            dataSource={suggestions.map(renderOption)}
            style={{ width: "75vw" }}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            placeholder="input here"
          >
            <Input suffix={<Icon type="search" />} />
          </AutoComplete>
          <aside>
            <h2>Versions</h2>
            <List
              dataSource={versions}
              renderItem={version => (
                <List.Item key={version}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={<a href="https://ant.design">{version}</a>}
                    description={version}
                  />
                  <div>{version}</div>
                </List.Item>
              )}
            >
              {/*this.state.loading &&
                this.state.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )*/}
            </List>
          </aside>
        </section>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

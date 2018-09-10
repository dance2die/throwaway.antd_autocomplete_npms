import React from "react";
import ReactDOM from "react-dom";
import debounce from "tiny-debounce";
import stable from "semver-stable";

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

const Option = AutoComplete.Option;

// Credit Michael Jackson
// https://github.com/unpkg/unpkg.com/blob/82d404a973cfe24a2a632859cbb6ab8958d48e9e/modules/utils/fetchNpmPackageInfo.js#L15
const encodedPackageName = packageName =>
  packageName.charAt(0) === "@"
    ? `@${encodeURIComponent(packageName.substring(1))}`
    : encodeURIComponent(packageName);

function renderOption(suggestion) {
  return (
    <Option key={suggestion.name} value={suggestion.name}>
      <span>{suggestion.name}</span>
      <div>{suggestion.description}</div>
    </Option>
  );
}

class App extends React.Component {
  state = {
    suggestions: [],
    versions: [],
    isLoadingVersions: false,
    stableVersionsOnly: true
  };

  componentDidCatch(err, info) {
    console.log(`err, info`, err, info);
  }

  fetchSuggestions = debounce(query => {
    const packageName = encodedPackageName(query);

    if (packageName === "") {
      this.setState(prevState => ({
        ...prevState,
        suggestions: [],
        versions: [],
        isLoadingVersions: false
      }));
    }

    getSuggestions(packageName).then(suggestions =>
      this.setState(prevState => ({
        ...prevState,
        suggestions,
        isLoadingVersions: true
      }))
    );
  }, 300);

  onSearch = query => {
    this.fetchSuggestions(query);
  };

  onSelect = (query, option) => {
    const packageName = encodedPackageName(query);

    getVersions(packageName).then(versions => {
      this.setState(prevState => ({
        ...prevState,
        versions,
        isLoadingVersions: false
      }));
    });
  };

  onSearchSubmit = value => {
    console.log(`App.onSearchSubmit.value`, value);
  };

  onStableVersionsOnlyClick = e => {
    this.setState({ stableVersionsOnly: e.target.checked });
  };

  filteredVersions = () => {
    const { stableVersionsOnly, versions } = this.state;
    if (stableVersionsOnly) {
      return versions.filter(stable.is);
    }

    return versions;
  };

  render() {
    const {
      suggestions,
      versions,
      isLoadingVersions,
      stableVersionsOnly
    } = this.state;

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
            placeholder="Search Package"
            optionLabelProp="value"
          >
            <Input suffix={<Icon type="search" />} />
          </AutoComplete>
          <aside>
            <h2>Versions</h2>
            <label>
              <input
                onClick={this.onStableVersionsOnlyClick}
                checked={stableVersionsOnly}
                type="checkbox"
              />Stable Versions Only
            </label>
            <List
              style={{ width: "75vw" }}
              dataSource={this.filteredVersions()}
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
              {isLoadingVersions && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </aside>
        </section>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

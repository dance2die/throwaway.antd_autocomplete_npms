import React, { PureComponent } from "react";
import AutoComplete from "react-autocomplete";
import debounce from "tiny-debounce";

import { getSuggestions } from "../data/SearchRepository";

const wrapperStyle = {
  display: "inline-block",
  width: "100%",
  position: "relative"
};

// Credit Shubham Kanodia - https://github.com/pastelsky
// https://github.com/pastelsky/bundlephobia/blob/bundlephobia/client/components/AutocompleteInput/AutocompleteInput.js
export default class AutocompleteInput extends PureComponent {
  static defaultProps = {
    initialValue: ""
  };

  state = {
    value: this.props.initialValue,
    suggestions: []
  };

  getSuggestions = debounce(query => {
    getSuggestions(query).then(suggestions => {
      this.setState({ suggestions });
    });
  }, 300);

  renderSuggestionItem = ({ name, version, description }) => (
    <div>
      <div>
        {name}
        {version && `@${version}`}
      </div>

      <div>{description}</div>
    </div>
  );

  handleSubmit = (e, e2, value) => {
    const { onSearchSubmit } = this.props;

    if (e) {
      e.preventDefault();
    }

    onSearchSubmit(value || this.state.value);
  };

  handleInputChange = ({ target }) => {
    this.setState({ value: target.value });
    const trimmedValue = target.value.trim();
    // const { name } = parsePackageString(trimmedValue);
    const name = trimmedValue;

    if (trimmedValue.length > 1) {
      this.getSuggestions(name);
    }
  };

  onSelect = (value, item) => {
    this.setState({ value, suggestions: [item] });
    this.handleSubmit(null, null, value);
  };

  renderMenu = (items, value, inbuiltStyles) => (
    <div style={{ minWidth: inbuiltStyles.minWidth }} children={items} />
  );

  render() {
    const { suggestions, value } = this.state;

    const baseFontSize =
      typeof window !== "undefined" && window.innerWidth < 640 ? 22 : 35;
    const maxFullSizeChars =
      typeof window !== "undefined" && window.innerWidth < 640 ? 15 : 20;
    const searchFontSize =
      value.length < maxFullSizeChars
        ? null
        : `${baseFontSize - (value.length - maxFullSizeChars) * 0.8}px`;
    const inputProps = {
      placeholder: "find package",
      autoCorrect: "off",
      autoCapitalize: "off",
      spellCheck: false,
      style: { fontSize: searchFontSize }
    };

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <AutoComplete
            getItemValue={item => item.name}
            inputProps={inputProps}
            onChange={this.handleInputChange}
            autoHighlight={false}
            value={value}
            items={suggestions}
            onSelect={this.onSelect}
            renderMenu={this.renderMenu}
            wrapperStyle={wrapperStyle}
            renderItem={this.renderSuggestionItem}
          />
        </div>
      </form>
    );
  }
}

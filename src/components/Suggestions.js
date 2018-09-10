import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

const Suggestion = ({ suggestion: { name, version, description } }) => (
  <Fragment>
    <div>
      <em>{name}</em>@<em>{version}</em>
    </div>
    <div>{description}</div>
  </Fragment>
);

class Suggestions extends PureComponent {
  static propTypes = {
    suggestion: PropTypes.shape({
      name: PropTypes.string,
      version: PropTypes.string,
      description: PropTypes.string
    }).isRequired
  };

  render() {
    const { suggestions } = this.props;
    console.log(`render.suggestions`, suggestions);

    const suggestionsItems = suggestions.map((suggestion, index) => (
      <li key={index}>
        <Suggestion suggestion={suggestion} />
      </li>
    ));

    return (
      <Fragment>
        <ul>{suggestionsItems}</ul>
      </Fragment>
    );
  }
}

export default Suggestions;

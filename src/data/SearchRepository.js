import axios from "axios";

// Credit to BundlePhobia by Shubham Kanodia
// https://github.com/pastelsky/bundlephobia/blob/59d865c01c9232b689b0ea3a3f4e4d655adff063/client/api.js#L53
const suggestionSort = (packageA, packageB) => {
  // Rank closely matching packages followed by most popular ones
  if (
    Math.abs(Math.log(packageB.searchScore) - Math.log(packageA.searchScore)) >
    1
  ) {
    return packageB.searchScore - packageA.searchScore;
  } else {
    return packageB.score.detail.popularity - packageA.score.detail.popularity;
  }
};

const getData = _ => _.data;
const sortData = _ => _.sort(suggestionSort);
const extractProperties = _ =>
  _.map(({ package: { name, version, description } }) => ({
    name,
    version,
    description
  }));

const getSuggestions = query =>
  axios
    .get(`https://api.npms.io/v2/search/suggestions?q=${query}`, false)
    .then(getData)
    .then(sortData)
    .then(extractProperties);

export { getSuggestions };

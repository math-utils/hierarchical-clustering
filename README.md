
# hierarchical-clustering

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Agglomerative Hierarchical clustering based on [How to Explain Hierarchical Clustering](http://www.analytictech.com/networks/hiclus.htm).

## Example

From [clusterfck](https://github.com/harthur/clusterfck#hierarchical):

```js
var cluster = require('hierarchical-clustering');
var colors = [
  [20, 20, 80],
  [22, 22, 90],
  [250, 255, 253],
  [100, 54, 255]
];

// Euclidean distance
function distance(a, b) {
  var d = 0;
  for (var i = 0; i < a.length; i++) {
    d += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(d);
}

// Single-linkage clustering
function linkage(distances) {
  return Math.min.apply(null, distances);
}

var levels = cluster({
  input: colors,
  distance: distance,
  linkage: linkage,
  minClusters: 2, // only want two clusters
});

var clusters = levels[levels.length - 1].clusters;
console.log(clusters);
// => [ [ 2 ], [ 3, 1, 0 ] ]
clusters = clusters.map(function (cluster) {
  return cluster.map(function (index) {
    return colors[index];
  });
});
console.log(clusters);
// => [ [ [ 250, 255, 253 ] ],
// => [ [ 100, 54, 255 ], [ 22, 22, 90 ], [ 20, 20, 80 ] ] ]
```

## API

```js
var cluster = require('hierarchical-clustering')
```

### var levels = cluster(options)

Options:

- `.input <Array> (required)` - input array
- `.distance <Function> (required)` - distance function
- `.linkage <Function> (required)` - linkage function or string of 'single', 'complete or 'average'
- `.minClusters <Integer> (1)` - number of clusters you want to iterate to
- `.maxLinkage <Integer> (Infinity)` - maximum linkage until you stop iteration

Function definitions:

```js
function distance(a, b) {
  // the smaller, the closer
  return <Number>
}

function linkage(distances) {
  // the smaller, the more similar
  return <Number>
}
```

The output is an array of `level`s, each which have the property:

- `.linkage <Number>` - the linkage of this level
- `.cluster <Array>` - the clusters at this level
- `.from <Integer>` - index of the last cluster which got merged and deleted
- `.to <Integer>` - index of the last cluster which got merged and appended

[gitter-image]: https://badges.gitter.im/math-utils/hierarchical-clustering.png
[gitter-url]: https://gitter.im/math-utils/hierarchical-clustering
[npm-image]: https://img.shields.io/npm/v/hierarchical-clustering.svg?style=flat-square
[npm-url]: https://npmjs.org/package/hierarchical-clustering
[github-tag]: http://img.shields.io/github/tag/math-utils/hierarchical-clustering.svg?style=flat-square
[github-url]: https://github.com/math-utils/hierarchical-clustering/tags
[travis-image]: https://img.shields.io/travis/math-utils/hierarchical-clustering.svg?style=flat-square
[travis-url]: https://travis-ci.org/math-utils/hierarchical-clustering
[coveralls-image]: https://img.shields.io/coveralls/math-utils/hierarchical-clustering.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/math-utils/hierarchical-clustering
[david-image]: http://img.shields.io/david/math-utils/hierarchical-clustering.svg?style=flat-square
[david-url]: https://david-dm.org/math-utils/hierarchical-clustering
[license-image]: http://img.shields.io/npm/l/hierarchical-clustering.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/hierarchical-clustering.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/hierarchical-clustering
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/

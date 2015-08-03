
var assert = require('assert')

var cluster = require('..')

describe('Colors', function () {
  // https://github.com/harthur/clusterfck#k-means
  var colors = [
    [20, 20, 80],
    [22, 22, 90],
    [250, 255, 253],
    [0, 30, 70],
    [200, 0, 23],
    [100, 54, 100],
    [255, 13, 8],
  ];

  it('should cluster', function () {
    var levels = cluster({
      input: colors,
      distance: euclideanDistance,
      linkage: singleLinkage,
    })
    assert(levels.length === 7)
    var last = levels[levels.length - 1]
    assert(last.clusters.length === 1)
    assert(last.clusters[0].length === 7)
    assert(last.from === 0)
    assert(last.to === 1)
  })

  it('should cluster (predefined single)', function () {
    var levels = cluster({
      input: colors,
      distance: euclideanDistance,
      linkage: 'single',
    })
    assert(levels.length === 7)
    var last = levels[levels.length - 1]
    assert(last.clusters.length === 1)
    assert(last.clusters[0].length === 7)
    assert(last.from === 0)
    assert(last.to === 1)
  })

  it('should cluster (predefined complete)', function () {
    var levels = cluster({
      input: colors,
      distance: euclideanDistance,
      linkage: 'complete',
    })
    assert(levels.length === 7)
    var last = levels[levels.length - 1]
    assert(last.clusters.length === 1)
    assert(last.clusters[0].length === 7)
    assert(last.from === 0)
    assert(last.to === 1)
  })

  it('should cluster (predefined average)', function () {
    var levels = cluster({
      input: colors,
      distance: euclideanDistance,
      linkage: 'average',
    })
    assert(levels.length === 7)
    var last = levels[levels.length - 1]
    assert(last.clusters.length === 1)
    assert(last.clusters[0].length === 7)
    assert(last.from === 0)
    assert(last.to === 1)
  })

  it('should support min clusters', function () {
    var levels = cluster({
      input: colors,
      distance: euclideanDistance,
      linkage: singleLinkage,
      minClusters: 3
    })
    assert(levels.length === 5)
    var last = levels[levels.length - 1]
    assert(last.clusters.length === 3)
    assert(last.from === 1)
    assert(last.to === 2)

    // match it against the example
    last.clusters.forEach(function (cluster) {
      switch (cluster.length) {
        case 1:
          assert(cluster[0] === 2)
          break
        case 2:
          assert(~cluster.indexOf(4))
          assert(~cluster.indexOf(6))
          break
        case 4:
          break
        default:
          throw new Error('nope')
      }
    })
  })
})

function euclideanDistance(a, b) {
  var out = 0
  a.forEach(function (x, i) {
    out += Math.pow(a[i] - b[i], 2)
  })
  return Math.sqrt(out)
}

function singleLinkage(arr) {
  return Math.min.apply(null, arr)
}

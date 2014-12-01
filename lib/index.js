
module.exports = Cluster

function Cluster(options) {
  if (!(this instanceof Cluster)) return new Cluster(options)

  if (!Array.isArray(options.input)) throw new TypeError('input must be an array')
  if (!options.input.length) throw new Error('input must not be empty')
  if (typeof options.distance !== 'function') throw new TypeError('invalid distance function')
  if (typeof options.linkage !== 'function') throw new TypeError('invalid linkage function')

  this.input = options.input
  this.distance = options.distance
  this.linkage = options.linkage

  // array of distances between each input index
  this.distances = createDistanceArray(options.input, options.distance)
  // cache lookup for similarities between clusters
  this.linkages = Object.create(null)

  // store the current clusters by indexes
  // this is private and gets rewritten on every level
  this.clusters = []
  for (var i = 0, l = options.input.length; i < l; i++) this.clusters.push([i])

  // store each level
  var level = {
    linkage: null,
    clusters: this.clusters,
  }
  this.levels = [level]

  var minClusters = options.minClusters || 1
  var maxLinkage = options.maxLinkage || Infinity

  while (this.clusters.length > minClusters && level.linkage < maxLinkage) level = this.reduce()
  return this.levels
}

/**
 * Merge the two most closely linked clusters.
 */

Cluster.prototype.reduce = function () {
  var clusters = this.clusters
  var min
  for (var i = 0; i < clusters.length; i++) {
    for (var j = 0; j < i; j++) {
      var linkage = this.linkageOf(clusters[i], clusters[j])

      // set the linkage as the min
      if (!min || linkage < min.linkage) {
        min = {
          linkage: linkage,
          i: i,
          j: j,
        }
      }
    }
  }

  clusters = this.clusters = clusters.slice()
  clusters[min.i] = clusters[min.i].concat(clusters[min.j])
  clusters.splice(min.j, 1)
  var level = {
    linkage: min.linkage,
    clusters: clusters,
    from: j,
    to: i,
  }
  this.levels.push(level)
  return level
}

/**
 * Calculate the linkage between two clusters.
 */

Cluster.prototype.linkageOf = function (clusterA, clusterB) {
  var hash = clusterA.join('.') + '-' + clusterB.join('.')
  if (this.linkages[hash]) return this.linkages[hash]

  // grab all the distances
  var distances = [];
  for (var k = 0; k < clusterA.length; k++) {
    for (var h = 0; h < clusterB.length; h++) {
      distances.push(this.distanceOf(clusterA[k], clusterB[h]))
    }
  }

  // cache and return the linkage
  return this.linkages[hash] = this.linkage(distances)
}

/**
 * Calculate the distance between two inputs.
 */

Cluster.prototype.distanceOf = function (i, j) {
  if (j < i) return this.distances[i][j]
  return this.distances[j][i]
}

/**
 * Create the upper triangle of the symmetric, distance matrix.
 * only i < j is valid for matrix[i][j].
 */

function createDistanceArray(input, distance) {
  var length = input.length
  var matrix = new Array(length)
  for (var i = 0; i < length; i++) {
    matrix[i] = new Array(i)
    for (var j = 0; j < i; j++) matrix[i][j] = distance(input[i], input[j])
  }

  return matrix
}

/*!
 * moe.object.artwork v0.0.1
 * (c) 2016 CookieJon
 * Released under the MIT License.
 * https://github.com/CookieJon
 */

 /* eslint-disable */

export default Artwork

function Artwork (options) {
  options = Object.assign({
    // defaults go here
  }, options)

  this.options = Artwork

  this._type = 'Artwork'
  this.title = 'Untitled'

  this.palette = null
  this.filters = []

}

Artwork.prototype = {

  constructor: Artwork,

  init (options) {

    this.options = options

    var self = this

  }

}


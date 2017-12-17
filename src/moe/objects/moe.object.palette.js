/*!
 * moe.object.palette v0.0.1
 * (c) 2016 CookieJon
 * Released under the MIT License.
 * https://github.com/CookieJon
 */

export default Palette

function Palette () {
  this._type = 'Bitmap'

  this.title = 'Untitled'
}

Palette.prototype = {

  constructor: Palette,

  init: () => {
    // this.imageData = new ImageData(this.width, this.height)
  }

}

import { Model } from 'vuex-orm'

export class Color extends Model {
  static entity = 'colors'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      hex: this.attr(''),
      r: this.attr(null),
      g: this.attr(null),
      b: this.attr(null),
      a: this.attr(null),
      h: this.attr(null),
      s: this.attr(null),
      v: this.attr(null),
      chroma: this.attr(null),
      luma: this.attr(null)
    }
  }
}

export class Palette extends Model {
  static entity = 'palettes'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      imageData: this.attr(Object),
      colors: this.hasMany(Color, 'id')
    }
  }
}

export class Bitmap extends Model {
  static entity = 'bitmaps'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      dataURL: this.attr(null),
      arrayBuffer: this.attr(null),
      imageData: this.attr(Object)
    }
  }
}

export class Artwork extends Model {
  static entity = 'artworks'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

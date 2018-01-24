import { Model } from 'vuex-orm'

export class Color extends Model {
  static entity = 'colors'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
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
      arrayBuffer: this.attr(null),
      dataURL: this.attr(null),
      imageData: this.attr(Object),
      pixels: this.attr(null),
      palette: this.hasOne(Palette, 'id'),
      palettes: this.hasManyBy(Palette, 'palettes')
    }
  }
}

export class Filter extends Model {
  static entity = 'filters'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      type: this.attr(''),
      relatedId: this.attr(null)
    }
  }
}

export class Artwork extends Model {
  static entity = 'artworks'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      // *artwork's private...'*
      // final output...
      pixels: this.attr(null),
      palette: this.attr(null),
      imageData: this.attr(null),
      // 1. artwork components. MUCH TODO:!
      filters: this.hasMany(Bitmap, 'id'),
      bitmap: this.hasOne(Bitmap, 'id'),
      pixelmap: this.attr(null),
      colormap: this.attr(null),
      slider: this.attr(null)
    }
  }
}

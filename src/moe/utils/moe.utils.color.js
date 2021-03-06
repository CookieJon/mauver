/*!
 vue-material-goodiesjs v0.8.1
 * (c) 2016 CookieJon
 * Released under the MIT License.
 * https://github.com/Alex-fun/vue-drag-and-drop-list#readme
 */
// 'use strict'
/* eslint-disable */

import 'image-q'

export default class ColorUtils {
  constructor () {
    console.log('constructor')
    for (var i=0; i< presetPalettes.length; i++) {
      console.log(presetPalettes[i])
    }
        // this._distance   = colorDistanceCalculator;
        // this._distance.setWhitePoint(255 << networkBiasShift,255 << networkBiasShift,255 << networkBiasShift,255 << networkBiasShift);
  }

  static presetPalettes = ['greyscale','bichromal','experiment1','experiment2','experiment3','experiment4','raw', 'lumawave', 'raw_lumaUndulating','b_rbgy12_rgby34_g123_w_lumaRising','b_rbgy12_rgby34_g123_w_lumaFalling','w_rgby1234_b_lumaUndulating','w_rgby1234_b_lumaRising','w_rgby1234_b_lumaFalling','supercolor_red','supercolor_green','empty']
	// Palette
	//


  //  ColorUtils.GeneratePaletteColors()

  static GeneratePaletteColors(id) {

    console.log('GeneratePaletteColors()', id)

    // Material color groupings
    var groups = {}
    var colors = ["red","pink","purple","deepPurple","indigo","blue","lightBlue","cyan", "teal","green","lightGreen","lime","yellow","amber","orange","deepOrange"]
    var greys = ["brown", "grey", "blueGrey"]

    // original palette
    var paletteFrom = Array.from(ColorUtils.getMaterialColors())
    var paletteTo = []

    // 1. Black & White
    groups["black"] = paletteFrom[0]
    groups["white"] = paletteFrom[255]

    // 2. Color Groups
    for (var i = 0; i < colors.length; i++) {
        groups[colors[i]] = paletteFrom.slice((i * 14) + 1, (i * 14) + 15)
    }
    // 3. Greys
    for (i = 0; i < greys.length; i++) {
        groups[greys[i]] = paletteFrom.slice((i * 10) + 225, (i * 10) + 235)
    }
    // Combinations
    groups.reds12 		= (groups.red).concat(groups.pink)
    groups.reds34 		= (groups.purple).concat(groups.deepPurple)
    groups.blues12 		= (groups.indigo).concat(groups.blue)
    groups.blues34		= (groups.lightBlue).concat(groups.cyan)
    groups.greens12 	= (groups.teal).concat(groups.green)
    groups.greens34		= (groups.lightGreen).concat(groups.lime)
    groups.yellows12 	= (groups.yellow).concat(groups.amber)
    groups.yellows34	= (groups.orange).concat(groups.deepOrange)
    groups.allReds 		= (groups.reds12).concat(groups.reds34)
    groups.allBlues 	= (groups.blues12).concat(groups.blues34)
    groups.allGreens 	= (groups.greens12).concat(groups.greens34)
    groups.allYellows 	= (groups.yellows12).concat(groups.yellows34)
    groups.allGreys 	= (groups.brown).concat(groups.grey).concat(groups.blueGrey)

    switch (id) {
      //  Raw
      default:
      case "raw":
        return ColorUtils.getMaterialColors()
        break

      // Misc.
      // case "supercolor":
      //     return getPaletteSuperColor

      case "empty":
        return []

      case "greyscale":
        let counter = 0
        for (let i=0; i<256; i++) {
          let hexpart = ("0" + (i).toString(16)).slice(-2)
          let hex = '#' + hexpart + hexpart + hexpart
          let color = ColorUtils.hexToColor(hex) // <-- Does rgba & hsv
          var name = 'greyscale' + i
          color.hex = hex;
          color.rgba32 = new Uint32Array((new Uint8Array([color.r, color.g, color.b, color.a])).buffer)[0]
          color.id = counter++
          paletteTo.push(color)
        }
        return paletteTo

      case "bichromal":
        paletteTo = paletteTo.concat(groups.black).concat(groups.white)
        return paletteTo

      // Experimental
      case "experiment1":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds))
        .concat(ColorUtils.shuffleFromTop(ColorUtils.sortColorsByLuma(groups.allBlues.concat(groups.allYellows).concat(groups.allGreys).concat(groups.allGreens)).reverse()))
        .concat(groups.white)
        return paletteTo

      case "experiment2":
        paletteTo = paletteTo
        .concat(groups.white)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds.concat(groups.allYellows)).reverse())
        .concat(ColorUtils.shuffleFromTop(ColorUtils.sortColorsByLuma(groups.allBlues.concat(groups.allGreens).concat(groups.allGreys)).reverse()))
        .concat(groups.black)
        return paletteTo

      case "experiment3":
        paletteTo = paletteTo
        .concat(groups.white)
        .concat(ColorUtils.sortColorsByLuma(groups.allGreens.concat(groups.allYellows)).reverse())
        .concat(ColorUtils.shuffleFromTop(ColorUtils.sortColorsByLuma(groups.allBlues.concat(groups.allReds).concat(groups.allGreys)).reverse()))
        .concat(groups.black)
        return paletteTo

      case "experiment4":
        var a = ColorUtils.sortColorsByLuma(groups.allYellows).slice(0,24)
        var b = ColorUtils.sortColorsByLuma(groups.allYellows).slice(24)
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(a)
        .concat(ColorUtils.sortColorsByLuma(groups.allBlues.concat(groups.allReds).concat(groups.allGreens).concat(b).concat(groups.allGreys)))
        .concat(groups.white)
        return paletteTo

      // w_rgby1234_b  <-- Nicest!!
      //
      case "w_rgby1234_b_lumaUndulating":
      case "lumawave":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds.concat(groups.grey).concat(groups.white)))
        .concat(ColorUtils.sortColorsByLuma(groups.allBlues).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.allGreens.concat(groups.blueGrey)))
        .concat(ColorUtils.sortColorsByLuma(groups.allYellows.concat(groups.brown)).reverse())
        return paletteTo

      case "w_rgby1234_g_b_lumaUndulating":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds))
        .concat(ColorUtils.sortColorsByLuma(groups.allBlues))
        .concat(ColorUtils.sortColorsByLuma(groups.allGreens))
        .concat(ColorUtils.sortColorsByLuma(groups.allYellows.reverse()))
        .concat(ColorUtils.sortColorsByLuma(groups.allGreys))
        .concat(groups.white)
        return paletteTo

      case "w_rgby1234_b_lumaRising":
        paletteTo = paletteTo
        .concat(groups.white)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds.concat(groups.grey)))
        .concat(ColorUtils.sortColorsByLuma(groups.allBlues))
        .concat(ColorUtils.sortColorsByLuma(groups.allGreens.concat(groups.blueGrey)))
        .concat(ColorUtils.sortColorsByLuma(groups.allYellows.concat(groups.brown)))
        .concat(groups.black)
        return paletteTo

      case "w_rgby1234_b_lumaFalling":
        paletteTo = paletteTo
        .concat(groups.white)
        .concat(ColorUtils.sortColorsByLuma(groups.allReds.concat(groups.grey)).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.allBlues).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.allGreens.concat(groups.blueGrey)).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.allYellows.concat(groups.brown)).reverse())
        .concat(groups.black)

          return paletteTo
      // b_rbgy12_rgby34_g123_w
      //
      case "b_rbgy12_rgby34_g123_w_lumaUndulating":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.reds12))
        .concat(ColorUtils.sortColorsByLuma(groups.blues12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.greens12))
        .concat(ColorUtils.sortColorsByLuma(groups.yellows12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.reds34))
        .concat(ColorUtils.sortColorsByLuma(groups.blues34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.greens34))
        .concat(ColorUtils.sortColorsByLuma(groups.yellows34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.blueGrey))
        .concat(ColorUtils.sortColorsByLuma(groups.grey))
        .concat(ColorUtils.sortColorsByLuma(groups.brown))
        .concat(groups.white)
        return paletteTo

      case "b_rbgy12_rgby34_g123_w_lumaRising":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.reds12))
        .concat(ColorUtils.sortColorsByLuma(groups.blues12))
        .concat(ColorUtils.sortColorsByLuma(groups.greens12))
        .concat(ColorUtils.sortColorsByLuma(groups.yellows12))
        .concat(ColorUtils.sortColorsByLuma(groups.reds34))
        .concat(ColorUtils.sortColorsByLuma(groups.blues34))
        .concat(ColorUtils.sortColorsByLuma(groups.greens34))
        .concat(ColorUtils.sortColorsByLuma(groups.yellows34))
        .concat(ColorUtils.sortColorsByLuma(groups.blueGrey))
        .concat(ColorUtils.sortColorsByLuma(groups.grey))
        .concat(ColorUtils.sortColorsByLuma(groups.brown))
        .concat(groups.white)
        return paletteTo

      case "b_rbgy12_rgby34_g123_w_lumaFalling":
        paletteTo = paletteTo
        .concat(groups.black)
        .concat(ColorUtils.sortColorsByLuma(groups.reds12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.blues12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.greens12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.yellows12).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.reds34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.blues34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.greens34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.yellows34).reverse())
        .concat(ColorUtils.sortColorsByLuma(groups.blueGrey))
        .concat(ColorUtils.sortColorsByLuma(groups.grey))
        .concat(ColorUtils.sortColorsByLuma(groups.brown))
        .concat(groups.white)
        return paletteTo
    }
  }


  // Material Design color defaults
  //
  static drawPixels (pointContainer, width0, width1) {
    var idxi8 = pointContainer.toUint8Array()
    var idxi32 = new Uint32Array(idxi8.buffer)

    width1 = width1 || width0
    var can = document.createElement('canvas')
    var can2 = document.createElement('canvas')
    var ctx = can.getContext('2d')
    var ctx2 = can2.getContext('2d')
    can.width = width0
    can.height = Math.ceil(idxi32.length / width0)
    can2.width = width1
    can2.height = Math.ceil(can.height * width1 / width0)
    ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.msImageSmoothingEnabled = false
    ctx2.imageSmoothingEnabled = ctx2.mozImageSmoothingEnabled = ctx2.webkitImageSmoothingEnabled = ctx2.msImageSmoothingEnabled = false
    var imgd = ctx.createImageData(can.width, can.height)
    // if (QuantizationUsage._typeOf(imgd.data) == 'CanvasPixelArray') {
    //   var data = imgd.data
    //   for (var i = 0, len = data.length; i < len; ++i) {
    //     data[i] = idxi8[i]
    //   }
    // } else {
    var buf32 = new Uint32Array(imgd.data.buffer)
    buf32.set(idxi32)
    // }
    ctx.putImageData(imgd, 0, 0)
    ctx2.drawImage(can, 0, 0, can2.width, can2.height)
    return can2
  }

  static getMaterialColors (startIndex, howMany) {
    var materialJSON = {
      // Material Palette:
      // 16 x 10 + 4 hues
      // 3 x 10 grey/brown
      // 1b + 1w
      // = 256 colors
      'Black': {
        '500': '#000000'
      },
      'Red': {
        '50': '#FFEBEE',
        '100': '#FFCDD2',
        '200': '#EF9A9A',
        '300': '#E57373',
        '400': '#EF5350',
        '500': '#F44336',
        '600': '#E53935',
        '700': '#D32F2F',
        '800': '#C62828',
        '900': '#B71C1C',
        'A100': '#FF8A80',
        'A200': '#FF5252',
        'A400': '#FF1744',
        'A700': '#D50000'
      },
      'Pink': {
        '50': '#FCE4EC',
        '100': '#F8BBD0',
        '200': '#F48FB1',
        '300': '#F06292',
        '400': '#EC407A',
        '500': '#E91E63',
        '600': '#D81B60',
        '700': '#C2185B',
        '800': '#AD1457',
        '900': '#880E4F',
        'A100': '#FF80AB',
        'A200': '#FF4081',
        'A400': '#F50057',
        'A700': '#C51162'
      },
      'Purple': {
        '50': '#F3E5F5',
        '100': '#E1BEE7',
        '200': '#CE93D8',
        '300': '#BA68C8',
        '400': '#AB47BC',
        '500': '#9C27B0',
        '600': '#8E24AA',
        '700': '#7B1FA2',
        '800': '#6A1B9A',
        '900': '#4A148C',
        'A100': '#EA80FC',
        'A200': '#E040FB',
        'A400': '#D500F9',
        'A700': '#AA00FF'
      },
      'Deep Purple': {
        '50': '#EDE7F6',
        '100': '#D1C4E9',
        '200': '#B39DDB',
        '300': '#9575CD',
        '400': '#7E57C2',
        '500': '#673AB7',
        '600': '#5E35B1',
        '700': '#512DA8',
        '800': '#4527A0',
        '900': '#311B92',
        'A100': '#B388FF',
        'A200': '#7C4DFF',
        'A400': '#651FFF',
        'A700': '#6200EA'
      },
      'Indigo': {
        '50': '#E8EAF6',
        '100': '#C5CAE9',
        '200': '#9FA8DA',
        '300': '#7986CB',
        '400': '#5C6BC0',
        '500': '#3F51B5',
        '600': '#3949AB',
        '700': '#303F9F',
        '800': '#283593',
        '900': '#1A237E',
        'A100': '#8C9EFF',
        'A200': '#536DFE',
        'A400': '#3D5AFE',
        'A700': '#304FFE'
      },
      'Blue': {
        '50': '#E3F2FD',
        '100': '#BBDEFB',
        '200': '#90CAF9',
        '300': '#64B5F6',
        '400': '#42A5F5',
        '500': '#2196F3',
        '600': '#1E88E5',
        '700': '#1976D2',
        '800': '#1565C0',
        '900': '#0D47A1',
        'A100': '#82B1FF',
        'A200': '#448AFF',
        'A400': '#2979FF',
        'A700': '#2962FF'
      },
      'Light Blue': {
        '50': '#E1F5FE',
        '100': '#B3E5FC',
        '200': '#81D4FA',
        '300': '#4FC3F7',
        '400': '#29B6F6',
        '500': '#03A9F4',
        '600': '#039BE5',
        '700': '#0288D1',
        '800': '#0277BD',
        '900': '#01579B',
        'A100': '#80D8FF',
        'A200': '#40C4FF',
        'A400': '#00B0FF',
        'A700': '#0091EA'
      },
      'Cyan': {
        '50': '#E0F7FA',
        '100': '#B2EBF2',
        '200': '#80DEEA',
        '300': '#4DD0E1',
        '400': '#26C6DA',
        '500': '#00BCD4',
        '600': '#00ACC1',
        '700': '#0097A7',
        '800': '#00838F',
        '900': '#006064',
        'A100': '#84FFFF',
        'A200': '#18FFFF',
        'A400': '#00E5FF',
        'A700': '#00B8D4'
      },
      'Teal': {
        '50': '#E0F2F1',
        '100': '#B2DFDB',
        '200': '#80CBC4',
        '300': '#4DB6AC',
        '400': '#26A69A',
        '500': '#009688',
        '600': '#00897B',
        '700': '#00796B',
        '800': '#00695C',
        '900': '#004D40',
        'A100': '#A7FFEB',
        'A200': '#64FFDA',
        'A400': '#1DE9B6',
        'A700': '#00BFA5'
      },
      'Green': {
        '50': '#E8F5E9',
        '100': '#C8E6C9',
        '200': '#A5D6A7',
        '300': '#81C784',
        '400': '#66BB6A',
        '500': '#4CAF50',
        '600': '#43A047',
        '700': '#388E3C',
        '800': '#2E7D32',
        '900': '#1B5E20',
        'A100': '#B9F6CA',
        'A200': '#69F0AE',
        'A400': '#00E676',
        'A700': '#00C853'
      },
      'Light Green': {
        '50': '#F1F8E9',
        '100': '#DCEDC8',
        '200': '#C5E1A5',
        '300': '#AED581',
        '400': '#9CCC65',
        '500': '#8BC34A',
        '600': '#7CB342',
        '700': '#689F38',
        '800': '#558B2F',
        '900': '#33691E',
        'A100': '#CCFF90',
        'A200': '#B2FF59',
        'A400': '#76FF03',
        'A700': '#64DD17'
      },
      'Lime': {
        '50': '#F9FBE7',
        '100': '#F0F4C3',
        '200': '#E6EE9C',
        '300': '#DCE775',
        '400': '#D4E157',
        '500': '#CDDC39',
        '600': '#C0CA33',
        '700': '#AFB42B',
        '800': '#9E9D24',
        '900': '#827717',
        'A100': '#F4FF81',
        'A200': '#EEFF41',
        'A400': '#C6FF00',
        'A700': '#AEEA00'
      },
      'Yellow': {
        '50': '#FFFDE7',
        '100': '#FFF9C4',
        '200': '#FFF59D',
        '300': '#FFF176',
        '400': '#FFEE58',
        '500': '#FFEB3B',
        '600': '#FDD835',
        '700': '#FBC02D',
        '800': '#F9A825',
        '900': '#F57F17',
        'A100': '#FFFF8D',
        'A200': '#FFFF00',
        'A400': '#FFEA00',
        'A700': '#FFD600'
      },
      'Amber': {
        '50': '#FFF8E1',
        '100': '#FFECB3',
        '200': '#FFE082',
        '300': '#FFD54F',
        '400': '#FFCA28',
        '500': '#FFC107',
        '600': '#FFB300',
        '700': '#FFA000',
        '800': '#FF8F00',
        '900': '#FF6F00',
        'A100': '#FFE57F',
        'A200': '#FFD740',
        'A400': '#FFC400',
        'A700': '#FFAB00'
      },
      'Orange': {
        '50': '#FFF3E0',
        '100': '#FFE0B2',
        '200': '#FFCC80',
        '300': '#FFB74D',
        '400': '#FFA726',
        '500': '#FF9800',
        '600': '#FB8C00',
        '700': '#F57C00',
        '800': '#EF6C00',
        '900': '#E65100',
        'A100': '#FFD180',
        'A200': '#FFAB40',
        'A400': '#FF9100',
        'A700': '#FF6D00'
      },
      'Deep Orange': {
        '50': '#FBE9E7',
        '100': '#FFCCBC',
        '200': '#FFAB91',
        '300': '#FF8A65',
        '400': '#FF7043',
        '500': '#FF5722',
        '600': '#F4511E',
        '700': '#E64A19',
        '800': '#D84315',
        '900': '#BF360C',
        'A100': '#FF9E80',
        'A200': '#FF6E40',
        'A400': '#FF3D00',
        'A700': '#DD2C00'
      },
      'Brown': {
        '50': '#EFEBE9',
        '100': '#D7CCC8',
        '200': '#BCAAA4',
        '300': '#A1887F',
        '400': '#8D6E63',
        '500': '#795548',
        '600': '#6D4C41',
        '700': '#5D4037',
        '800': '#4E342E',
        '900': '#3E2723'
      },
      'Grey': {
        '50': '#FAFAFA',
        '100': '#F5F5F5',
        '200': '#EEEEEE',
        '300': '#E0E0E0',
        '400': '#BDBDBD',
        '500': '#9E9E9E',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121'
      },
      'Blue Grey': {
        '50': '#ECEFF1',
        '100': '#CFD8DC',
        '200': '#B0BEC5',
        '300': '#90A4AE',
        '400': '#78909C',
        '500': '#607D8B',
        '600': '#546E7A',
        '700': '#455A64',
        '800': '#37474F',
        '900': '#263238'
      },
      'White': {
        '500': '#FFFFFF'
      }
    }
    var _startIndex = (startIndex === undefined) ? 0 : startIndex
    var _howMany = (howMany === undefined) ? 256 : howMany
    // prepare the raw Material Design (hex) colors
    var counter = 0
    var materialColors = []
    for (var group in materialJSON) {
      for (var member in materialJSON[group]) {
        var hex = materialJSON[group][member]
        // var rgba = ColorUtils.hexToRgba(hex)
        var color = ColorUtils.hexToColor(hex) // <-- Does rgba & hsv
        var name = group + ' ' + member
        color.hex = hex;
        // Pack 4x8-bit into 32-bit
        color.rgba32 = new Uint32Array((new Uint8Array([color.r, color.g, color.b, color.a])).buffer)[0]
        // Unpack 4x8-bit from 32-bit
        // new Uint8Array((new Float32Array([f])).buffer);
        color.name = name.replace(/ /g,'')
        color.id = counter++
        materialColors.push(color)
      }
    }
    return materialColors.slice(_startIndex, _howMany)
  }

  // COLOR SORTERS
  //
  static sortColorsByHue(colors) {
    return colors.sort(function (a, b) {
      return (a.hue != b.hue) ? a.hue - b.hue : a.chroma - b.chroma;
    })
  }

  static sortColorsByLuma(colors) {
    return colors.sort(function (a, b) {
      return a.luma - b.luma
    })
  }

  static shuffleFromTop(colors) {
    var len = colors.length;
    var tmpColors = Array.from(colors)
    for (var i=0; i< len/2; i++) {
      colors[i] = tmpColors[i*2]
      colors[len-i-1] = tmpColors[i*2+1]
    }
    return colors
  }


  // COLOR SPACE CONVERTERS
  //
  static hexToColor (hex) {
    var rgba = ColorUtils.hexToRgba(hex);
    var hsv = ColorUtils.rgbToHsv(rgba.r, rgba.g, rgba.b)
    return {...rgba, ...hsv}
  }

  static hexToRgba (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255
    } : null
  }

  static rgbToHsv (r, g, b) {

    /* Getting the Max and Min values for Chroma. */
    var max = Math.max.apply(Math, [r, g, b]);
    var min = Math.min.apply(Math, [r, g, b]);

    /* Variables for HSV value of hex color. */
    var chr = max - min;
    var hue = 0;
    var val = max;
    var sat = 0;
    var luma = 0.3 * r + 0.59 * g + 0.11 * b;
    if (val > 0) {
        /* Calculate Saturation only if Value isn't 0. */
        sat = chr / val;
        if (sat > 0) {
            if (r == max) {
                hue = 60 * (((g - min) - (b - min)) / chr);
                if (hue < 0) {
                    hue += 360;
                }
            } else if (g == max) {
                hue = 120 + 60 * (((b - min) - (r - min)) / chr);
            } else if (b == max) {
                hue = 240 + 60 * (((r - min) - (g - min)) / chr);
            }
        }
    }
    return { h: hue.toFixed(2), s: sat.toFixed(2), v: val, chroma: chr, luma: luma.toFixed(2) };

  }

}

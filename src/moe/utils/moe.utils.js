/* eslint-disable */
export default class MoeUtils {
	constructor () {
	}
  
	static imageDataFromPixelsAndColors({pixels, colors}) {

      // ImageData
      let imgData = new ImageData(256,256)
      try {
        for (var i=0; i<65536; i++ ) {
          let mappedIndex = i * 4;
          let theColor = colors[pixels[i]]
          imgData.data[mappedIndex] = theColor.r
          imgData.data[mappedIndex+1] = theColor.g
          imgData.data[mappedIndex+2] = theColor.b
          imgData.data[mappedIndex+3] = 255;
        }
      } catch(e) {
        console.warn('imageDataFromPixelsColors => Render error:', e)
      }
      return imgData
	}

	static imageDataFromColors(colors) {
		// Assumes 256 colors!
		let imageData = new ImageData(256, 256)
  
		if (!colors.length) return imageData
		let offset = 0
		let colorIndex = 0
		for (let y = 0; y < 16; y++) {
		  for (let x = 0; x < 16; x++) {
			for (let yy = 0; yy < 16; yy++) {
			  for (let xx = 0; xx < 16; xx++) {
				offset = (((x * 16) + xx) * 4) +  (((y * 16) + yy) * 256 * 4)
				imageData.data[offset++] = colors[colorIndex].r
				imageData.data[offset++] = colors[colorIndex].g //colors[i].g
				imageData.data[offset++] = colors[colorIndex].b //colors[i].b
				imageData.data[offset++] = colors[colorIndex].a
			  }
			}
			colorIndex++
		  }
		}
		return imageData

	}
}

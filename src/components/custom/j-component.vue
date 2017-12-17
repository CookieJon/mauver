
<script>
/* eslint-disable */
var jItem = require('components/custom/j-item')
var jBitmap = require('components/custom/j-bitmap')
var jArtwork = require('components/custom/j-artwork')
export default {
  name: 'j-component',
  components: {
    jItem, jBitmap, jArtwork
  },
  render: function (createElement) {
    function appropriateListComponent () {
      // var items = context.props.items
      // if (items.length === 0)           return EmptyList
      // if (typeof items[0] === 'object') return TableList
      // if (context.props.isOrdered)      return OrderedList
      return 'j-item'
    }
    return createElement(
      appropriateListComponent(),
      this.$slots.default
    )
  },
  props: {
    value: {
      required: false
    }
  }
  // render: function (createElement) {
  //   // create kebabCase id
  //   var headingId = getChildrenTextContent(this.$slots.default)
  //     .toLowerCase()
  //     .replace(/\W+/g, '-')
  //     .replace(/(^-|-$)/g, '')
  //   return createElement(
  //     'h' + this.level,
  //     [
  //       createElement('a', {
  //         attrs: {
  //           name: headingId,
  //           href: '#' + headingId
  //         }
  //       }, this.$slots.default)
  //     ]
  //   )
  // },
  // props: {
  //   level: {
  //     type: Number,
  //     required: true
  //   }
  // }

// var getChildrenTextContent = function (children) {
//   return children.map(function (node) {
//     return node.children
//       ? getChildrenTextContent(node.children)
//       : node.text
//   }).join('')
// }
}
</script>

<style scoped>
.test {
  margin: 12;
}
</style>

<template>
<div>
  <div v-touch-pan="touchPan" style="margin-top:50px;" ref="target" class="json"></div>
  {{ htmlEl }}
</div>
</template>

<script>
  /* eslint-disable */
  import { Utils } from 'quasar'
  var jDebug = require('components/custom/j-debug')
  var jObject = require('components/custom/j-object')

  export default {
    name: 'j-debug',
    props: ['value'],
    components: {jObject},
    data () {
      return {
        states: { }
      }
    },
    computed: {
      htmlEl () {
        let target = this.$refs.target
        while (target.firstChild) {
          target.removeChild(target.firstChild);
        }
        let dom = this.objToDom(this.value, 0)
        dom.addEventListener('webkitTransitionEnd', e => {
          if (e.tagName === 'UL' && e.propertyName === 'height') {
            e.target.style.height = ''
          }
        })
        target.appendChild(dom)
        // let ul = dom.getElementsByTagName('ul')
        // for (let i = 0, l = ul.length; i < l; i++) {
        //   ul[i].setAttribute('data-height', ul[i].offsetHeight + 'px')
        //   // ul[i].style.height = ul[i].getAttribute('data-height')~
        // }
        console.log(dom)
        return dom
      }
    },
    // watch: {
    //   'value' (newVal, oldVal) {
    //     alert('ok')
    //   }
    // },
    methods: {
      touchPan (e) {
        console.log(e)
      },
      objToDom (obj, depth) {

        let ul = document.createElement('ul')
        ul.addEventListener('click', this.onClick, true)

        Object.keys(obj).forEach(k => {

          let li = document.createElement('li')
          let a = document.createElement('a')
          a.textContent = ':'

          li.appendChild(a)
          ul.appendChild(li)

          // name
          a.setAttribute('data-name', k)

          // value
          let _type = typeof obj[k]

          if (_type === 'undefined') {
            // undefined
            a.setAttribute('data-value', 'undefined')
          }
          else if (_type === 'object') {
            // null
            if (obj[k] === null) {
              a.setAttribute('data-value', 'null')
            }
            else if (Array.isArray(obj[k]) || [Uint8ClampedArray, Uint8Array].includes(obj[k].constructor)) {
              // Array-like
              li.classList.add('array')
              a.setAttribute('data-constructor', obj[k].constructor.name)

              if (obj[k].length === 0) {
                li.classList.add('empty')
              } else if (obj[k].length > 10) {
                li.classList.add('limited')
                a.setAttribute('data-length', obj[k].length)
              } else {
                li.classList.add('full')
                li.appendChild(this.objToDom(obj[k], depth + 1))
              }

            } else {
              // Object
              li.classList.add('object')
              a.setAttribute('data-constructor', obj[k].constructor.name)

              if (Object.keys(obj[k]).length === 0) {
                li.classList.add('empty')
              } else if (Object.keys(obj[k]).length > 10) {
                li.classList.add('limited')
                a.setAttribute('data-length', obj[k].length)
              } else {
                li.classList.add('full')
                li.appendChild(this.objToDom(obj[k], depth + 1))
              }

            }

          }
          else if (_type === 'string') {
            li.classList.add('string')
            a.setAttribute('data-value', obj[k])
          } else {
            li.classList.add('number')
            a.setAttribute('data-value', obj[k])
          }

        })
        return ul

      },

      onClick (e) {
        // Toggle <ul> next to a clicked <a>
        e.stopPropagation()
        e.preventDefault()
        if (e.target.nodeName !== 'A') return
        let el = e.target.nextSibling
        if (!el || el.nodeName !== 'UL') return
        if (!el.classList.contains('collapsed')) {
          console.log('collapsing...')
          el.setAttribute('data-height', el.offsetHeight + 'px')
          el.style.height = el.getAttribute('data-height')
        } else {
          console.log('expanding...')
          el.style.height = el.getAttribute('data-height')
        }
        el.classList.toggle('collapsed')
        console.log(el)
      }
    }
  }
</script>

<style lang="stylus">

  @keyframes anim_collapse
    0%
      border 1px solid red
      opacity 0
      transform scale(.5)
    50%
      opacity 1
    100%
      opacity 1
      transform scale(1)

  div.json
    background rgba(0, 0, 0, 0.75)

    ul
      list-style-type none
      font-family "Lucida Console", Monaco, monospace
      font-size 12px
      margin 4px 0
      padding 0
      overflow hidden
      color #2e9dfd
      background rgba(255, 255, 255, 0.02)
      box-shadow 11px 10px 6px -10px rgba(0,0,0,0.75)
      border-top 1px solid  rgba(255, 255, 255, 0.1)
      border-left 1px solid  rgba(255, 255, 255, 0.13)
      // opacity 1
      height 100% !important
      transition all .5s ease
      &.collapsed
        height 0 !important
        animation-name anim_collapse
        // opacity 0
        // transform scale3d(.3, .3, .3)
        // transform scaleY(0)
      &:hover
        background rgba(255, 255, 255, 0.05)


    li
      padding 2px
      transition all .5s
      overflow hidden
      &:hover
        background rgba(255, 255, 255, 0.035)
        > a
          color #2e9dfd
      > ul
        /* child object container */
        margin 0 10px

    li > a
      // Defaults:
      transition all 0.3s linear-in-out
      padding-left 10px
      display block
      padding 2px
      color #027be3
      white-space nowrap
      overflow-x hidden

      &::before
        content attr(data-name)
        font-weight bold
      &::after
        content attr(data-value)
        color rgba(255, 255, 255, .9)

    // Object
    // li.object > a::before
    //   content attr(data-name)
    li.object.empty > a::after
      content " " attr(data-constructor) "{}"
    li.array.limit > a::after
      content " " attr(data-constructor) "[" attr(data-limit) "]"
    li.object.full > a::after
      content  " " attr(data-constructor) "{"
    li.object.full::after
      content "}"
      color white

    // Array
    // li.array > a::before
    //   content attr(data-name)
    li.array.empty > a::after
      content " " attr(data-constructor) "[]"
    li.array.limit > a::after
      content " " attr(data-constructor) "[" attr(data-limit) "]"
    li.array.full > a::after
      content  " " attr(data-constructor) "["
    li.array.full::after
      content "]"
      color white

    // String
    // li.array > a::before
    //   content attr(data-name)
    li.string > a
      &::before
        content attr(data-name)
      &::after
        content ' "' attr(data-value) '"'
        color #4CAF50

    // Boolean
    // li.array > a::before
    //   content attr(data-name)
    li.boolean > a
      &::before
        content attr(data-name)
      &::after
        content ' ' attr(data-value)

    // Number
    // li.array > a::before
    //   content attr(data-name)
    li.string > a
      &::before
        content attr(data-name)
      &::after
        content ' "' attr(data-value) '"'

    // Function
    li.function > a
      &::before
        content attr(data-name)
      &::after
        content " function() {}"

</style>

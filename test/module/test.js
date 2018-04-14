import Vue from 'vue'
import Preload from '../../src/index.js'

Vue.use(Preload)


// 非父子组件通信
let bus = new Vue()

bus.$on('eachload', function(msg) {
    console.log(msg.total)
})

bus.$on('allload', function(msg) {
    vm.isLoaded = true
})

let vm = new Vue({
    el: '#container',
    data: function() {
        return {
            isLoaded: false,

            infos: {
                imgs: [
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_0923.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3606.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3657.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3715.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3775.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3789.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3791.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3832.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3833.JPG?raw=true',
                    'https://github.com/DiligentYe/some-picture/blob/master/IMG_3910.JPG?raw=true'
                ],
                options: {
                    // max: 3,
                    allLoaded: function(msg) {
                        bus.$emit('allload')
                    }
                }
            }

        }
    },

    render: function(createElement) {
        return createElement('div', {
            attrs: {
                id: 'app'
            }
        }, [createElement('div', {
                class: {
                	spinner: true,
                	loading: this.isLoaded
                }
            }, [1,1,1,1,1].map(function (val, index) {
            	return createElement('div', {
            		attrs: {
            			class: 'rect' + (index + 1)
            		}
            	})
            })),
            createElement('div', {
                directives: [{
                    name: 'preload',
                    value: this.infos
                }]
            }),
            createElement('div', {
                    attrs: {
                        class: 'pics'
                    }
                },
                this.infos.imgs.map(function(img) {
                    return createElement('img', {
                        attrs: {
                            width: 250,
                            src: img
                        }
                    })
                })
            )
        ])
    }
})
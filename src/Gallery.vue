<template>
    <div class="v-gallery">
        <div ref="links"
             class="lightBoxGallery"
             @click="openGallery($event, true)"
              v-if="type.toLowerCase() === 'gallery' && $slots.default">
            <!--
            slot template:
            <a href="javascript:void(0);" :data-image="img.url" :title="img.title" v-for="img in images">
                <img :src="img.url">
            </a>
            -->
            <slot></slot>
        </div>

        <div :class="{'light-gallery': true, 'dark-theme': dark}"
             @click="openGallery($event, false)"
             ref="innerLinks"
             v-if="type.toLowerCase() === 'gallery' && !$slots.default">
            <a href="javascript:void(0);" :data-image="img.href" :data-title="img.title" v-for="img in list">
                <div class="image-container"><img :src="img.thumbnail" :alt="img.title"></div>
                <div class="image-caption" v-text="img.title" v-if="caption"></div>
            </a>
        </div>

        <div :class="[ctlClass]" ref="container" id="blueimp-gallery">
            <div class="slides"></div>
            <h3 class="title" v-if="controlTitle"></h3>
            <a class="prev">‹</a>
            <a class="next">›</a>
            <a class="close" v-show="type.toLowerCase() === 'gallery'">×</a>
            <a class="play-pause" v-if="controlPause"></a>
            <ol class="indicator"></ol>
        </div>
    </div>
</template>

<script>
    import 'blueimp-gallery/css/blueimp-gallery.min.css';
    import gallery from 'blueimp-gallery';
    export default {
        name: "v-gallery",
        props: {
            type: {
                type: String,
                default: 'gallery'
            },
            /**
             * data format:
             * [
             *      {title: 'img1', url:'http://image_url', thumbnail:'http://image_thumbnail'},
             *      {...}
             * ]
             */
            images: {
                type: Array,
                required: true
            },
            controlPause: {
                type: Boolean,
                default: false
            },
            controlTitle: {
                type: Boolean,
                default: true
            },
            dark: {
                type: Boolean,
                default: false
            },
            caption: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                ctlClass:{
                    'blueimp-gallery': true,
                    'blueimp-gallery-carousel': false,
                    'blueimp-gallery-controls': true,
                    'light-carousel': false
                },
                list: []
            };
        },
        methods: {
            openGallery(e,custom){
                let that = this;
                let target = e.target || e.srcElement,
                    link = target.src ? target.parentNode : target;
                if(link.className.includes('v-gallery') ||
                    link.className.includes('lightBoxGallery') ||
                    link.className.includes('light-gallery')) return;
                let options = {
                        index: link.closest('a'),
                        event: e,
                        container : that.$refs.container,
                        titleProperty: 'title',
                        urlProperty: 'image',
                        closeOnSlideClick : false,//点击非图片区域，非控制按钮的空白区域时，是否关闭图片显示
                        closeOnSwipeUpOrDown : false,//图片上下拖动，到屏幕尽头时，关闭图片显示
                        enableKeyboardNavigation : true,//是否打开键盘导航
                        toggleControlsOnReturn : false,//是否允许回车，显示/隐藏控制按钮
                        toggleControlsOnSlideClick : false,//是否允许鼠标点击图片，显示/隐藏控制按钮
                        startSlideshow : false//是否自动开始播放图片轮播
                    },
                    main = custom ? that.$refs.links : that.$refs.innerLinks,
                    links = main.getElementsByTagName('a');
                //console.log(e);
                //console.log(link.tagName);
                gallery(links, options);
            },
            openCarousel(){
                if(!this.list.length) return;
                let that = this;
                this.ctlClass['blueimp-gallery-carousel'] = true;
                this.ctlClass['light-carousel'] = true;
                this.$nextTick(()=> {
                    let a = gallery(that.list, {
                        container: that.$refs.container,
                        carousel: true,
                        toggleControlsOnSlideClick : false
                    });
                });
            },
            convert(){
                if(Array.isArray(this.images) && this.images.length){
                    this.list = this.images.concat().map((val,idx) => {
                        return {
                            title: val.title ? val.title : 'Image'+(idx+1),
                            thumbnail: val.thumbnail ? val.thumbnail : val.url,
                            href: val.url
                        };
                    });
                }
            },
            closestPolyfill(){
                if (!Element.prototype.matches)
                    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                        Element.prototype.webkitMatchesSelector;

                if (!Element.prototype.closest)
                    Element.prototype.closest = function(s) {
                        var el = this;
                        if (!document.documentElement.contains(el)) return null;
                        do {
                            if (el.matches(s)) return el;
                            el = el.parentElement || el.parentNode;
                        } while (el !== null && el.nodeType === 1);
                        return null;
                    };
            }
        },
        beforeMount(){
            this.convert();
        },
        watch: {
            images(){
                this.convert();
                if(this.type.toLowerCase() === 'carousel') this.openCarousel();
            }
        },
        mounted(){
            this.closestPolyfill();
            if(this.type.toLowerCase() === 'carousel') this.openCarousel();
        }
    }
</script>

<style lang="scss" >
    .v-gallery {
        .blueimp-gallery-controls {
            h3.title, a.prev, a.next, a.close { color: white !important; }
        }
        .lightBoxGallery{
            display: inline-block;
            a { text-decoration: none; }
        }
        .light-carousel {
            background-color: white;
            box-shadow: none;
            max-width: 1000px;
            .next, .prev{
                border-color: white !important;
                background-color: transparent;
                /*text-shadow:1px 1px 2px black;*/
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
            }
            .title {
                bottom: 0;
                top: unset;
                margin: 0;
                width: 100%;
                text-align: center;
                padding-right: 35px;
                text-shadow:1px 1px 4px black;
                white-space: nowrap;
            }
        }
        .light-gallery {
            display: block;
            position: relative;
            a {
                border: 1px solid #DDDDDD;
                padding: 5px;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
                margin: 0 10px 10px 0;
                position: relative;
                display:inline-block;
                background-color: white;
                vertical-align: middle;
                transition: all .3s;
                -webkit-transition: all .3s;
                border-radius: 2px;
                text-decoration: none;

                .image-container {
                    display: table-cell;
                    vertical-align: middle;
                    height: 120px;
                    background-color: black;
                    img{
                        width: 160px;
                        display: block;
                        vertical-align: middle;
                    }
                }
                .image-caption {
                    color: #999999;
                    text-align: center;
                    white-space: nowrap;
                    padding-top: 5px;
                }
                &:hover {
                    border: 1px solid #AAAAAA;
                    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
                    .image-caption {
                        color: #232323;
                    }
                }
            }
            &.dark-theme {
                a {
                    border: 1px solid #232323;
                    padding: 3px;
                    background-color: #232323;
                    &:hover {
                        box-shadow: 0 2px 20px rgba(0, 0, 0, 1);
                        .image-caption {
                            color: white;
                        }
                    }
                }
            }
        }
    }
</style>
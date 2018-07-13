<template>
    <div class="v-gallery">
        <div ref="links" @click="openGallery" class="lightBoxGallery" v-if="type.toLowerCase() === 'gallery'">
            <!--
            slot template:
            <a href="javascript:void(0);" :data-image="img.url" :title="img.title" v-for="img in images">
                <img :src="img.url">
            </a>
            -->
            <slot></slot>
        </div>

        <div :class="[ctlClass]" ref="container" id="blueimp-gallery">
            <div class="slides"></div>
            <h3 class="title" v-if="title"></h3>
            <a class="prev">‹</a>
            <a class="next">›</a>
            <a class="close" v-show="type.toLowerCase() === 'gallery'">×</a>
            <a class="play-pause" v-if="pause"></a>
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
                default: 'carousel'
            },
            /**
             * data format:
             * [
             *      {title: 'img1', url:'http://image_url', thumbnail:'http://image_thumbnail',}
             * ]
             */
            images: {
                type: Array
            },
            pause: {
                type: Boolean,
                default: false
            },
            title: {
                type: Boolean,
                default: true
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
            openGallery(e){
                let that = this;
                //this.ctlClass["blueimp-gallery-carousel"] = false;
                let target = e.target || e.srcElement,
                    link = target.src ? target.parentNode : target;
                let options = {
                        index: this.closest(link, 'a'),
                        event: e,
                        container : that.$refs.container,
                        urlProperty: 'image',
                        closeOnSlideClick : false,//点击非图片区域，非控制按钮的空白区域时，是否关闭图片显示
                        closeOnSwipeUpOrDown : false,//图片上下拖动，到屏幕尽头时，关闭图片显示
                        enableKeyboardNavigation : true,//是否打开键盘导航
                        toggleControlsOnReturn : false,//是否允许回车，显示/隐藏控制按钮
                        toggleControlsOnSlideClick : false,//是否允许鼠标点击图片，显示/隐藏控制按钮
                        startSlideshow : false//是否自动开始播放图片轮播
                    },
                    links = that.$refs.links.getElementsByTagName('a');
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
            closest(dom, tag){
                if(dom && tag){
                    //console.log(dom);
                    if(dom.tagName.toLowerCase() === tag.toLowerCase())  return dom;
                    else if(dom.parentNode){
                        return this.closest(dom.parentNode, tag);
                    }
                }
                return false;
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
            if(this.type.toLowerCase() === 'carousel') this.openCarousel();
        }
    }
</script>

<style lang="scss" scoped>
    .lightBoxGallery{
        display: inline-block;
        a {
            text-decoration: none;
        }
    }
    .light-carousel {
        background-color: white;
        box-shadow: none;
        max-width: 1000px;
        .title, .play-pause {
            color: #333333;
            text-shadow: none;
        }
        .next, .prev{
            border-color: #cccccc;
            background-color: white;
            color: #cccccc;
            text-shadow: none;
        }
        .title {
            bottom: 15px;
            top: unset;
            margin: 0;
            width: 100%;
            text-align: center;
        }
    }
</style>
<template>
    <div>
        <div ref="links" @click="openGallery" class="lightBoxGallery">
            <!--
            slot template:
            <a href="javascript:void(0);" :data-image="img.url" :title="img.title" v-for="img in images">
                <img :src="img.url">
            </a>
            -->
            <slot></slot>
        </div>
        <div :class="[ctlClass]" ref="container">
            <div class="slides"></div>
            <h3 class="title"></h3>
            <a class="prev">‹</a>
            <a class="next">›</a>
            <a class="close">×</a>
            <a class="play-pause"></a>
            <ol class="indicator"></ol>
        </div>
    </div>
</template>

<script>
    import gallery from 'blueimp-gallery';
    import 'blueimp-gallery/css/blueimp-gallery.min.css';
    export default {
        name: "v-gallery",
        props: {
            images: {
                type: Array
            }
        },
        data(){
            return {
                ctlClass:{
                    'blueimp-gallery': true,
                    'blueimp-gallery-carousel': false,
                    'blueimp-gallery-controls': true
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
            closest(dom, tag){
                if(dom && tag){
                    console.log(dom);
                    if(dom.tagName.toLowerCase() === tag.toLowerCase())  return dom;
                    else if(dom.parentNode){
                        return this.closest(dom.parentNode, tag);
                    }
                }
                return false;
            }
        },
        beforeMount(){
            /*
            if(this.images && this.images.length){
                for(let img of this.images){
                    let obj = {};
                    if(img.title) obj.title = img.title;
                    if(img.url){
                        obj.href = img.url;
                        obj.thumbnail = img.url;
                    }
                    img.type = 'image/jpeg';
                    this.list.push(obj);
                }
            }
            */
        },
        mounted(){
            //let that = this;
            //document.body.appendChild(this.$refs.container);
            /*
            gallery(this.list, {
                container : that.$refs.container,
                closeOnSlideClick : false,//点击非图片区域，非控制按钮的空白区域时，是否关闭图片显示
                closeOnSwipeUpOrDown : false,//图片上下拖动，到屏幕尽头时，关闭图片显示
                enableKeyboardNavigation : true,//是否打开键盘导航
                toggleControlsOnReturn : false,//是否允许回车，显示/隐藏控制按钮
                toggleControlsOnSlideClick : false,//是否允许鼠标点击图片，显示/隐藏控制按钮
                startSlideshow : false//是否自动开始播放图片轮播
            });
            */
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
</style>
import gallery from './Gallery.vue';

const Plugin = {
    install(Vue){
        Vue.component(gallery.name, gallery);
    }
};

export default Plugin;
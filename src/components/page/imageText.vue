<template>
    <div :class='(data.type == "1" ? "cap-image-ad__image-nav" : "cap-image-ad__slide cap-image-ad__text-nav")' :style='"overflow-x:"+(data.showtype == "1" ? "hidden" : "scroll")+"; background-color:"+data.backgroundcolor' >
        1111
        <div v-if="data.type == '1'" v-for="(item,index)  in data.imagelist" :key="index" class="image-wrapper" :style="'width:'+ data.width+'%; margin-right: 0px;'">
            <a :href="item.link" class="cap-image-ad__link cap-image-ad__link--image-nav" :style="'color:'+data.color">
                <div class="cap-image-ad__image">
                    <img v-lazy="item.icon+'?w=320'" style="width: 100%; " />
                </div>
                123
                <h3 v-if="item.goods_type_name!=''" class="cap-image-ad__nav-title">{{item.goods_type_name}}</h3>
            </a>
        </div>
        <a v-if="data.type=='2'" v-for="(item,index) in data.imagelist" :key="index" :href="item.icon" class="text-nav-wrapper" :style="'width:'+data.width+'%; color: '+data.color+'; background-color: '+data.backgroundcolor"><h3 class="cap-image-ad__nav-title">{{item.goods_type_name}}</h3></a>
    </div>
</template>

<script>
export default {
    name:'imageText',
    props:['data'],
    created:function(){
        console.log("aa")
        console.log(this.data.imagelist);
        var width = 0;
        if (this.data.showtype == "1") {
            width = 100 / this.data.imagelist.length;
        }
        else {
            width = (100 * 0.95) / (this.data.shownumber - 1);
        }
        this.data.width=width;
    }
}
</script>

<style>
</style>
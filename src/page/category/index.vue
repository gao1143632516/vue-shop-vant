<template>
    <div class="container">
    	<headerNav title="分类" />
        <!-- 搜索 -->
        <van-search placeholder="请输入搜索关键词" @click="toSearch()"/>
        <van-tree-select height="calc(100vh - 150px)" :items="categoryList" :active-id.sync="activeId" :main-active-index.sync="activeIndex" @click-nav="clickNav">
            <template #content>
                <div class="item_desc">
                    <div class="item_desc_list" @click="getCategoryGoodsList(item.id)" v-for="item in categoryListChild" :key="item.id">
                        {{item.text}}
                    </div>
                </div>
             </template>
</van-tree-select>
<navigate/>	
</div>
</template>
<script type="text/javascript">
import { getGoodsCategoryBymcro } from "@/api/category";
import navigate from '@/components/footer/navigate.vue'
export default {
    name: "userindex",
    components: {
    	navigate
    },
    data() {
        return {
            categoryList: [],
            categoryListChild: [],
            activeId: 0,
            activeIndex: 0,


        };
    },
    methods: {
        clickNav(index) {
        	console.log("this.categoryList[index]",this.categoryList);
            this.categoryListChild = this.categoryList[index].children;
            

        },
          toSearch(){
            this.$router.push({path:'/search'});
        },
        onSearch() {
            console.log(this.value);
        },
        onClick(key) {
            this.activeKey = key;
        },
        getGoodsCategoryBymcro() {
            getGoodsCategoryBymcro().then(res => {
                console.log(res.data.datalist);
                var category = res.data.datalist;
                category.map(item => {
                    item.text = item.goods_type_name;
                    item.id = item.goods_type_id;
                    item.childCategory.map(item => {
                        item.text = item.goods_type_name
                        item.id = item.goods_type_id
                    })
                    item.children = item.childCategory
                })
                this.categoryList = category;
                console.log("created",this.categoryList)
                this.clickNav(0);	
            })
        },
        getCategoryGoodsList(goods_type_id){
        	var categoryitem = this.categoryList[this.activeIndex]	;
        	var goods_type_ids = categoryitem.goods_type_id+','+goods_type_id;
        	 this.$router.push({path: '/productlist',query: { goods_type_ids: goods_type_ids }});
        }
    },
    created() {
        this.getGoodsCategoryBymcro();

    },
  
};
</script>
<style scoped="scoped">
	.item_desc{
		display: flex;
		flex-flow: row wrap;
	    align-content: flex-start;
	}
	.item_desc_list{
		background: #FFF;
		box-sizing: border-box;
		flex:0 0 50%;
		height: 50px;
		line-height: 50px;
		text-align: center;

	}
</style>

import headerNav from '../components/header/nav';

import navigate from '../components/footer/navigate.vue'
import productcard from '../components/common/productcard.vue'
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  ActionSheet,
  Sku,Switch,
  TreeSelect,
  AddressList,
    Form ,
    Area ,
    Loading ,
Image as VanImage ,
  Grid, GridItem,NumberKeyboard,
  DropdownMenu, DropdownItem,Search,
  Card,Button,SwipeCell,Dialog,Tab, Tabs,Row,Checkbox, CheckboxGroup, SubmitBar,NavBar,Tabbar, TabbarItem,Panel,List,Step, Steps,Field ,
  SlidebarItem, Sidebar,Popup,Stepper,RadioGroup, Radio,Picker,Uploader,Info,Divider ,Empty 
} from 'vant';

const components=[
Empty ,
    Tag,
    Col,
    Icon,
    Cell,
    CellGroup,
    Swipe,
    SwipeItem,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    ActionSheet,
    Sku,
    Area ,
    Divider ,
    Card,
    Button,
    SwipeCell ,
    Dialog,
    headerNav, 
    Grid, GridItem,
    Search,
    Loading ,
    NumberKeyboard ,
    Form ,
    Switch,
VanImage ,
AddressList,
TreeSelect ,
DropdownMenu, DropdownItem,

    Tab, Tabs,Toast,Row,Checkbox, CheckboxGroup, SubmitBar,NavBar ,Tabbar, TabbarItem,navigate,Panel,List ,Step, Steps,Field ,
    ,Popup,productcard,Stepper,RadioGroup, Radio,Picker,Uploader,Info
]


export default (Vue)=>{
    components.forEach(Component => {
        Vue.component(Component.name, Component)
    });
}

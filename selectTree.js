var selectTree={
 template:`
	 <el-select :placeholder="placeholder" v-model="name" 
	 		:style="style" 
	 		:clearable="clearable" 
	 		ref="selectTree"
	 		:disabled = "disabled"
	 		@clear="clear"
	 		@visible-change="visibleChange">
	 	<el-input v-if="filterable" v-model="inputValue" placeholder="请输入内容"></el-input>
     	<el-option :style="treeStyle">
        	<el-tree
        		id="customSelectTree"
        		ref="optionTree"
            	:data="treeData"
                :props="treeProps"
                :node-key="nodeKey"
                :default-expand-all="defaultExpandAll"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode">
                <span class="custom-tree-node" slot-scope="{ node, data }">
		            <span>
		                <i :class="data.icon" class="icon-tree-icon"></i>
		                <span v-if="!data.disabled" class="el-tree-node__label">{{ node.label }}</span>
	 					<span v-else class="el-tree-node__label" style="color:#9e9e9e">{{ node.label }}</span>
		            </span>              
		        </span>
            </el-tree>
        </el-option>
     </el-select>`,
	props:{
		placeholder:{
			default:"请选择"
		},
		style:{
			default:""
		},
		treeStyle:{
			default:""
		},
		treeProps:{			
			default:{children: "children", label: "label",targetNodeTypes:[]}
		},
		nodeKey:{
			default:"id"
		},
		defaultExpandAll:{
			default:true
		},
		treeData:{		
			type:Array,
			default:[]
		},
		treeId:{
			default:""
		},
		receiveParamType:{
			default:""
		},
		defaultNode:{
			default:null
		},
		clearable:{
			default:true
		},
		filterable:{
			default:false
		},
		disabled : {
			default:false
		}
	},
	data(){
		return {
			name:null,
			inputValue:"",
		}
	},
	methods:{
		handleNodeClick(data, node, tree){
			this.$emit('receive-param',this.receiveParamType,data,this.treeId , returnValue =>{
				if(returnValue != false){
					this.$refs.selectTree.blur();
					this.name = data[this.treeProps.label];
				}
			});
		},
		clear(){
			this.name = null;
			this.$emit('select-tree-clear',this.receiveParamType,this.treeId);
		},
		visibleChange(visible){
			if(!visible && isNull(this.name)){
				this.$emit('select-tree-clear',this.receiveParamType,this.treeId);
			};
		},
		filterTree(val){
			this.$refs.optionTree.filter(val);
		},
		filterNode(value, data) {
	        if (!value) {
	        	return true;
	        }
	        let prop = !this.treeProps.label?"label":this.treeProps.label;
	        return data[prop].indexOf(value) !== -1;
	    }
	},
	watch:{
		inputValue(val){
			this.filterTree(val);
		}
	},
	updated:function(){
		if(!isNull(this.defaultNode)){
			this.$refs.optionTree.setCurrentKey(this.defaultNode);
			this.$nextTick(()=>{
				var node = this.$refs.optionTree.getNode(this.defaultNode);
				this.name = node[this.treeProps.label];
			})
		}
	}
}
Vue.component("selectTreeComponent",selectTree);
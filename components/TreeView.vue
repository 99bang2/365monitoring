<script>
import 'he-tree-vue/dist/he-tree-vue.css'
import {Tree, Fold, Check, Draggable, foldAll} from 'he-tree-vue'

export default {
	extends: Tree,
	mixins: [Fold, Check, Draggable],
	props: {
		foldAllAfterMounted: {
			type: Boolean,
			default: true
		},
		triggerClass: {
			type: String,
			default: 'drag-trigger'
		},
		draggable: {type: [Boolean, Function], default: false},
		droppable: {type: [Boolean, Function], default: false},
	},
	data() {
		return {
			treeClass: 'my-tree-view1',
		}
	},
	created() {
	},
	methods: {
		overrideSlotDefault({node, index, path, tree}, original) {
			return <div class="node-content">
				<div class="left" onClick={() => tree.toggleFold(node, path)}>
				{node.$folded && node.children && node.children.length > 0 ? (<i class="mdi mdi-chevron-right"/>)
					: !node.$folded && node.children && node.children.length > 0 ? (<i class="mdi mdi-chevron-down"/>)
					: (<i class="mdi mdi-circle-small"/>)}
				{node.children && node.children.length > 0 ? (<i class="mdi mdi-folder"/>) : (<i class="mdi mdi-tag"/>)}
				{node.isActive ? (<span class="name">{node.name}</span>)
					: (<span class="name disabled">{node.name}</span>)}
				</div>
				<div class="right">
					<button onClick={() => this.openForm(node)} class="uk-button uk-button-small uk-button-primary">수정</button>
					<i class="mdi mdi-cursor-move drag-trigger"/>
				</div>
			</div>
		},
		blockHeader() {
			return <div class="header">
				<div>
					<button onClick={() => this.openForm()} class="uk-button uk-button-small uk-button-primary">추가</button>
				</div>
				<input onKeydown={(e) => e.key === 'Enter' && this.search(e)} placeholder="검색"  />
			</div>
		},
		showHidden() {
			this.walkTreeData((node) => {
				this.$set(node, '$hidden', false)
			})
		},
		hideNode(node) {
			this.$set(node, '$hidden', true)
		},
		openForm(category){
			this.$emit('open-form', category)
		},
		search(e) {
			const value = e.target.value || ''
			this.walkTreeData((node) => {
				this.$set(node, '$hidden', !node.name.includes(value))
			})
		},
	},
}
</script>

<style>
.my-tree-view1 {
	min-width: 500px;
}
.my-tree-view1 .mls{
	margin-left: 5px;
}
.my-tree-view1 .mrs{
	margin-right: 5px;
}
.my-tree-view1 .tree-node{
	padding: 0;
	border: none;
}
.my-tree-view1 .node-content{
	display: flex;
	justify-content: space-between;
}

.my-tree-view1 .node-content > *{
	align-self: center;
	display: flex;
}
.my-tree-view1 .node-content .left .name {
	font-size: 14px;
	line-height: 36px;
	margin-left: 10px;
}
.my-tree-view1 .node-content .left .name.disabled {
	color: #8e8e8e;
	text-decoration: line-through;
}
.my-tree-view1 .tree-node-back:hover{
	background: #f5f5f5;
}
.my-tree-view1 .header{
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #ccc;
	padding-bottom: 5px;
	margin-bottom: 10px;
}
.my-tree-view1 .footer{
	border-top: 1px solid #ccc;
	margin-top: 10px;
}
.drag-trigger {
	margin-left: 10px;
}
.drag-trigger:before{
	font-size: 20px;
}
</style>

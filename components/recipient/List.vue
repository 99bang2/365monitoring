<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-comment-account"/> 수신자 목록</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="수신자 등록"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-2-5@s">
					</div>
					<div class="uk-width-1-5@s">
					</div>
					<div class="uk-width-2-5@s">
						<ScInput v-model="searchKeyword" placeholder="검색">
							<span slot="icon" class="uk-form-icon" data-uk-icon="search"/>
						</ScInput>
					</div>
				</div>
				<ag-grid-vue
					style="width: 100%;"
					class="ag-theme-material"
					:dom-layout="'autoHeight'"
					:locale-text="localeText"
					:default-col-def="defaultColDef"
					:column-defs="columnDefs"
					:grid-options="gridOptions"
					:pagination="true"
					:pagination-page-size="10"
					:framework-components="frameworkComponents"
				>
				</ag-grid-vue>
			</ScCardBody>
		</ScCard>
	</div>
</template>

<script>
import ScInput from '~/components/Input'
import {agGridMixin} from "~/plugins/ag-grid.mixin"

export default {
	components: {
		ScInput,
	},
	mixins: [
		agGridMixin
	],
	data() {
		return {
			gridOptions: {
				suppressRowClickSelection: true,
				suppressMenuHide: true,
				rowSelection: 'multiple',
				onGridReady: this.onGridReady,
				onFirstDataRendered: this.onFirstDataRendered,
				onCellClicked: this.onRowClicked,
				rowHeight: 45,
				getRowStyle: this.getRowStyle
			},
			searchKeyword: '',
		}
	},
	computed: {
		columnDefs() {
			return [
				{
					headerName: '#',
					field: 'uid',
					width: 50,
				},
				{
					headerName: '이름',
					field: 'name',
					width: 140
				},
				{
					headerName: '이메일',
					field: 'email',
					width: 180
				},
				{
					headerName: '전화번호',
					field: 'phone',
					width: 140
				},
				{
					headerName: '활성화',
					field: 'isActive',
					width: 80,
					valueFormatter: obj => {
						if(obj.value !== null && typeof obj.value !== 'undefined') {
							return obj.value ? '활성화': "비활성화"
						}else {
							return null
						}
					}
				},
				{
					headerName: "소속그룹",
					field: "Groups",
					width: 250,
					cellRenderer: obj=> {
						let result=""
						let tags = ['md-bg-blue-400', 'md-bg-amber-400', 'md-bg-purple-400', 'md-bg-red-400']
						if(obj.value) {
							for(let i = 0 ; i < obj.value.length; i++ ) {
								let k = i % 4
								result += `<span class="uk-badge uk-margin-mini-right ${tags[k]}">`+obj.value[i].name+'</span>'
							}
						}
						return result
					}
				},
				{
					headerName: '등록일시',
					field: 'createdAt',
					width: 160,
					valueFormatter: obj => {
						return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
					}
				}
			]
		}
	},
	watch: {
		'searchKeyword': function (newValue) {
			this.gridOptions.api.setQuickFilter(newValue)
		},
	},
	created() {
		let vm = this
		this.$nuxt.$on('reset-recipient-list', () => {
			vm.resetSelection()
		})
		this.$nuxt.$on('fetch-recipient-list', (uid) => {
			vm.fetchData(uid)
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('reset-recipient-list')
		this.$nuxt.$off('fetch-recipient-list')
	},
	async mounted() {
		await this.fetchData()
	},
	methods: {
		openNewForm() {
			this.resetSelection()
			this.$nuxt.$emit('open-recipient-form')
		},
		onRowClicked(props) {
			this.$nuxt.$emit('open-recipient-form', props)
			this.resetSelection()
			props.node.detail = true
			this.gridOptions.api.redrawRows()
		},
		async fetchData(selectUid) {
			let res = await this.$axios.$get(this.config.apiUrl + '/recipients')
			this.gridOptions.api.setRowData(res.data)
			if (selectUid) {
				this.gridOptions.api.forEachNode((node) => {
					if (node.data.uid === selectUid) {
						this.onRowClicked({
							node: node,
							data: node.data
						})
					}
				})
			}
		},
		resetSelection() {
			this.gridOptions.api.forEachNode((node) => {
				node.detail = false
			})
			this.gridOptions.api.redrawRows()
		},
	}
}
</script>

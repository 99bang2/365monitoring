<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<slot><i class="mdi mdi-history"/>온도측정목록</slot>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-2-5@s">
					</div>
					<div class="uk-width-1-5@s">
					</div>
					<div class="uk-width-2-5@s">
						<ScInput v-model="searchKeyword" placeholder="장비명 검색">
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
import ScCard from "~/components/card/components/Card.vue";
import ScInput from "~/components/Input.vue";
import {agGridMixin} from "~/plugins/ag-grid.mixin";

export default {
	components: {ScInput, ScCard},
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
					width: 80,
				},
				{
					headerName: '측정온도',
					field: 'temp',
					width: 80,
					valueFormatter: obj => {
						if (obj.value !== null && typeof obj.value !== 'undefined') {
							let result = parseFloat(obj.value.toFixed(2))
							return result + '°C'
						} else {
							return null
						}
					}
				},
				{
					headerName: '장비명',
					field: 'moduler.name',
					width: 80
				},
				{
					headerName: 'MAC주소',
					field: 'moduler.mac',
					width: 140
				},
				{
					headerName: '측정시간',
					field: 'createdAt',
					width: 150,
					valueFormatter: obj => {
						return this.$moment(obj.value).format('YYYY-MM-DD HH:mm:ss')
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
	async mounted() {
		await this.fetchData()
	},
	methods: {
		async fetchData() {
			let res = await this.$axios.$get(this.config.apiUrl + '/measures')
			this.gridOptions.api.setRowData(res.data)
		}
	}
}
</script>


<style scoped lang="scss">

</style>

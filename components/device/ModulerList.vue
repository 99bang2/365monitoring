<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed">
				<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
					<div class="uk-flex-1">
						<ScCardTitle>
							<slot><i class="mdi mdi-view-module"/>모듈 목록</slot>
						</ScCardTitle>
					</div>
					<div class="uk-text-nowrap">
						<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block"
						   @click.prevent="openNewForm" data-uk-tooltip="모듈 등록"/>
					</div>
				</ScCardHeader>
				<ScCardBody>
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
		</Transition>
		<ModulerForm/>
	</div>
</template>
<script>
import {agGridMixin} from "@/plugins/ag-grid.mixin";
import ModulerForm from "./ModulerForm.vue"
import ScCard from "@/components/card/components/Card.vue";
import {copyObj} from "codemirror/src/util/misc";

export default {
	name: "ModulerList",
	components: {
		ScCard,
		ModulerForm
	},
	mixins: [
		agGridMixin
	],
	data() {
		return {
			cardFormClosed: true,
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
			deviceUid: null
		}
	},
	mounted() {
		let vm = this
		this.$nuxt.$on('open-moduler-list', (data) => {
			this.deviceUid = data
			vm.fetchData(data)
		})
		this.$nuxt.$on('close-moduler-list', () => {
			vm.closeForm()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('fetch-moduler-list')
		this.$nuxt.$off('open-moduler-list')
		this.$nuxt.$off('close-moduler-list')
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
					headerName: '모듈러명',
					field: 'name',
					width: 140
				},
				{
					headerName: '모듈러고유번호',
					field: 'mac',
					width: 180
				},
				{
					headerName: "모듈러유형",
					field: "type",
					width: 100,
					valueFormatter: obj => {
						return obj.value === 'temp' ? "온도계" : "닫힘센서"
					}
				},
				{
					headerName: "닫힘상태",
					field: 'isClose',
					width: 60,
					valueFormatter: obj => {
						if (obj.value !== null && typeof obj.value !== 'undefined') {
							return obj.value ? "닫힘" : "열림"
						} else {
							return null
						}
					}
				},
				{
					headerName: '온도값(섭씨)',
					field: 'temp',
					width: 140
				}, {
					headerName: '온도 정상범위(최소값)',
					field: 'normalMin',
					width: 140
				}, {
					headerName: '온도 정상범위(최대값)',
					field: 'normalMax',
					width: 140
				},
				{
					headerName: "메세지 거부시간",
					field: "lockDuration",
					width: 100,
					valueFormatter: obj => {
						return obj.value ? obj.value + '분' : ''
					}
				},
				{
					headerName: '장비상태',
					field: 'status',
					width: 80
				},
				{
					headerName: '알림',
					field: 'isNotify',
					width: 80,
					valueFormatter: obj => {
						if (obj.value !== null && typeof obj.value !== 'undefined') {
							return obj.value ? '알림설정' : "알림해제"
						} else {
							return null
						}
					}
				},
				{
					headerName: '최종 수신일시',
					field: 'lastReceivedAt',
					width: 160,
					valueFormatter: obj => {
						return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
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
	methods: {
		openNewForm() {
			this.$nuxt.$emit('open-moduler-form', {deviceUid: this.deviceUid})
		},
		onRowClicked(props) {
			this.$nuxt.$emit('open-moduler-form', {deviceUid: this.deviceUid, ...props})
		},
		closeForm() {
			this.cardFormClosed = true
		},
		async fetchData(uid) {
			let res = await this.$axios.$get(this.config.apiUrl + '/modulers', {
				params: {
					deviceUid: uid
				}
			})
			this.cardFormClosed = false
			setTimeout(() => {
				this.gridOptions.api.setRowData(res.data)
			}, 100)
		}
	}
}
</script>

<style scoped lang="scss">

</style>

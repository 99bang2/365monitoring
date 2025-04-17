<template>
	<div id="modal-moduler-form" data-uk-modal="bg-close: false; esc-close: false; stack:true">
		<div class="uk-modal-dialog" style="width: 640px;">
			<div v-if="$store.state.vxProgressOverlay" class="mask"></div>
			<button class="uk-modal-close-default" type="button" data-uk-close/>
			<div class="uk-modal-header">
				<h2 class="uk-modal-title">
					<i class="mdi mdi-view-module"/> 모듈러 관리
				</h2>
			</div>
			<div class="uk-modal-body">
				<form class="uk-grid-small uk-grid" data-uk-grid>
					<div class="uk-width-1-2">
						<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error"
							:validator="$v.sendData.name">
							<label style="top:0">
								모듈러명
							</label>
							<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
						</ScInput>
						<ul class="sc-vue-errors">
							<li v-if="!$v.sendData.name.required">
								모듈러명을 입력하세요.
							</li>
						</ul>
					</div>
					<div class="uk-width-1-2">
						<ScInput v-model="sendData.mac" :error-state="$v.sendData.mac.$error"
							:validator="$v.sendData.mac">
							<label style="top:0">
								모듈 고유번호
							</label>
							<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
						</ScInput>
						<ul class="sc-vue-errors">
							<li v-if="!$v.sendData.mac.required">
								모듈고유번호를 입력하세요.
							</li>
							<li v-if="!$v.sendData.mac.macAddress">
								맥 주소 형식에 맞추주세요
							</li>
						</ul>
					</div>
					<div class="uk-width-1-2">
						<div class="uk-margin uk-heading-hero"
							style="text-align: left; margin-left:5px; margin-bottom: -4px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
							<span>타입</span>
						</div>
						<Select2 div-style="padding:0" v-model="sendData.type" :options="typeList"
							:settings="{ 'width': '100%', 'placeholder': '타입 선택' }"/>
					</div>
					<div class="uk-width-1-2" v-if="sendData.type==='temp'">
						<ScInput v-model="sendData.normalMin" :error-state="$v.sendData.normalMin.$error"
							:validator="$v.sendData.normalMin">
							<label style="top:0">
								온도 정상범위(최소값)
							</label>
							<span slot="icon" class="uk-form-icon uk-form-icon-flip"
								data-uk-icon="icon: settings"/>
						</ScInput>
						<ul class="sc-vue-errors">
							<li v-if="!$v.sendData.normalMin.required">
								온도 최소값을 입력하세요.
							</li>
						</ul>
					</div>
					<div class="uk-width-1-2" v-if="sendData.type==='temp'">
						<ScInput v-model="sendData.normalMax" :error-state="$v.sendData.normalMax.$error"
							:validator="$v.sendData.normalMax">
							<label style="top:0">
								온도 정상범위(최대값)
							</label>
							<span slot="icon" class="uk-form-icon uk-form-icon-flip"
								data-uk-icon="icon: settings"/>
						</ScInput>
						<ul class="sc-vue-errors">
							<li v-if="!$v.sendData.normalMax.required">
								온도 최대값을 입력하세요.
							</li>
						</ul>
					</div>
					<div class="uk-width-1-2" v-if="sendData.type === 'isClose'">
						<input id="switch-css" v-model="sendData.isClose" type="checkbox"
							class="sc-switch-input">
						<label for="switch-css" class="sc-switch-label"
							style="margin-top:15px;margin-left:15px;">
							<span class="sc-switch-toggle-on">닫힘</span>
							<span class="sc-switch-toggle-off">열림</span>
						</label>
					</div>
					<div class="uk-width-1-2">
						<ScInput v-model="sendData.lockDuration" :error-state="$v.sendData.lockDuration.$error"
							:validator="$v.sendData.lockDuration">
							<label style="top:0">
								메세지 거부시간
							</label>
							<span slot="icon" class="uk-form-icon uk-form-icon-flip"
								data-uk-icon="icon: clock"/>
						</ScInput>
						<ul class="sc-vue-errors">
							<li v-if="!$v.sendData.lockDuration.required">
								메세지 거부시간을 입력하세요.
							</li>
						</ul>
					</div>
					<div class="uk-width-1-2">
						<input id="switch-css" v-model="sendData.isNotify" type="checkbox"
							class="sc-switch-input">
						<label for="switch-css" class="sc-switch-label"
							style="margin-top:15px;margin-left:15px;">
							<span class="sc-switch-toggle-on">알림설정</span>
							<span class="sc-switch-toggle-off">알림해제</span>
						</label>
					</div>
				</form>
			</div>
			<div class="uk-modal-footer">
				<div class="uk-margin-top uk-text-center">
					<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'"
						@click="submitForm">
						{{ sendData.uid ? '수정' : '등록' }}
					</button>
					<button class="sc-button sc-button-danger" v-if="sendData.uid" @click="deleteForm">
						삭제
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import ScInput from "@/components/Input.vue";
import {validationMixin} from "vuelidate";
import {macAddress, required, requiredIf} from "vuelidate/lib/validators";
import Select2 from "@/components/Select2.vue";

export default {
	name: "ModulerForm",
	components: {Select2, ScInput},
	mixins: [
		validationMixin
	],
	props: {
		mode: {
			type: String,
			default: 'list'
		},
	},
	data() {
		return {
			cardFormClosed: true,
			submitStatus: null,
			sendData: {},
			typeList: [{
				id: 'temp',
				text: '온도계'
			}, {
				id: "isClose",
				text: '닫힘센서'
			}],
			defaultForm: {
				uid: null,
				name: '',
				mac: '',
				type: 'temp',
				isClose: false,
				normalMin: null,
				normalMax: null,
				lockDuration: null,
				isNotify: true,
			},
			deviceUid: null
		}
	},
	validations: {
		sendData: {
			name: {
				required
			},
			mac: {
				required,
				macAddress
			},
			normalMin: {
				required: requiredIf(function (nestedModel) {
					return nestedModel.type === 'temp'
				}),
			},
			normalMax: {
				required: requiredIf(function (nestedModel) {
					return nestedModel.type === 'temp'
				}),
			},
			lockDuration: {
				required
			}
		}
	},
	created() {
		let vm = this
		this.$nuxt.$on('open-moduler-form', (data) => {
			let {deviceUid, ...rest} = data
			this.deviceUid = deviceUid
			let isRestEmpty = Object.keys(rest).length === 0;
			let result = isRestEmpty ? null : rest
			vm.settingForm(result)
			UIkit.modal(`#modal-moduler-form`).show()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('open-moduler-form')
	},
	methods: {
		settingForm(props) {
			this.$v.$reset()
			if (props) {
				this.sendData = JSON.parse(JSON.stringify(props.data))
			} else {
				this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
			}
		},
		close() {
			UIkit.modal(`#modal-moduler-form`).hide()
		},
		submitForm(e) {
			e.preventDefault()
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				this.sendData.deviceUid = this.deviceUid
				if (this.sendData.uid) {
					this.putForm()
				} else {
					this.postForm()
				}
			}
		},
		postForm() {
			this.$axios.$post(this.config.apiUrl + '/modulers', this.sendData).then(async res => {
				this.callNotification('등록하였습니다.')
				this.$nuxt.$emit('open-moduler-list', res.data.deviceUid)
			}).finally(() => {
				this.submitStatus = 'OK'
				this.close()
			})
		},
		putForm() {
			this.$axios.$patch(this.config.apiUrl + '/modulers/' + this.sendData.uid, this.sendData).then(async res => {
				this.callNotification('수정하였습니다.')
				this.$nuxt.$emit('open-moduler-list', res.data.deviceUid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		deleteForm() {
			this.$axios.$delete(this.config.apiUrl + '/modulers/' + this.sendData.uid).then(async res => {
				this.callNotification('삭제되었습니다.')
				this.$nuxt.$emit('open-moduler-list', this.deviceUid)
			}).finally(() => {
				this.close()
			})
		}
	}
}
</script>


<style scoped lang="scss">
.uk-list {
	height: 400px;
	overflow-y: auto;

	li {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
	}
}

[class*='uk-list'] > ::before {
	content: inherit;
}

.uk-modal-body {
	display: block;
}

.search-box {
	display: flex;
	margin-bottom: 10px;
	justify-content: space-between;

	.uk-button {
		align-self: center;
	}
}

.mask {
	width: 100%;
	height: 620px;
	position: absolute;
	background-color: rgba(0, 0, 0, 0.37);
	z-index: 20000;
}
</style>

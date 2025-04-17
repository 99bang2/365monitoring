<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-devices"/>
								장비 {{ sendData.uid ? '상세': '등록' }}
							</ScCardTitle>
						</div>
						<ScCardActions v-if="mode !== 'mypage'">
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close" @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px;">
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error" :validator="$v.sendData.name">
									<label style="top:0">
										장비명
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										장비명을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.mac" :error-state="$v.sendData.mac.$error" :validator="$v.sendData.mac">
									<label style="top:0">
										장비 고유번호
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: desktop"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.mac.required">
										장비고유번호를 입력하세요.
									</li>
									<li	v-if="!$v.sendData.mac.macAddress">
										맥 주소 형식에 맞추주세요
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1">
								<div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: -4px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
									<span>그룹</span>
								</div>
								<Select2 div-style="padding:0" v-model="sendData.groupUid" :options="groupOpts" :settings="{ 'width': '100%', 'placeholder': '그룹 선택' }"/>
							</div>
						</form>
					</div>
					<div class="uk-margin-top uk-text-center">
						<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">
							{{ sendData.uid ? '수정': '등록' }}
						</button>
					</div>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, macAddress} from 'vuelidate/lib/validators'
import ScInput from '~/components/Input'
import Convert from "@/plugins/convertJson";
import Select2 from "@/components/Select2.vue";


export default {
	components: {
		Select2,
		ScInput,
	},
	mixins: [
		validationMixin,
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
			groupOpts: [],
			defaultForm: {
				uid: null,
				name: '',
				mac: '',
				groupUid: null,
			},
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
			}
		}
	},

	created() {
		let vm = this
		this.$nuxt.$on('open-device-form', (data) => {
			vm.settingForm(data)
		})
		this.$nuxt.$on('close-device-form', () => {
			vm.closeForm()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('open-device-form')
		this.$nuxt.$off('close-device-form')
	},
	async beforeMount() {
		let code= await this.$axios.$get(this.config.apiUrl+'/groups')
		this.groupOpts = Convert.convertJson(code.data, 'group')
		this.sendData = this.defaultForm
	},
	methods: {
		settingForm(props){
			this.$v.$reset()
			if(props) {
				this.sendData = JSON.parse(JSON.stringify(props.data))
				this.$nuxt.$emit('open-moduler-list', this.sendData.uid)
			}else {
				this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
			}
			this.cardFormClosed = true
			setTimeout(() => {
				this.cardFormClosed = false
			}, 100)
		},
		closeForm() {
			this.cardFormClosed = true
			if(this.sendData.uid) {
				this.$nuxt.$emit('close-moduler-list')
			}
			this.$nuxt.$emit('reset-device-list')
		},
		submitForm(e) {
			e.preventDefault()
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				if (this.sendData.uid) {
					this.putForm()
				} else {
					this.postForm()
				}
			}
		},
		postForm() {
			console.log(this.sendData)
			this.$axios.$post(this.config.apiUrl + '/devices', this.sendData).then(async res => {
				this.callNotification('등록하였습니다.')
				this.$nuxt.$emit('fetch-device-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		putForm() {
			this.$axios.$patch(this.config.apiUrl + '/devices/' + this.sendData.uid, this.sendData).then(async res => {
				this.callNotification('수정하였습니다.')
				this.$nuxt.$emit('fetch-device-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		openNewForm() {

		}
	}
}
</script>

<style lang="scss">
	.sc-vue-errors li {
		font-size: 12px;
	}
	.available-list {
		margin: 5px 0;
		font-size: 12px;
		padding: 12px 12px;
		background-color: #ececec;
		border-radius: 5px;

	}
	.edit-available {
		font-size: 16px;
	}
</style>

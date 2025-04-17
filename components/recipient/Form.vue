<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-devices"/>
								수신자 {{ sendData.uid ? '상세': '등록' }}
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
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error" :validator="$v.sendData.name">
									<label style="top:0">
										이름
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										이름을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.email" :error-state="$v.sendData.email.$error" :validator="$v.sendData.email">
									<label style="top:0">
										이메일
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.email.required">
										이메일을 입력하세요.
									</li>
									<li v-if="!$v.sendData.email.email">
										이메일 형식을 지켜주세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.phone" :error-state="$v.sendData.phone.$error" :validator="$v.sendData.phone">
									<label style="top:0">
										전화번호
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: receiver"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.phone.required">
										전화번호를 입력하세요.
									</li>
									<li v-if="!$v.sendData.phone.phoneFormatCheck">
										전화번호형식을 지켜주세요
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2">
								<input id="switch-css" v-model="sendData.isActive" type="checkbox" class="sc-switch-input">
								<label for="switch-css" class="sc-switch-label" style="margin-top:15px;margin-left:15px;">
									<span class="sc-switch-toggle-on">활성화</span>
									<span class="sc-switch-toggle-off">비활성화</span>
								</label>
							</div>
							<div class="uk-width-1-2">
								<div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: -4px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
									<span>그룹</span>
								</div>
								<Select2 div-style="padding:0" v-model="sendData.groups" :options="groupOpts" :settings="{ 'width': '100%', 'placeholder': '그룹 선택' }" multiple/>
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
import customValidators from '~/plugins/vuelidateValidators'
import {required, email} from 'vuelidate/lib/validators'
import ScInput from '~/components/Input'
import Select2 from "@/components/Select2.vue";
import Convert from "@/plugins/convertJson";

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
				phone: '',
				email: '',
				groups: [],
				isActive: true
			}
		}
	},
	validations: {
		sendData: {
			name: {
				required
			},
			phone: {
				required,
				phoneFormatCheck: customValidators.phoneFormatCheck()
			},
			email:{
				required,
				email
			},
		}
	},
	created() {
		let vm = this
		this.$nuxt.$on('open-recipient-form', (data) => {
			vm.settingForm(data)
		})
		this.$nuxt.$on('close-recipient-form', () => {
			vm.closeForm()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('open-recipient-form')
		this.$nuxt.$off('close-recipient-form')
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
			this.$nuxt.$emit('reset-recipient-list')
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
			this.$axios.$post(this.config.apiUrl + '/recipients', this.sendData).then(async res => {
				this.callNotification('등록하였습니다.')
				this.$nuxt.$emit('fetch-recipient-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		putForm() {
			this.$axios.$patch(this.config.apiUrl + '/recipients/' + this.sendData.uid, this.sendData).then(async res => {
				this.callNotification('수정하였습니다.')
				this.$nuxt.$emit('fetch-recipient-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
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

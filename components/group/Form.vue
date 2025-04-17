<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-account-group"/>
								그룹 {{ sendData.uid ? '상세': '등록' }}
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
										그룹명
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										그룹명을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2">
								<input id="switch-css" v-model="sendData.isActive" type="checkbox" class="sc-switch-input">
								<label for="switch-css" class="sc-switch-label" style="margin-top:15px;margin-left:15px;">
									<span class="sc-switch-toggle-on">그룹활성화</span>
									<span class="sc-switch-toggle-off">그룹비활성화</span>
								</label>
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
import {required, minLength, minValue, sameAs, email, requiredIf} from 'vuelidate/lib/validators'
import customValidators from '~/plugins/vuelidateValidators'
import ScInput from '~/components/Input'

export default {
	components: {
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
			defaultForm: {
				uid: null,
				name: '',
				isActive: true
			}
		}
	},
	validations: {
		sendData: {
			name: {
				required
			},
		}
	},
	created() {
		let vm = this
		this.$nuxt.$on('open-group-form', (data) => {
			vm.settingForm(data)
		})
		this.$nuxt.$on('close-group-form', () => {
			vm.closeForm()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('open-group-form')
		this.$nuxt.$off('close-group-form')
	},
	async beforeMount() {
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
			this.$nuxt.$emit('reset-group-list')
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
			this.$axios.$post(this.config.apiUrl + '/groups', this.sendData).then(async res => {
				this.callNotification('등록하였습니다.')
				this.$nuxt.$emit('fetch-group-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		putForm() {
			this.$axios.$patch(this.config.apiUrl + '/groups/' + this.sendData.uid, this.sendData).then(async res => {
				this.callNotification('수정하였습니다.')
				this.$nuxt.$emit('fetch-group-list', res.data.uid)
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

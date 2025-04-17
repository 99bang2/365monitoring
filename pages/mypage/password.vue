<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-5@l">
					<ScCard>
						<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark" separator>
							<div class="uk-flex-1 sc-light">
								<ScCardTitle>
									<i class="mdi mdi-account-key-outline"></i> 비밀번호 변경
								</ScCardTitle>
							</div>
						</ScCardHeader>
						<ScCardBody>
							<div>
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											기존비밀번호
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-old-password" v-model="userData.oldPassword" type="password" :error-state="$v.userData.oldPassword.$error" :validator="$v.userData.oldPassword"></ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.userData.oldPassword.required">
												기존비밀번호를 입력하세요.
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											변경비밀번호
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-new-password" v-model="userData.newPassword" type="password" :error-state="$v.userData.newPassword.$error" :validator="$v.userData.newPassword"></ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.userData.newPassword.required">
												변경비밀번호를 입력하세요.
											</li>
											<li v-if="!$v.userData.newPassword.passwordFormatCheck">
												4~20자의 영문 대소문자, 숫자, 특수문자만 사용 가능합니다.
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											비밀번호확인
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-password-confirm" v-model="userData.passwordConfirm" type="password" :error-state="$v.userData.passwordConfirm.$error" :validator="$v.userData.passwordConfirm"></ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.userData.passwordConfirm.sameAsPassword">
												비밀번호가 일치하지 않습니다.
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="uk-margin-top uk-align-right">
								<button class="sc-button sc-button-flex sc-button-primary" :disabled="submitStatus === 'PENDING'" @click.prevent="submitForm">
									<span class="uk-margin-small-right" data-uk-icon="icon: cog"></span>
									<span style="margin-top:-1px">변경</span>
								</button>
							</div>
						</ScCardBody>
					</ScCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, minValue, sameAs, email, requiredIf} from 'vuelidate/lib/validators'
import customValidators from '~/plugins/vuelidateValidators'
import ScInput from '~/components/Input'
import ScTextarea from '~/components/Textarea'
import Select2 from '~/components/Select2'
import moment from '~/plugins/moment'
import {agGridMixin} from "../../plugins/ag-grid.mixin"

export default {
	middleware: ['auth'],
	components: {
		ScInput,
	},
	mixins: [
		validationMixin,
		agGridMixin
	],
	data() {
		return {
			submitStatus: null,
			userData: {
				oldPassword: '',
				newPassword: '',
				passwordConfirm: '',
			},
		}
	},
	validations: {
		userData: {
			oldPassword: {
				required
			},
			newPassword: {
				required,
				passwordFormatCheck: customValidators.passwordFormatCheck()
			},
			passwordConfirm: {
				sameAsPassword: sameAs('newPassword')
			},
		}
	},
	async mounted() {
	},
	methods: {
		submitForm(e) {
			e.preventDefault()
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				this.$axios.$put(this.config.apiUrl + '/password', this.userData).then(res => {
					this.$v.$reset()
					this.userData = {
						oldPassword: '',
						newPassword: '',
						passwordConfirm: ''
					}
					this.callNotification('변경하였습니다.')
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			}
		},
	}
}
</script>
<style lang="scss">
	.sc-vue-errors li {
		font-size: 12px;
	}
</style>

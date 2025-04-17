<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-5@l">
					<ScCard>
						<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark" separator>
							<div class="uk-flex-1 sc-light">
								<ScCardTitle>
									<i class="mdi mdi-account-circle"></i> 계정정보
								</ScCardTitle>
							</div>
							<div>
								<button class="sc-button sc-button-flex" :disabled="submitStatus === 'PENDING'" @click.prevent="submitForm">
									<span class="uk-margin-small-right" data-uk-icon="icon: cog"></span>
									<span style="margin-top:-1px">저장</span>
								</button>
							</div>
						</ScCardHeader>
						<ScCardBody>
							<div>
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary" for="user-id">
											아이디
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-id" v-model="userData.id" :read-only="true"></ScInput>
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary" for="user-name">
											이름
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-name" v-model="userData.name" :error-state="$v.userData.name.$error" :validator="$v.userData.name"></ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.userData.name.required">
												이름을 입력하세요.
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											전화번호
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-phone" v-model="userData.phone"></ScInput>
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											휴대전화
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-mobile" v-model="userData.mobile" />
									</div>
								</div>
							</div>
							<div class="uk-margin-top">
								<div class="uk-flex-middle uk-grid" data-uk-grid>
									<div class="uk-width-1-4@m">
										<label class="sc-color-secondary">
											이메일
										</label>
									</div>
									<div class="uk-width-expand">
										<ScInput id="user-email" v-model="userData.email" :error-state="$v.userData.email.$error" :validator="$v.userData.email" />
										<ul class="sc-vue-errors">
											<li v-if="!$v.userData.email.email">
												올바른 이메일 형식이 아닙니다.
											</li>
										</ul>
									</div>
								</div>
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
			userData: {},
		}
	},
	validations: {
		userData: {
			name: {
				required
			},
			email: {
				email
			}
		}
	},
	async mounted() {
		await this.fetchData()
	},
	methods: {
		async fetchData() {
			let user = await this.$axios.$get(this.config.apiUrl + `/`)
			this.userData = user.data
		},
		submitForm(e) {
			e.preventDefault()
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				this.$axios.$put(this.config.apiUrl + '/', this.userData).then(res => {
					this.callNotification('수정하였습니다.')
					this.fetchData()
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

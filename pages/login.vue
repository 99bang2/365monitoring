<template>
	<div class="uk-flex uk-flex-center uk-flex-middle sc-login-page-wrapper">
		<div class="uk-width-2-3@s uk-width-1-2@m uk-width-1-3@l uk-width-1-4@xl uk-margin-auto-vertical">
			<ScCard class="login-box">
				<ScCardBody class="login-body">
					<div class="logo-section">
						<img src="~/assets/img/daol365_logo2.png" />
					</div>
					<div class="input-section">
						<div class="login-title">DAOL365 관리자</div>
						<div class="center inputs">
							<div><input class="form-input" v-model="loginData.email" placeholder="이메일"/></div>
							<div><input class="form-input" v-model="loginData.password" type="password" placeholder="비밀번호"/></div>
						</div>
						<div class="buttons">
							<button class="login-button" @click="login">로그인</button>
						</div>
					</div>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/Input'

export default {
	layout: 'login_page',
	middleware: ['auth'],
	data: () => ({
		loginData: {
			email: '',
			password: ''
		},
	}),
	methods: {
		login(e) {
			if(e.type === 'click' || e.keyCode === 13) {
				if (this.loginData.email === '' || this.loginData.email === null) {
					return false
				}
				if (this.loginData.password === '' || this.loginData.password === null) {
					return false
				}
				this.$auth.loginWith('local', {
					data: this.loginData
				}).then(() => {
					window.location = '/'
				})
			}
		}
	},
}
</script>
<style lang="scss" scoped>
.login-box {
	width: 480px;
	height: 305px;
	background-color: #fff;
	align-self: center;
	border-radius: 0;
	padding: 0;
	display: flex;
	.login-body {
		display: flex;
		padding: 24px 8px;
		width: 480px;
		.logo-section {
			width: 148px;
			padding-left: 5px;
			/*border-right: 1px solid #3BAC65;*/
			border-right: 1px solid #4891ce;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: #c8102e;
			img {
				margin: auto;
			}
			&__main{
				font-size: 70px;
				font-weight: bold;
			}
		}
		.input-section {
			width: 250px;
			padding: 0 33px 0 23px;
			.login-title {
				text-align: center;
				padding: 20px 0;
				font-weight: 400;
				color: #12173f;
				font-size: 18px;
			}
			.inputs {
				width: 230px;
				margin-top: 5px;
				.form-input {
					border: 0;
					border-bottom: 1px solid #12173f;
					width: 230px;
					background-color: #FFF;
					margin-bottom: 10px;
					padding: 10px;
					outline: 0;
				}
				.form-input::placeholder {
					color: #12173f;
				}
			}
			.buttons {
				width: 250px;
				margin-top: 28px;
				text-align: center;
				.login-button {
					box-shadow: none;
					background-color: #12173f;
					width: 250px;
					height: 50px;
					line-height: 50px;
					border-radius: 0;
					letter-spacing: 1.6px;
					color: #F4EFE7;
					font-size: 16px;
					font-weight: bold;
					border: 0;
				}
			}
		}
	}

}
</style>

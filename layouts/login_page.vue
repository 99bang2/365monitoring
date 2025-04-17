<template>
	<nuxt />
</template>

<script>
export default {
	head: {
		htmlAttrs: {
			class: 'sc-login-page'
		}
	}
}
</script>

<style lang="scss">
	@import "~scss/common/md_colors";
	@import "~scss/common/variables_mixins";
	.sc-login-page {
		body {
			overflow: auto;
			padding: 24px;
			background-color: #12173f;
		}
		body,
		#__nuxt,
		#__layout {
			height: 100%;
		}
		&-wrapper {
			height: calc(100vh - 48px);
			@include respond-below(medium) {
				height: auto;
				align-items: flex-start;
			}
		}
		&-inner {
			padding: 16px;
			@include respond-below(medium) {
				padding: 8px 0;
			}
		}
		&-logo {
			padding: 24px;
			text-align: center;
			font-size: 28px;
			font-weight: bold;
			color: #3e2723;
			@include respond-below(medium) {
				padding: 12px 24px;
				margin-bottom: 8px;
			}
			img {
			}
			p {
				font-size: 20px;
				font-weight: bold;
				margin: 20px 0 0;
			}
		}
	}
</style>

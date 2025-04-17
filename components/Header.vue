<template>
	<header id="sc-header" ref="header">
		<nav class="uk-navbar uk-navbar-container" data-uk-navbar="mode: click; duration: 360">
			<div class="uk-navbar-left nav-overlay-small uk-margin-right uk-navbar-aside">
				<a v-if="!vxTopMenuActive && !vxSidebarMiniActive" id="sc-sidebar-main-toggle" href="javascript:void(0)" @click.stop="toggleMainSidebar">
					<i v-if="sidebarMainExpanded" class="mdi mdi-backburger" />
					<i v-if="!sidebarMainExpanded" class="mdi mdi-menu" />
				</a>
				<div class="sc-brand uk-visible@m">
					<nuxt-link to="/">
						DAOL365 관리자
					</nuxt-link>
				</div>
			</div>
			<div class="nav-overlay nav-overlay-small uk-navbar-right">
				<ul class="uk-navbar-nav">
					<li class="uk-visible@l">
						<ScFullscreen id="sc-js-fullscreen-toggle" />
					</li>
					<li>
						<a href="javascript:void(0)" class="md-color-white">
							<span class="uk-navbar-toggle-icon"><i class="mdi mdi-account"></i></span>
							<span class="uk-navbar-subtitle" style="font-size:14px;vertical-align: top;line-height: 50px;text-transform: none">{{ $auth.user.id }}</span>
						</a>
						<div class="uk-navbar-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-navbar">
								<li>
									<nuxt-link to="/mypage/password">
										<i class="mdi mdi-account-key-outline" style="vertical-align: sub;"></i> 비밀번호변경
									</nuxt-link>
								</li>
								<li>
									<a href="javascript:void(0)" @click="logout">
										<i class="mdi mdi-logout" style="vertical-align: sub;"></i> 로그아웃
									</a>
								</li>
							</ul>
						</div>
					</li>
				</ul>
				<a v-if="vxOffcanvasPresent" href="javascript:void(0)" class="md-color-white uk-margin-left uk-hidden@l" @click="toggleOffcanvas">
					<i v-show="!vxOffcanvasExpanded" class="mdi mdi-menu"></i><i v-show="vxOffcanvasExpanded" class="mdi mdi-arrow-right"></i>
				</a>
			</div>
		</nav>
	</header>
</template>

<script>
import {mapState} from 'vuex'
import {scMq} from '~/assets/js/utils'
import ScFullscreen from '~/components/FullScreen.vue'
import ScTopMenu from '~/components/topmenu/TopMenu.vue'
import {scHelpers} from "~/assets/js/utils"

const {uniqueID} = scHelpers

export default {
	components: {
		ScFullscreen,
		//ScTopMenu
	},
	data: () => ({
		sidebarMainExpanded: true,
		offcanvasExpanded: false,
		offcanvasPresent: false,
		alertsEmpty: null,
		topMenuData: [
			{
				id: uniqueID(),
				title: "Mailbox",
				url: '/pages/mailbox'
			},
			{
				id: uniqueID(),
				title: "Components",
				url: null,
				isOpen: false,
				submenu: [
					{
						id: uniqueID(),
						title: "Accordion",
						url: '/components/accordion'
					},
					{
						id: uniqueID(),
						title: "Alert",
						url: '/components/alert'
					},
					{
						id: uniqueID(),
						title: "Avatars",
						url: '/components/avatars'
					},
					{
						id: uniqueID(),
						title: "Grid",
						url: '/components/grid'
					}
				]
			},
			{
				id: uniqueID(),
				title: "Pages",
				url: null,
				isOpen: false,
				submenu: [
					{
						id: uniqueID(),
						title: "Blank",
						url: '/pages/blank'
					},
					{
						id: uniqueID(),
						title: "Gallery",
						url: '/pages/gallery'
					},
					{
						id: uniqueID(),
						title: "Settings",
						url: '/pages/settings'
					}
				]
			},
			{
				id: uniqueID(),
				title: "Nested",
				url: null,
				isOpen: false,
				submenu: [
					{
						id: uniqueID(),
						title: "Level 1",
						url: null,
					},
					{
						id: uniqueID(),
						title: "Level 1",
						url: null,
						isOpen: false,
						submenu: [
							{
								id: uniqueID(),
								title: "Sub-level 1.1",
								url: null
							},
							{
								id: uniqueID(),
								title: "Sub-level 1.1",
								url: null
							},
							{
								id: uniqueID(),
								title: "Sub-level 1.1",
								url: null,
								isOpen: false,
								submenu: [
									{
										id: uniqueID(),
										title: "Sub-level 1.1.1",
										url: null
									},
									{
										id: uniqueID(),
										title: "Sub-level 1.1.1",
										url: null
									},
									{
										id: uniqueID(),
										title: "Sub-level 1.1.1",
										url: null
									},
									{
										id: uniqueID(),
										title: "Sub-level 1.1.1",
										url: null
									},
									{
										id: uniqueID(),
										title: "Sub-level 1.1.1",
										url: null
									}
								]
							},
							{
								id: uniqueID(),
								title: "Sub-level 1.1",
								url: null
							},
							{
								id: uniqueID(),
								title: "Sub-level 1.1",
								url: null
							}
						]
					},
					{
						id: uniqueID(),
						title: "Level 1",
						url: null,
					},
					{
						id: uniqueID(),
						title: "Level 1",
						url: null,
					}
				]
			}
		],
		availableLangs: [
			{
				code: 'ko',
				name: 'Korean'
			},
			{
				code: 'en',
				name: 'English'
			},
			{
				code: 'fr',
				name: 'French'
			},
			{
				code: 'es',
				name: 'Spanish'
			}
		]
	}),
	computed: {
		...mapState([
			'vxSidebarMainExpanded',
			'vxOffcanvasPresent',
			'vxOffcanvasExpanded',
			'vxTopMenuActive',
			'vxActiveLocale',
			'vxSidebarMiniActive',
			'site'
		])
	},
	watch: {
		'vxSidebarMainExpanded'(state) {
			this.sidebarMainExpanded = state
		},
		'vxOffcanvasExpanded'(state) {
			this.offcanvasExpanded = state
		},
		'vxOffcanvasPresent'(state) {
			this.offcanvasPresent = state
		}
	},
	mounted() {
		const self = this
		self.$nextTick(() => {
			if (scMq.mediumMin()) {
				self.sidebarMainExpanded = this.vxSidebarMainExpanded
			} else {
				self.sidebarMainExpanded = false
			}
		})
		// sticky header
		let options = scMq.mediumMax() ? {showOnUp: true, animation: "uk-animation-slide-top"} : {}
		UIkit.sticky(this.$refs.header, options)
	},
	methods: {
		toggleMainSidebar() {
			let state = !this.sidebarMainExpanded
			this.$store.commit('sidebarMainToggle', state)
		},
		toggleOffcanvas() {
			let state = !this.offcanvasExpanded
			this.$store.commit('offcanvasToggle', state)
		},
		updateLocale(event, code) {
			if (code === this.vxActiveLocale) {
				event.preventDefault()
			}
			this.$i18n.setLocale(code)
			this.$store.commit('updateLocale', code)
			this.isActiveLang(code)
		},
		isActiveLang(code) {
			return code === this.vxActiveLocale
		},
		async logout() {
			await this.$auth.logout()
			await this.$router.push('/login')
		}
	}
}
</script>

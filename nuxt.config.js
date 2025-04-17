/* options */
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/configs/config.json')[env]
const mode = 'spa' // universal/spa
const serveFromSubFolder = false

/* options end */

const pkg = require('./package')
const path = require('path')

let dist = 'dist'
module.exports = {
	mode: mode,
	/*
	** Headers of the page
	*/
	head: {
		htmlAttrs: {
			lang: 'ko'
		},
		title: 'DAOL365 ADMIN',
		meta: [
			{charset: 'utf-8'},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: pkg.description
			}
		],
		script: [
			{src: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/vendor/uikit.js'}
		],
		link: [
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/favicon.ico'
			},
			{
				rel: 'preload',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/vendor/uikit.js',
				as: 'script'
			},
			{
				rel: 'preload',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/roboto_base64.css',
				as: 'style'
			},
			{
				rel: 'preload',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/sourceCodePro_base64.css',
				as: 'style'
			},
			{
				rel: 'preload',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/mdi/css/materialdesignicons.css',
				as: 'style'
			},
			{
				rel: 'stylesheet',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/HGGGothicssi.css'
			},
			{
				rel: 'stylesheet',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/roboto_base64.css'
			},
			{
				rel: 'stylesheet',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/sourceCodePro_base64.css'
			},
			{
				rel: 'stylesheet',
				href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/mdi/css/materialdesignicons.css'
			}
		]
	},
	/*
	** Customize the progress-bar
	*/
	loading: {
		color: 'rgba(0,0,0,.8)'
	},
	/*
	** Customize the loading-indicator
	** only in spa mode
	*/
	loadingIndicator: {
		color: '#00838f',
		background: 'white'
	},
	/*
	** Global CSS
	*/
	css: [
		'uikit/dist/css/uikit.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		{src: '~/plugins/components.global.js'},
		{src: '~/plugins/directives.client.js'},
		{src: '~/plugins/filters.js'},
		{src: '~/plugins/mixins.client.js'},
		{src: '~/plugins/waves.client.js'},
		{src: '~/plugins/retina.client.js'},
		{src: '~/plugins/vueVisible.client.js'},
		{src: '~/plugins/ag-grid.js', ssr: false},
		{src: '~/plugins/axios.js', ssr: true},
		{src: '~/plugins/moment.js'},
		{src: '~/plugins/vuedraggable.js'}
	],
	router: {
		middleware: ['redirect', 'site'],
		base: process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '/' : '/' + dist
	},
	axios: {
		progress: false,
		baseURL: config.apiUrl,
	},
	modules: [
		'@nuxtjs/axios',
		[
			'nuxt-i18n',
			{
				defaultLocale: 'ko',
				locales: [
					{
						code: 'ko',
						file: 'ko-KR.js',
						name: 'Korean'
					}
				],
				lazy: true,
				langDir: 'lang/',
				strategy: 'no_prefix',
				vueI18n: {
					fallbackLocale: 'ko'
				},
				vuex: {
					syncLocale: true
				}
			}
		],
		'@nuxtjs/auth'
	],
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {url: config.apiUrl + '/login', method: 'post', propertyName: 'data.accessToken'},
					logout: {url: config.apiUrl + '/logout', method: 'get'},
					user: {url: config.apiUrl + '/info', method: 'get', propertyName: 'data.user'},
				},
			}
		},
		cookie: {
			options: {
				maxAge: 3600 * 24
			}
		},
		localStorage: false
	},
	generate: {
		dir: dist,
	},
	/*
	** Build configuration
	*/
	build: {
		// analyze: true,
		progress: true,
		/*babel: {
			babelrc: true,
			presets({isServer}) {
				return [
					[require.resolve('@nuxt/babel-preset-app'), {
						targets: isServer
							? {node: "current"}
							: {browsers: ["last 2 versions"], ie: 11},
						debug: false
					}]
				]
			}
		},*/
		vendor: [
			'ag-grid-vue',
		],
		extend(config, ctx) {
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push(
					// Run ESLint on save
					{
						enforce: 'pre',
						test: /\.(js|vue)$/,
						loader: 'eslint-loader',
						exclude: /(node_modules)/
					}
				)
			}
			// aliases
			config.resolve.alias['scss'] = path.resolve(__dirname, './assets/scss')
			// adjust path when serving app from sub-folder
			if (!ctx.isDev && serveFromSubFolder) {
				config.output.publicPath = '/' + dist + '/_nuxt/'
			}
			config.resolve.alias['vue'] = 'vue/dist/vue.common'
			return config
		}
	}
}

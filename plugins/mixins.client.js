import Vue from 'vue'
import { scDom } from '~/assets/js/utils'
import {mapState} from "vuex"
const { css } = scDom;
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../configs/config.json')[env]

Vue.mixin({
	data: () => ({
		config: config,
		maxImageSize: 10 * 1024 * 1000,
	}),
	methods: {
		findArrayIndex(array, findKey, key){
			let keys = array.map((obj) => obj[findKey])
			return keys.indexOf(key)
		},
		uniqueID (length) {
			let id = "";
			const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
			const _length = length || 8;
			for (let i = 0; i < _length; i++) {
				id += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return id;
		},
		callNotification(msg) {
			UIkit.notification(`<div class="uk-flex uk-flex-middle"><i class="mdi mdi-check-all uk-margin-right md-color-light-green-400"></i>${msg}</div>`)
		},
		callAlertError(msg, opt) {
			UIkit.modal.alert(`<span class="md-color-red-400 mdi mdi-alert-outline uk-margin-small-right"></span> ${msg}`, opt)
		},
		getFileType(file){
			return file.type.split('/').length > 0 ? file.type.split('/')[0] : ''
		},
		checkFileType(files, types) {
			files = [...files]
			let check = files.find((file) => {
				let fileType = this.getFileType(file)
				return types.indexOf(fileType) < 0
			})
			return !check
		},
		async fetchAndOpenForm(uid, isSeverSide) {
			await this.fetchData()
			if(isSeverSide) {
				this.resUid = uid
			}else {
				this.gridOptions.api.forEachNode((node) => {
					if(node.data.uid === uid) {
						this.openForm({
							node: node,
							data: node.data
						})
					}
				})
			}
		},
		pageScrollbarDisable () {
			css(document.documentElement, {
				'overflow': 'hidden'
			});
			css(document.body, {
				'overflow-y': 'scroll'
			});
			css(document.getElementById('sc-header'), {
				'margin-right': this.getScrollbarWidth()
			});
		},
		pageScrollbarEnable () {
			css(document.documentElement, {
				'overflow': ''
			});
			css(document.body, {
				'overflow-y': ''
			});
			css(document.getElementById('sc-header'), {
				'margin-right': ''
			});
		},
		getScrollbarWidth (recalculate) {
			let div1, div2, scrollbarWidth;
			if (recalculate == null) {
				recalculate = false;
			}
			if (document.readyState === 'loading') {
				return null;
			}
			div1 = document.createElement('div');
			div2 = document.createElement('div');
			div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
			div1.style.overflow = 'scroll';
			div2.style.overflow = 'hidden';
			document.body.appendChild(div1);
			document.body.appendChild(div2);
			scrollbarWidth = Math.abs(div1.scrollHeight - div2.scrollHeight);
			document.body.removeChild(div1);
			document.body.removeChild(div2);
			return scrollbarWidth;
		}
	}
});

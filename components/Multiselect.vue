<template>
	<select v-model="msValue" class="multiselect" multiple>
		<slot v-if="options" name="options">
			<option v-for="option in options" :key="option.value" :value="option.value">
				{{ option.text }}
			</option>
		</slot>
		<slot></slot>
	</select>
</template>

<script>
require('~/plugins/jquery');
require('~/assets/js/vendor/jquery.multi-select');

export default {
	name: 'MultiSelect',
	props: {
		settings: {
			type: Object,
			default: () => {}
		},
		options: {
			type: Array,
			default: () => []
		},
		value: {
			type: Array,
			default: () => []
		},
		apiMethods: {
			type: Array,
			default: () => []
		}
	},
	data: () => ({
		msValue: [],
		instance: null,
	}),
	watch: {
		value (newVal) {
			$(this.$el).find('option').each(function (index, item) {
				if(newVal.indexOf(item.value) !== -1) {
					$(item).attr('selected', 'selected')
				}else {
					$(item).attr('selected', null)
				}
			});
			this.$nextTick(() => {
				$(this.$el).multiSelect('refresh')
			})
			this.msValue = newVal
		},
		msValue (newValue, oldValue) {
			this.$emit('input', newValue);
		},
		options() {
			this.$nextTick(() => {
				$(this.$el).multiSelect('refresh')
			})
		}
	},
	mounted () {
		const self = this;
		const el = this.$el;
		let _settings = {
			afterSelect (values){
				var selected = [];
				$(el).find('option:selected').each(function (index, item) {
					selected.push(item.value);
				});
				self.msValue = selected;
			},
			afterDeselect (values){
				var selected = [];
				$(el).find('option:selected').each(function (index, item) {
					selected.push(item.value);
				});
				self.msValue = selected;
			}
		};
		this.$nextTick(() => {
			const settings = $.extend(_settings, this.settings);
			this.instance = $(el).multiSelect(settings)
			let selectedValues = this.value
			$(this.$el).find('option').each(function (index, item) {
				if(selectedValues.indexOf(item.value) !== -1) {
					$(item).attr('selected', 'selected')
				}
			});
			$(this.$el).multiSelect('refresh')
		})
	},
	destroyed () {
		$(this.$el).multiSelect('destroy')
	},
	methods: {
		'refresh' () {
			console.log('test!!')
			$(this.$el).multiSelect('refresh')
		},
		'select' (val) {
			$(this.$el).multiSelect('select', val)
		},
		'deselect' (val) {
			$(this.$el).multiSelect('deselect', val)
		},
		'select_all' () {
			$(this.$el).multiSelect('select_all')
		},
		'deselect_all' () {
			$(this.$el).multiSelect('deselect_all')
		}
	}
}
</script>
<style lang="scss">
	@import "../assets/scss/plugins/multiselect.scss";
</style>

import Vue from "vue"
export default Vue.extend({
    data: function () {
        return {
			boxCount: null
        }
    },
    watch: {
		boxCount(newValue, oldValue) {
            if(newValue !== this.params.data.boxCount) {
                this.params.context.componentParent.changeOrder(this.params.data, {
					boxCount: newValue
				})
            }
        }
    },
    beforeMount() {
    },
    mounted() {
		if(this.params.data) {
			this.boxCount = this.params.data.boxCount
		}

    },
	template: `
        <div>
			<div v-if="boxCount" data-uk-form-custom="target: > * > span:last-child">
				<select v-model="boxCount" style="font-size: 16px;padding: 5px;width: 60px;height: 30px;line-height: 20px;">
					<option value="1">1개</option>
					<option value="2">2개</option>
					<option value="3">3개</option>
					<option value="4">4개</option>
					<option value="5">5개</option>
				</select>
				<span class="uk-link">
					<span style="color: cornflowerblue; text-decoration: underline;cursor: pointer"></span>
				</span>
			</div>
        </div>
    `,
})





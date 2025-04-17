import Vue from "vue"
export default Vue.extend({
    data: function () {
        return {
            status: null
        }
    },
    beforeMount() {
    },
    mounted() {
		if(this.params.data) {
			this.status = this.params.data.status
		}

    },
	methods: {
		changeStatus(status) {
			this.params.context.componentParent.changeOrder(this.params.data, status)
		}
	},
	template: `
        <div>
			<div v-if="status === 'WAIT'">
				<button type="button" class="uk-button uk-button-small uk-button-primary" @click="changeStatus('accept')">수락처리</button>
				<button type="button" class="uk-button uk-button-small" @click="changeStatus('deny')">거절처리</button>
			</div>
			<div v-else-if="status === 'ACCEPT'">
				<button type="button" class="uk-button uk-button-small uk-button-secondary" @click="changeStatus('delivery')">배달처리</button>
				<button type="button" class="uk-button uk-button-small" @click="changeStatus('finish')">거절처리</button>
			</div>
			<div v-else-if="status === 'DELIVERY'">
				<button type="button" class="uk-button uk-button-small uk-button-secondary" @click="changeStatus('finish')">완료처리</button>
				<button type="button" class="uk-button uk-button-small" @click="changeStatus('finish')">거절처리</button>
			</div>
        </div>
    `,
})





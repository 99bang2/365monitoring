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
			this.params.context.componentParent.changeOrder(this.params.data, {
				status: status
			})
		}
	},
	template: `
        <div>
			<span class="uk-link">
				<span v-if="status === 'WAIT'" class="uk-label uk-label-outline">주문확인중</span>
				<span v-else-if="status === 'ACCEPT'" class="uk-label uk-label-warning">상품준비중</span>
				<span v-else-if="status === 'DENY'" class="uk-label uk-label-danger">주문거절</span>
				<span v-else-if="status === 'CANCEL'" class="uk-label uk-label-danger">주문취소</span>
				<span v-else-if="status === 'DELIVERY'" class="uk-label uk-label-warning">배달중</span>
				<span v-else-if="status === 'FINISH'" class="uk-label uk-label-success">배달완료</span>
			</span>
        </div>
    `,
})





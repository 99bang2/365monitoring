import Vue from "vue"
export default Vue.extend({
    data: function () {
        return {
			invoiceNumber: null
        }
    },
    beforeMount() {
    },
    mounted() {
		if(this.params.data.boxCount) {
			if(this.params.data.boxCount > 1) {
				this.invoiceNumber = this.params.data.invoiceNumber.substring(0, 4) + '-' + this.params.data.invoiceNumber.substring(4, 8) + '-' + this.params.data.invoiceNumber.substring(8) + '1~' + this.params.data.boxCount
			}else {
				this.invoiceNumber = this.params.data.invoiceNumber.substring(0, 4) + '-' + this.params.data.invoiceNumber.substring(4, 8) + '-' + this.params.data.invoiceNumber.substring(8) + '1'
			}
		}
    },
	methods: {
		openInvoicePrint() {
			this.params.context.componentParent.openInvoicePrint(this.params.data)
		}
	},
	template: `
        <div>
			<u style="color:cornflowerblue;cursor: pointer" @click="openInvoicePrint">인쇄</u>
        </div>
    `,
})

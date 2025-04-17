import Vue from "vue"
export default Vue.extend({
    data: function () {
        return {
			productInfo: null,
			finalPrice: 0,
			totalPrice: 0,
			deliveryTip: 0,
        }
    },
    beforeMount() {
    },
    mounted() {
		if(this.params.data) {
			this.productInfo = this.params.data.orderName
			this.finalPrice = this.params.data.finalPrice
			this.totalPrice = this.params.data.totalPrice
			this.deliveryTip = this.params.data.deliveryTip
		}
    },
	methods: {
		openProductDetail() {
			console.log('ddd')
			this.params.context.componentParent.openProductDetail(this.params.data)
		}
	},
	template: `
        <div>
			<u style="color:cornflowerblue;cursor: pointer" v-if="productInfo" @click="openProductDetail">{{ productInfo }} </u>
			<br/>
			<u style="color:cornflowerblue;cursor: pointer" v-if="productInfo" @click="openProductDetail">{{ finalPrice | formatNumber('0,0') }}원<span v-if="deliveryTip > 0">(배달팁 {{ deliveryTip | formatNumber('0,0') }}원 포함)</span></u>
        </div>
    `,
})

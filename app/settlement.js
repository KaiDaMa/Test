requirejs.config({
	"baseUrl": "/static/js/lib",
	"paths": {
		"publicTip": "/static/js/app/public-tip"
    }
});

requirejs(["jquery", "publicTip"], function($, publicTip){
	$(function() { 
		var orderId = $('#orderId').val();

		$("#wePayBtn").click(function () {
			if ( $("#wePayBtn").hasClass('weui-btn_loading') ) {
				return;
			}
			$("#wePayBtn").addClass('weui-btn_loading');
			$("#payLoading").addClass('weui-loading');

			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/crossfire/userapi/confirmOrder',
				data: {orderId: orderId}
			}).done(function (r) {
				$("#wePayBtn").removeClass('weui-btn_loading');
				$("#payLoading").removeClass('weui-loading');

				var confirmMsg = "Confirm to pay <font color='red'>" + r.totalPrice + "</font>！";
				publicTip.showConfirm(confirmMsg, function() {
					payOrder(r.totalPrice);
				});
			}).fail(function (jqXHR, textStatus) { // Not 200
				$("#wePayBtn").removeClass('weui-btn_loading');
				$("#payLoading").removeClass('weui-loading');

				publicTip.showTip(jqXHR.responseJSON);
			});
		});

		function payOrder(totalPrice) {
			publicTip.showLoadingToast(true, "Processing");
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: '/crossfire/userapi/payOrder',
				data: {
					orderId: orderId,
					totalPrice: totalPrice
				}
			}).done(function (r) {
				window.location.href = '/crossfire/user/paySuccess/' + orderId;
			}).fail(function (jqXHR, textStatus) { // Not 200
				publicTip.showLoadingToast(false);
				publicTip.showTip(jqXHR.responseJSON);
			});
		}
	});
	
})

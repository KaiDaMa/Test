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

				var confirmMsg = "Confirm to pay<font color='red'>" + r.totalPrice + "</font>！<div style='margin-top: 8px;'>remaining time：" + r.payEndTime + "</div>";
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

		$("#reminderBtn").click(function () {
			if ( $("#reminderBtn").hasClass('weui-btn_loading') ) {
				return;
			}
			$("#reminderBtn").addClass('weui-btn_loading');
			$("#reminderLoading").addClass('weui-loading');

			publicTip.showToast("已提醒");

			$("#reminderBtn").removeClass('weui-btn_loading');
			$("#reminderLoading").removeClass('weui-loading');
		});

		$("#confirmBtn").click(function () {
			if ( $("#confirmBtn").hasClass('weui-btn_loading') ) {
				return;
			}
			
			publicTip.showConfirm("请确认是否已经收到货", function() {
				$("#confirmBtn").addClass('weui-btn_loading');
				$("#confirmLoading").addClass('weui-loading');

				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/crossfire/userapi/confirmReceipt',
					data: {orderId: orderId}
				}).done(function (r) {
					window.location.reload();
				}).fail(function (jqXHR, textStatus) { // Not 200
					$("#confirmBtn").removeClass('weui-btn_loading');
					$("#confirmLoading").removeClass('weui-loading');
	
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		});

		$("#delBtn").click(function () {
			if ( $("#delBtn").hasClass('weui-btn_loading') ) {
				return;
			}
			
			publicTip.showConfirm("确认删除订单？", function() {
				$("#delBtn").addClass('weui-btn_loading');
				$("#delLoading").addClass('weui-loading');
				
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/crossfire/userapi/delOrder',
					data: {orderId: orderId}
				}).done(function (r) {
					window.location.href = '/crossfire/';
				}).fail(function (jqXHR, textStatus) { // Not 200
					$("#delBtn").removeClass('weui-btn_loading');
					$("#delLoading").removeClass('weui-loading');
	
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		});

		$("#cancelBtn").click(function () {
			if ( $("#cancelBtn").hasClass('weui-btn_loading') ) {
				return;
			}
			
			publicTip.showConfirm("确认取消订单？", function() {
				$("#cancelBtn").addClass('weui-btn_loading');
				$("#cancelLoading").addClass('weui-loading');
				
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: '/crossfire/userapi/cancelOrder',
					data: {orderId: orderId}
				}).done(function (r) {
					window.location.href = '/crossfire/';
				}).fail(function (jqXHR, textStatus) { // Not 200
					$("#cancelBtn").removeClass('weui-btn_loading');
					$("#cancelLoading").removeClass('weui-loading');
	
					publicTip.showTip(jqXHR.responseJSON);
				});
			});
		});

	});
	
})

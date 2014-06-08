// Отладочный вывод в окошке about
var Debug = {
	max_lines: 200,
	create: function() {
		if (ui_data.debugMode) {
			$("#ui_menu_bar .hint_bar_content").append("<p>Лог отладочной версии</p>");
			$("#ui_menu_bar .hint_bar_content").append("<div id='GVUI_debug' class='GVUI_debug_error_show GVUI_debug_log_show'>");
			
			$wraper = $("<div>").insertAfter($("#ui_menu_bar .hint_bar_content"));
			$wraper.append($("<input type='checkbox' id='GVUI_debug_log'  checked='checked' class='GVUI_log_chkboxes'>Лог</input>"));
			$wraper.append($("<input type='checkbox' id='GVUI_debug_error'  checked='checked' class='GVUI_log_chkboxes'>Ошибки</input>"));
			$(".GVUI_log_chkboxes").change(this._changeVisibility);
		}
	},
	_changeVisibility: function(){
			if ($(this).is(":checked")) {
				$("#GVUI_debug").addClass($(this).attr("id") + "_show");		
			} else {
				$("#GVUI_debug").removeClass($(this).attr("id") + "_show");		
			}
	},
	log: function() {
		Debug._write("log", arguments);
		console.log.apply(console, arguments);
	},
	error: function() {
		Debug._write("error", arguments);
		console.error.apply(console, arguments);		
	},
	_write: function(mode, args) {
		if ($(".GVUI_debug_line_content").length == this.max_lines) {
			$(".GVUI_debug_line_content")[0].remove();
		}
		var s = "";
		for (var i = 0; i < args.length; i++) {
			s += args[i] + " ";
		}
		if (s.length > 0) {
			s = s.slice(0,-1);
			if (ui_data.debugMode) {
				$log = $("#GVUI_debug");
				if ($log) {
					var $last = $("#GVUI_debug .GVUI_debug_line_content:last");
					console.log(s, $last[0]);
					if (!$last || !$last.hasClass("GVUI_debug_" + mode + "_line") && s != $last.text()) {
						$log.append("<span class=GVUI_debug_" + mode + "_line>" +
								"<span class='GVUI_debug_number_of'></span>"
								+ "<span class=GVUI_debug_line_content>" 
								+ s + "</span>" + "<br></span>");
					} else {
						$("#GVUI_debug .GVUI_debug_number_of:last").text(((parseInt($("#GVUI_debug .GVUI_debug_number_of:last").text()) || 0) + 1) + " ");
					}
				}
			}
		}
	}
	
	
};
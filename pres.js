(function(){

	var $counter, $count, $max, $stage, $entry,
		$rageface = $("<span class='rageface'>y u so many<br>keystrokes!?<br><img src='rageface.jpg'></span>"),
		stage_width, stage_height,
		charmax = 0, charcount = 0,
		inserts = [
			"wtf is this?",
			"#PrivilegeAwareness",
			"white",
			"male",
			"educated",
			"heterosexual",
			"american",
			"employed",
			"#PrivilegeAwareness",
			"Kyle Simpson<br>@getify<br>http://getify.me",
			"<img src='ydkjs.png'><br>YouDontKnowJS.com",
			"<img src='makersquare.png'>",
			"The Economy of<br>Keystrokes",
			"All the world's a stage, and all the men and women merely players: they have their exits and their entrances;",
			"<img src='regfunc.png'>",
			"<img src='arrow.png'>",
			"<img src='arrow2.png'>",
			"∞",
			"<img src='torvalds.png'>",
			"The code could *easily* have been done with just a single and understandable conditional, and the compiler would actually have generated better code, and the code would look better and more understandable.",
			"I want to make it clear to *everybody* that code like this is completely unacceptable.",
			"Any fool can write code that a computer can understand.<br><br>Good programmers write code that humans can understand.<br><br>--Martin Fowler",
			"The Economy of<br>Keystrokes",
			"Kyle Simpson<br>@getify<br>http://getify.me"
		];


	$(document).ready(init);


	// ****************************

	function init() {
		$counter = $("[rel=js-counter]");
		$count = $counter.children("[rel=js-count]");
		$max = $counter.children("[rel=js-max]");
		$stage = $("[rel=js-stage]");
		$entry = $("[rel=js-entry]");

		stage_width = $stage.width();
		stage_height = $stage.height();

		$stage.css({ "max-width": stage_width + "px" });
		$entry.css({ "max-width": stage_width + "px" });

		$stage.on("keypress",onKeypress);
		$stage.on("keydown",onKeydown);
		$max.on("keydown keyup keypress",onChangeMax);
		$max.on("focus",onFocusSelect);
		$entry.on("focus",onFocusSelect);

		updateCounter(/*rage=*/true);

		$entry[0].focus();
	}

	function onKeypress(evt) {
		charcount++;
		updateCounter(/*rage=*/true);
	}

	function onKeydown(evt) {
		if (evt.keyCode == 13 && evt.metaKey) {
			minimizeEntry();
		}
		else if (evt.keyCode == 8 || evt.keyCode == 46) {
			charcount++;
			updateCounter(/*rage=*/true);
		}
		else if (evt.keyCode == 85 && evt.metaKey) {
			insertContent();
		}
		else if (evt.keyCode == 69 && evt.metaKey) {
			stripEntry();
		}
		else if (evt.keyCode == 27) {
			$entry.text("");
		}
	}

	function onChangeMax(evt) {
		if (evt.keyCode == 13 && evt.metaKey) {
			$entry[0].focus();
			updateCounter(/*rage=*/true);
		}
		else {
			updateCounter();
		}
	}

	function updateCounter(rage) {
		charmax = Number($max.text());
		$count.text(charcount);
		if (charcount > charmax) {
			$count.removeClass("warning").addClass("over");
			if (rage) {
				var $el = $rageface.clone();
				$el.css({ transform: "translateX(50%)" });
				addAndMinimizeElement($el,1500);
			}
		}
		else if (charcount >= (charmax - 25)) {
			$count.removeClass("over").addClass("warning");
		}
		else {
			$count.removeClass("warning over");
		}
	}

	function onFocusSelect(evt) {
		var range = document.createRange();
		range.selectNodeContents(evt.target);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}

	function addAndMinimizeElement($el,delay) {
		delay = delay || 0;
		$el[0].id = "x" + Math.random();

		var $parent = $("<div></div>").addClass("dupe_parent");
		$el.appendTo($parent);

		var $parent_parent = $("<div></div>").addClass("dupe_parent_parent");
		$parent.appendTo($parent_parent);

		$parent_parent.appendTo($stage);

		setTimeout(function(){
			var new_x = Math.round(((Math.random() * 1E5) % (stage_width * 0.7)) + (stage_width * 0.1));
			var new_y = Math.round(((Math.random() * 1E5) % (stage_height * 0.7)) + (stage_height * 0.1));
			$parent_parent.css({
				"transform": "translate(" + new_x + "px, " + new_y + "px)"
			});
			$parent_parent.addClass("minimized_parent");
			$parent.addClass("minimized");
		},delay);
	}

	function minimizeEntry() {
		$dupe = $entry.clone();
		$dupe.removeAttr("id");
		$dupe.removeAttr("contenteditable");

		addAndMinimizeElement($dupe);

		$entry.text("");
		$entry[0].blur();
		setTimeout(function(){
			$entry[0].focus();
		},300);
	}

	function insertContent() {
		if (inserts.length > 0) {
			var content = inserts.shift();
			$entry.html(content);
			if (/^\</.test(content)) {
				charcount++;
			}
			else {
				charcount += content.length;
			}
			updateCounter(/*rage=*/true);
		}
	}

	function stripEntry() {
		var content = $entry.text();
		content = content.replace(/[A-Z]/g,function(match){
			return match.toLowerCase();
		});
		content = content.replace(/to/g,"2");
		content = content.replace(/for/g,"4");
		content = content.replace(/(?:^|(.))(?!\b)[aeiouy]+(?!\b)/g,"$1");
		content = content.replace(/[^a-z0-9\s]/g,function(match){
			if (/^[.;:]$/.test(match)) {
				return "<br>";
			}
			else return "";
		});
		$entry.html(content);
	}

})();

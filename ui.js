let symbols = [];
let rules = {};
let angle = 20;
let length = 4;

let selRule;
let axiom = "F";
let $editRule;

$(document).ready(function(){
	$infoDropdown = $("#infoDropdown");
	$editRule = $("#editRule");

	$editRule.hide();
	$infoDropdown.hide();

	// info dropdown event listener
	$infoBtn = $("#infoBtn"),

	$infoBtn.on('click', function() {
		if ($infoDropdown.is(":visible")) {
			$infoBtn.html("+ Info");
			$infoDropdown.hide();
		} else {
			$infoDropdown.show();
			$infoBtn.html("- Info");
		}
	});
	
	// initialize listeners
	updateSliders();
	symbolSubmit();
	ruleSubmit();
	axiomSubmit();
	view();
	updateF();
});

function deleteSymbol(symbol) {
	// remove symbol and corresponding rule
	deleteRule(symbol);
	let i = symbols.indexOf(symbol);
	symbols.splice(i, 1);
	$(`#symbol${symbol}`).remove();
}

function addSymbol(symbol) {
	// add new symbol
	symbols.push(symbol);
	$('#symbolTable tbody').append(`<tr id="symbol${symbol}">
		<td>${symbol}</td>
		<td><button onclick="deleteSymbol('${symbol}')">Delete</button></td>
	</tr>`);
}

function editRule(symbol) {
	// open edit menu
	selRule = symbol;
	$editRule.show();
	$("#ruleBox").val(rules[symbol]);
	$("#ruleName").html(symbol);
}

function addRule(symbol) {
	// add a rule to table
	rules[symbol] = "";
	$('#ruleTable tbody').append(`<tr id="rule${symbol}">
		<td>${symbol}</td>
		<td id="replacement${symbol}">${symbol}</td>
		<td><button onclick="editRule('${symbol}')">Edit Replacement</button></td>
	</tr>`);
}

function deleteRule(symbol) {
	// delete rule
	delete rules[symbol];
	$(`#rule${symbol}`).remove();
}

function updateRule(symbol, rule) {
	// update rule
	rules[symbol] = rule;
	$(`#replacement${symbol}`).html(rule);
}

function isLetter(c) {
	// check if something is a letter
	return c.toLowerCase() != c.toUpperCase();
}

function isRule(r) {
	// check for extraneous characters in a rule or axiom
	return /[a-zA-Z+-\[\]]+$/.test(r);
}

function symbolsExist(r) {
	// check if all symbols in a rule or axiom exist
	let e = true;
	for (let i = 0; i < r.length; i ++) {
		let c = r[i];
		if (isLetter(c) && !(symbols.includes(c) || c == "F")) {
			e = false;
		}
	}
	return e;
}

function symbolSubmit() {
	// submit event listener
	$statusText1 = $("#statusText"),
	$symbolBox = $("#symbolBox");

	$("#symbolNew").on('click', function() {
		let s = $symbolBox.val()
		if (isLetter(s) && !symbols.includes(s)) {
			$statusText1.html("");
			$symbolBox.val("");

			// add symbol itself
			addSymbol(s);
			addRule(s);
		} else if (!isLetter(s)) {
			$statusText1.html("You can only use letters.");
		} else {
			$statusText1.html("This symbol already exists.");
		}
	});
}

function updateF() {
	// F checkbox update 
	$("#fRule").change(function() {
		if ($(this).is(":checked")) {
			addRule("F");
		} else {
			deleteRule("F");
		}
	})
}

function updateSliders() {
	// slider event listeners
	$("#theta").change(function() {
		angle = parseInt($(this).val());
		$("#thetaLabel").html(angle);
	});

	$("#len").change(function() {
		length = parseInt($(this).val());
		$("#lenLabel").html(length);
	});
}

function ruleSubmit() {
	$ruleBox = $("#ruleBox"),
	$statusText = $("#editStatus");

	// rule submit event listener
	$("#submitRule").on('click', function() {
		let r = $ruleBox.val()
		if (isRule(r) && symbolsExist(r)) {
			$statusText.html("");
			$ruleBox.val("");
			$editRule.hide();
			updateRule(selRule, r);
		} else if (!isRule(r)) {
			$statusText.html("You can only use letters and control characters.");
		} else {
			$statusText.html("Unknown symbol.");
		}
	});
}

function axiomSubmit() {
	$axiomBox = $("#axiomBox"),
	$statusText2 = $("#axiomStatus");

	// axiom submit event listener
	$("#submitAxiom").on('click', function() {
		let a = $axiomBox.val()
		if (isRule(a) && symbolsExist(a)) {
			$statusText2.html("");
			$axiomBox.val("");
			axiom = a;
			$("#axiomSpan").html(a);
		} else if (!isRule(a)) {
			$statusText2.html("You can only use letters and control characters.");
		} else {
			$statusText2.html("Unknown symbol.");
		}
	});
}

function view() {
	// take user to L-system viewer
	$("#view").on('click', function() {
		let jsonState = {
			angle: angle,
			len: length,
			axiom: axiom,
			rules: rules
		};
		let strJson = btoa(JSON.stringify(jsonState));
		window.open("index.html#"+strJson, target="_blank");
	})
}
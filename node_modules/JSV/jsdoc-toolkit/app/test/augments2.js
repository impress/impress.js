/**
@constructor
*/
function LibraryItem() {
	this.reserve = function() {
	}
}

/**
@constructor
*/
function Junkmail() {
	this.annoy = function() {
	}
}

/**
@inherits Junkmail.prototype.annoy as pester
@augments ThreeColumnPage
@augments LibraryItem
@constructor
*/
function NewsletterPage() {
	this.getHeadline = function() {
	}
}

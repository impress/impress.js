( function ( global ) {
	var APP,
		hasOwn = Object.prototype.hasOwnProperty;

	// Empty function declaration
	function upHere() {}

	// Non-empty function declaration
	function upHereAlso( y ) {
		return y;
	}

	/**
	 * Example description.
	 *
	 * @class
	 *
	 * @constructor
	 * @param {string} id
	 * @param {Object} options
	 */
	APP.Example = function ( id, options ) {
		var name, inline, bar;

		this.total = upHere() + id;

		name = options.bar ? upHereAlso( id ) : id;

		if ( options.quux ) {
			name += options.quux;
		} else if ( options.quux ) {
			name += options.quux;
		} else {
			name += 'default';
		}

		if ( bar &&
			bar.hasData() &&
			bar.getName() !== name &&
			!bar.isQuux()
		) {
			return;
		}

		// One line function
		inline = function ( items ) { return items.slice(); };

		// Multi-line function
		inline = function ( items ) {
			items = items.slice();
			items.pop();
			return items;
		};

		inline = function named( items ) {
			try {
				return APP.loop( items );
			} catch ( e ) {
			}
			return null;
		};

		this.data = [
			typeof bar,
			inline()
		];
	};

	APP.loop = function ( items ) {
		// requireMultipleVarDecl
		var i, len, item, key,
			j = 1,
			ret = {};

		for ( i = 0, len = items.length; i < len; i++ ) {
			if ( items[ i ] !== null ) {
				item = items[ i ];
				break;
			}
		}

		if ( !item ) {
			return;
		}

		for ( key in item ) {
			// requireSpaceBetweenArguments
			if ( hasOwn.call( item, key ) ) {
				ret[ key ] = new APP.Example( item[ key ] );
			}
		}

		do {
			j = i++;
			APP.fall( --j );
		} while ( i < 5 );

		return ret;
	};

	/**
	 * @param {boolean|number} code
	 */
	APP.fall = function ( code ) {
		switch ( code ) {
			case 200:
				break;
			default:
				return null;
		}
	};

	APP.cast = function ( options, val ) {
		options.enable = !!val;
		options.disable = Boolean( val );

		options.posX = +val;
		options.posY = Number( val );

		options.title = String( val );

		return options.title.indexOf( '.' ) !== -1;
	};

	APP.example = new APP.Example( 'banana', {
		first: 'Who',
		second: 'What',
		third: 'I don\'t know',
		'default': 'Legacy'
	} );

	APP.example( 'banana' )
		.done( function () { } );

	APP.example( 'banana' )
		.done( function () {} )
		.fail( function () {} );

	APP.$head
		.appendTo( APP.$element );

	global.APP = APP;

}( this ) );

/*  Verhoeff algorithm for check digit	http://en.wikipedia.org/wiki/Verhoeff_algorithm

	usage:  
		x = new verhoeff();
		y = x.compute("524243");
		aa.print(x.check(y));
*/

function verhoeff() {
	var F = new Array();
	F[ 0 ] = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 );
	F[ 1 ] = new Array( 1, 5, 7, 6, 2, 8, 3, 0, 9, 4 );

	for ( var i = 2; i < 8; i++ ) {
	    F[ i ] = new Array();
	    for ( var j = 0; j < 10; j++ )
	        F[ i ][ j ] = F[ i - 1 ][ F[ 1 ][ j ]];
	}

	Op = new Array();
	Op[0] = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 );
	Op[1] = new Array( 1, 2, 3, 4, 0, 6, 7, 8, 9, 5 );
	Op[2] = new Array( 2, 3, 4, 0, 1, 7, 8, 9, 5, 6 );
	Op[3] = new Array( 3, 4, 0, 1, 2, 8, 9, 5, 6, 7 );
	Op[4] = new Array( 4, 0, 1, 2, 3, 9, 5, 6, 7, 8 );
	Op[5] = new Array( 5, 9, 8, 7, 6, 0, 4, 3, 2, 1 );
	Op[6] = new Array( 6, 5, 9, 8, 7, 1, 0, 4, 3, 2 );
	Op[7] = new Array( 7, 6, 5, 9, 8, 2, 1, 0, 4, 3 );
	Op[8] = new Array( 8, 7, 6, 5, 9, 3, 2, 1, 0, 4 );
	Op[9] = new Array( 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 );

	Inv = new Array( 0, 4, 3, 2, 1, 5, 6, 7, 8, 9 );
	
	reverse_str =  function( str )	{
	    var rev = "";
	    for ( var i = str.length - 1; i >= 0; i-- )
	        rev = rev + str.charAt( i );
	    return rev;
	}

	this.check =  function ( num )	{
	    var a = reverse_str( num );
	    var check = 0;
	    for ( var i=0; i < a.length; i++ )
	        check = Op[ check ][ F[ i % 8 ][ a.charAt( i )]];
	    if ( check != 0 )
	        return false;
	    else
	        return true;
	}

	this.compute = function(num) {
	    var a = "x" + reverse_str( num );
	    var check = 0;
	    for ( var i = 1; i < a.length; i++ )
	        check = Op[ check ][ F[ i % 8 ][ a.charAt( i )]];
	    return num + Inv[ check ];
	}
}
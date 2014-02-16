// https://gist.github.com/stamat/5841593

//Returns the object's class, Array, Date, RegExp, Object are of interest to us
var getClass = function(val) {
	return Object.prototype.toString.call(val)
		.match(/^\[object\s(.*)\]$/)[1];
};

//Defines the type of the value, extended typeof
var whatis = function(val) {

	if (val === undefined)
		return 'undefined';
	if (val === null)
		return 'null';

	var type = typeof val;

	if (type === 'object')
		type = getClass(val).toLowerCase();

	if (type === 'number') {
		if (val.toString().indexOf('.') > 0)
			return 'float';
		else
			return 'integer';
	}

	return type;
};

var compareObjects = function(a, b) {
	if (a === b)
		return true;
	for (var i in a) {
		if (b.hasOwnProperty(i)) {
			if (!equal(a[i],b[i])) return false;
		} else {
			return false;
		}
	}

	for (var i in b) {
		if (!a.hasOwnProperty(i)) {
			return false;
		}
	}
	return true;
};

var compareArrays = function(a, b) {
	if (a === b)
		return true;
	if (a.length !== b.length)
		return false;
	for (var i = 0; i < a.length; i++){
		if(!equal(a[i], b[i])) return false;
	};
	return true;
};

var _equal = {};
_equal.array = compareArrays;
_equal.object = compareObjects;
_equal.date = function(a, b) {
	return a.getTime() === b.getTime();
};
_equal.regexp = function(a, b) {
	return a.toString() === b.toString();
};
//	uncoment to support function as string compare
//	_equal.fucntion =  _equal.regexp;



/*
 * Are two values equal, deep compare for objects and arrays.
 * @param a {any}
 * @param b {any}
 * @return {boolean} Are equal?
 */
var equal = function(a, b) {
	if (a !== b) {
		var atype = whatis(a), btype = whatis(b);

		if (atype === btype)
			return _equal.hasOwnProperty(atype) ? _equal[atype](a, b) : a==b;

		return false;
	}

	return true;
};



//----- USAGE -----//
//Someone on stack overflow had nice tests, thanks! :)
/*


function assertFalse(bool) {
	console.error(!bool);
}

function assertTrue(bool) {
	console.error(bool);
}

    assertFalse(equal({}, null));
    assertFalse(equal({}, undefined));

    assertTrue(equal('hi','hi'));
    assertTrue(equal(5,5));
    assertFalse(equal(5,10));
    assertFalse(equal(1,'1'));

    assertTrue(equal([],[]));
    assertTrue(equal([1,2],[1,2]));
    assertFalse(equal([1,2],[2,1]));
    assertFalse(equal([1,2],[1,2,3]));

    assertTrue(equal(new Date("2011-03-31"), new Date("2011-03-31")));
    assertFalse(equal(new Date("2011-03-31"), new Date("1970-01-01")));

    assertTrue(equal({},{}));
    assertTrue(equal({a:1,b:2},{a:1,b:2}));
    assertTrue(equal({a:1,b:2},{b:2,a:1}));
    assertFalse(equal({a:1,b:2},{a:1,b:3}));

    assertTrue(equal({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}));
    assertFalse(equal({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));

    assertFalse(equal(function(x){return x;},function(x){return x;}));
    assertFalse(equal(function(x){return x;},function(y){return y+2;}));

    var a = {a: 'text', b:[0,1]};
    var b = {a: 'text', b:[0,1]};
    var c = {a: 'text', b: 0};
    var d = {a: 'text', b: false};
    var e = {a: 'text', b:[1,0]};
    var f = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
    var g = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
    var h = {a: 'text', b:[1,0], f: function(){ this.a = this.b; }};
    var i = {
        a: 'text',
        c: {
            b: [1, 0],
            f: function(){
                this.a = this.b;
            }
        }
    };
    var j = {
        a: 'text',
        c: {
            b: [1, 0],
            f: function(){
                this.a = this.b;
            }
        }
    };
    var k = {a: 'text', b: null};
    var l = {a: 'text', b: undefined};

    assertTrue(equal(a,b));
    assertFalse(equal(a,c));
    assertFalse(equal(c,d));
    assertFalse(equal(a,e));
    assertFalse(equal(f,g));
    assertFalse(equal(h,g));
    assertFalse(equal(i,j));
    assertFalse(equal(d,k));
    assertFalse(equal(k,l));
	
*/
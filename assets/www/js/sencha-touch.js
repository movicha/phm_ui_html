/*
This file represents the sencha touch library. Methods of the framework are defined here.

This file is part of Sencha Touch 2.1

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-02-05 12:25:50 (3ba7c63bea96e5ea776e2bbd67cfb0aa01e43322)
 */
(function() {
	var global = this, objectPrototype = Object.prototype, toString = objectPrototype.toString, enumerables = true, enumerablesTest = {
		toString : 1
	}, emptyFn = function() {
	}, i;
	if (typeof Ext === "undefined") {
		global.Ext = {}
	}
	Ext.global = global;
	for (i in enumerablesTest) {
		enumerables = null
	}
	if (enumerables) {
		enumerables = [ "hasOwnProperty", "valueOf", "isPrototypeOf",
				"propertyIsEnumerable", "toLocaleString", "toString",
				"constructor" ]
	}
	Ext.enumerables = enumerables;
	Ext.apply = function(object, config, defaults) {
		if (defaults) {
			Ext.apply(object, defaults)
		}
		if (object && config && typeof config === "object") {
			var i, j, k;
			for (i in config) {
				object[i] = config[i]
			}
			if (enumerables) {
				for (j = enumerables.length; j--;) {
					k = enumerables[j];
					if (config.hasOwnProperty(k)) {
						object[k] = config[k]
					}
				}
			}
		}
		return object
	};
	Ext.buildSettings = Ext.apply({
		baseCSSPrefix : "x-",
		scopeResetCSS : false
	}, Ext.buildSettings || {});
	Ext.apply(Ext, {
		emptyFn : emptyFn,
		baseCSSPrefix : Ext.buildSettings.baseCSSPrefix,
		applyIf : function(object, config) {
			var property;
			if (object) {
				for (property in config) {
					if (object[property] === undefined) {
						object[property] = config[property]
					}
				}
			}
			return object
		},
		iterate : function(object, fn, scope) {
			if (Ext.isEmpty(object)) {
				return
			}
			if (scope === undefined) {
				scope = object
			}
			if (Ext.isIterable(object)) {
				Ext.Array.each.call(Ext.Array, object, fn, scope)
			} else {
				Ext.Object.each.call(Ext.Object, object, fn, scope)
			}
		}
	});
	Ext
			.apply(
					Ext,
					{
						extend : function() {
							var objectConstructor = objectPrototype.constructor, inlineOverrides = function(
									o) {
								for ( var m in o) {
									if (!o.hasOwnProperty(m)) {
										continue
									}
									this[m] = o[m]
								}
							};
							return function(subclass, superclass, overrides) {
								if (Ext.isObject(superclass)) {
									overrides = superclass;
									superclass = subclass;
									subclass = overrides.constructor !== objectConstructor ? overrides.constructor
											: function() {
												superclass.apply(this,
														arguments)
											}
								}
								if (!superclass) {
									Ext.Error
											.raise({
												sourceClass : "Ext",
												sourceMethod : "extend",
												msg : "Attempting to extend from a class which has not been loaded on the page."
											})
								}
								var F = function() {
								}, subclassProto, superclassProto = superclass.prototype;
								F.prototype = superclassProto;
								subclassProto = subclass.prototype = new F();
								subclassProto.constructor = subclass;
								subclass.superclass = superclassProto;
								if (superclassProto.constructor === objectConstructor) {
									superclassProto.constructor = superclass
								}
								subclass.override = function(overrides) {
									Ext.override(subclass, overrides)
								};
								subclassProto.override = inlineOverrides;
								subclassProto.proto = subclassProto;
								subclass.override(overrides);
								subclass.extend = function(o) {
									return Ext.extend(subclass, o)
								};
								return subclass
							}
						}(),
						override : function(cls, overrides) {
							if (cls.$isClass) {
								return cls.override(overrides)
							} else {
								Ext.apply(cls.prototype, overrides)
							}
						}
					});
	Ext
			.apply(
					Ext,
					{
						valueFrom : function(value, defaultValue, allowBlank) {
							return Ext.isEmpty(value, allowBlank) ? defaultValue
									: value
						},
						typeOf : function(value) {
							if (value === null) {
								return "null"
							}
							var type = typeof value;
							if (type === "undefined" || type === "string"
									|| type === "number" || type === "boolean") {
								return type
							}
							var typeToString = toString.call(value);
							switch (typeToString) {
							case "[object Array]":
								return "array";
							case "[object Date]":
								return "date";
							case "[object Boolean]":
								return "boolean";
							case "[object Number]":
								return "number";
							case "[object RegExp]":
								return "regexp"
							}
							if (type === "function") {
								return "function"
							}
							if (type === "object") {
								if (value.nodeType !== undefined) {
									if (value.nodeType === 3) {
										return (/\S/).test(value.nodeValue) ? "textnode"
												: "whitespace"
									} else {
										return "element"
									}
								}
								return "object"
							}
							Ext.Error
									.raise({
										sourceClass : "Ext",
										sourceMethod : "typeOf",
										msg : 'Failed to determine the type of the specified value "'
												+ value
												+ '". This is most likely a bug.'
									})
						},
						isEmpty : function(value, allowEmptyString) {
							return (value === null)
									|| (value === undefined)
									|| (!allowEmptyString ? value === ""
											: false)
									|| (Ext.isArray(value) && value.length === 0)
						},
						isArray : ("isArray" in Array) ? Array.isArray
								: function(value) {
									return toString.call(value) === "[object Array]"
								},
						isDate : function(value) {
							return toString.call(value) === "[object Date]"
						},
						isMSDate : function(value) {
							if (!Ext.isString(value)) {
								return false
							} else {
								return value
										.match("\\\\?/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\\\?/") !== null
							}
						},
						isObject : (toString.call(null) === "[object Object]") ? function(
								value) {
							return value !== null
									&& value !== undefined
									&& toString.call(value) === "[object Object]"
									&& value.ownerDocument === undefined
						}
								: function(value) {
									return toString.call(value) === "[object Object]"
								},
						isSimpleObject : function(value) {
							return value instanceof Object
									&& value.constructor === Object
						},
						isPrimitive : function(value) {
							var type = typeof value;
							return type === "string" || type === "number"
									|| type === "boolean"
						},
						isFunction : (typeof document !== "undefined" && typeof document
								.getElementsByTagName("body") === "function") ? function(
								value) {
							return toString.call(value) === "[object Function]"
						}
								: function(value) {
									return typeof value === "function"
								},
						isNumber : function(value) {
							return typeof value === "number" && isFinite(value)
						},
						isNumeric : function(value) {
							return !isNaN(parseFloat(value)) && isFinite(value)
						},
						isString : function(value) {
							return typeof value === "string"
						},
						isBoolean : function(value) {
							return typeof value === "boolean"
						},
						isElement : function(value) {
							return value ? value.nodeType === 1 : false
						},
						isTextNode : function(value) {
							return value ? value.nodeName === "#text" : false
						},
						isDefined : function(value) {
							return typeof value !== "undefined"
						},
						isIterable : function(value) {
							return (value && typeof value !== "string") ? value.length !== undefined
									: false
						}
					});
	Ext.apply(Ext, {
		clone : function(item) {
			if (item === null || item === undefined) {
				return item
			}
			if (item.nodeType && item.cloneNode) {
				return item.cloneNode(true)
			}
			var type = toString.call(item);
			if (type === "[object Date]") {
				return new Date(item.getTime())
			}
			var i, j, k, clone, key;
			if (type === "[object Array]") {
				i = item.length;
				clone = [];
				while (i--) {
					clone[i] = Ext.clone(item[i])
				}
			} else {
				if (type === "[object Object]" && item.constructor === Object) {
					clone = {};
					for (key in item) {
						clone[key] = Ext.clone(item[key])
					}
					if (enumerables) {
						for (j = enumerables.length; j--;) {
							k = enumerables[j];
							clone[k] = item[k]
						}
					}
				}
			}
			return clone || item
		},
		getUniqueGlobalNamespace : function() {
			var uniqueGlobalNamespace = this.uniqueGlobalNamespace;
			if (uniqueGlobalNamespace === undefined) {
				var i = 0;
				do {
					uniqueGlobalNamespace = "ExtBox" + (++i)
				} while (Ext.global[uniqueGlobalNamespace] !== undefined);
				Ext.global[uniqueGlobalNamespace] = Ext;
				this.uniqueGlobalNamespace = uniqueGlobalNamespace
			}
			return uniqueGlobalNamespace
		},
		functionFactory : function() {
			var args = Array.prototype.slice.call(arguments), ln = args.length;
			if (ln > 0) {
				args[ln - 1] = "var Ext=window."
						+ this.getUniqueGlobalNamespace() + ";" + args[ln - 1]
			}
			return Function.prototype.constructor.apply(Function.prototype,
					args)
		},
		globalEval : ("execScript" in global) ? function(code) {
			global.execScript(code)
		} : function(code) {
			(function() {
				eval(code)
			})()
		},
		Logger : {
			log : function(message, priority) {
				if ("console" in global) {
					if (!priority || !(priority in global.console)) {
						priority = "log"
					}
					message = "[" + priority.toUpperCase() + "] " + message;
					global.console[priority](message)
				}
			},
			verbose : function(message) {
				this.log(message, "verbose")
			},
			info : function(message) {
				this.log(message, "info")
			},
			warn : function(message) {
				this.log(message, "warn")
			},
			error : function(message) {
				throw new Error(message)
			},
			deprecate : function(message) {
				this.log(message, "warn")
			}
		}
	});
	Ext.type = Ext.typeOf
})();
(function() {
	var a = "4.1.0", b;
	Ext.Version = b = Ext.extend(Object, {
		constructor : function(d) {
			var c = this.toNumber, f, e;
			if (d instanceof b) {
				return d
			}
			this.version = this.shortVersion = String(d).toLowerCase().replace(
					/_/g, ".").replace(/[\-+]/g, "");
			e = this.version.search(/([^\d\.])/);
			if (e !== -1) {
				this.release = this.version.substr(e, d.length);
				this.shortVersion = this.version.substr(0, e)
			}
			this.shortVersion = this.shortVersion.replace(/[^\d]/g, "");
			f = this.version.split(".");
			this.major = c(f.shift());
			this.minor = c(f.shift());
			this.patch = c(f.shift());
			this.build = c(f.shift());
			return this
		},
		toNumber : function(c) {
			c = parseInt(c || 0, 10);
			if (isNaN(c)) {
				c = 0
			}
			return c
		},
		toString : function() {
			return this.version
		},
		valueOf : function() {
			return this.version
		},
		getMajor : function() {
			return this.major || 0
		},
		getMinor : function() {
			return this.minor || 0
		},
		getPatch : function() {
			return this.patch || 0
		},
		getBuild : function() {
			return this.build || 0
		},
		getRelease : function() {
			return this.release || ""
		},
		isGreaterThan : function(c) {
			return b.compare(this.version, c) === 1
		},
		isGreaterThanOrEqual : function(c) {
			return b.compare(this.version, c) >= 0
		},
		isLessThan : function(c) {
			return b.compare(this.version, c) === -1
		},
		isLessThanOrEqual : function(c) {
			return b.compare(this.version, c) <= 0
		},
		equals : function(c) {
			return b.compare(this.version, c) === 0
		},
		match : function(c) {
			c = String(c);
			return this.version.substr(0, c.length) === c
		},
		toArray : function() {
			return [ this.getMajor(), this.getMinor(), this.getPatch(),
					this.getBuild(), this.getRelease() ]
		},
		getShortVersion : function() {
			return this.shortVersion
		},
		gt : function() {
			return this.isGreaterThan.apply(this, arguments)
		},
		lt : function() {
			return this.isLessThan.apply(this, arguments)
		},
		gtEq : function() {
			return this.isGreaterThanOrEqual.apply(this, arguments)
		},
		ltEq : function() {
			return this.isLessThanOrEqual.apply(this, arguments)
		}
	});
	Ext.apply(b, {
		releaseValueMap : {
			dev : -6,
			alpha : -5,
			a : -5,
			beta : -4,
			b : -4,
			rc : -3,
			"#" : -2,
			p : -1,
			pl : -1
		},
		getComponentValue : function(c) {
			return !c ? 0 : (isNaN(c) ? this.releaseValueMap[c] || c
					: parseInt(c, 10))
		},
		compare : function(g, f) {
			var d, e, c;
			g = new b(g).toArray();
			f = new b(f).toArray();
			for (c = 0; c < Math.max(g.length, f.length); c++) {
				d = this.getComponentValue(g[c]);
				e = this.getComponentValue(f[c]);
				if (d < e) {
					return -1
				} else {
					if (d > e) {
						return 1
					}
				}
			}
			return 0
		}
	});
	Ext.apply(Ext, {
		versions : {},
		lastRegisteredVersion : null,
		setVersion : function(d, c) {
			Ext.versions[d] = new b(c);
			Ext.lastRegisteredVersion = Ext.versions[d];
			return this
		},
		getVersion : function(c) {
			if (c === undefined) {
				return Ext.lastRegisteredVersion
			}
			return Ext.versions[c]
		},
		deprecate : function(c, e, f, d) {
			if (b.compare(Ext.getVersion(c), e) < 1) {
				f.call(d)
			}
		}
	});
	Ext.setVersion("core", a)
})();
Ext.String = {
	trimRegex : /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
	escapeRe : /('|\\)/g,
	formatRe : /\{(\d+)\}/g,
	escapeRegexRe : /([-.*+?^${}()|[\]\/\\])/g,
	htmlEncode : (function() {
		var d = {
			"&" : "&amp;",
			">" : "&gt;",
			"<" : "&lt;",
			'"' : "&quot;"
		}, b = [], c, a;
		for (c in d) {
			b.push(c)
		}
		a = new RegExp("(" + b.join("|") + ")", "g");
		return function(e) {
			return (!e) ? e : String(e).replace(a, function(g, f) {
				return d[f]
			})
		}
	})(),
	htmlDecode : (function() {
		var d = {
			"&amp;" : "&",
			"&gt;" : ">",
			"&lt;" : "<",
			"&quot;" : '"'
		}, b = [], c, a;
		for (c in d) {
			b.push(c)
		}
		a = new RegExp("(" + b.join("|") + "|&#[0-9]{1,5};)", "g");
		return function(e) {
			return (!e) ? e : String(e).replace(a, function(g, f) {
				if (f in d) {
					return d[f]
				} else {
					return String.fromCharCode(parseInt(f.substr(2), 10))
				}
			})
		}
	})(),
	urlAppend : function(b, a) {
		if (!Ext.isEmpty(a)) {
			return b + (b.indexOf("?") === -1 ? "?" : "&") + a
		}
		return b
	},
	trim : function(a) {
		return a.replace(Ext.String.trimRegex, "")
	},
	capitalize : function(a) {
		return a.charAt(0).toUpperCase() + a.substr(1)
	},
	ellipsis : function(c, a, d) {
		if (c && c.length > a) {
			if (d) {
				var e = c.substr(0, a - 2), b = Math.max(e.lastIndexOf(" "), e
						.lastIndexOf("."), e.lastIndexOf("!"), e
						.lastIndexOf("?"));
				if (b !== -1 && b >= (a - 15)) {
					return e.substr(0, b) + "..."
				}
			}
			return c.substr(0, a - 3) + "..."
		}
		return c
	},
	escapeRegex : function(a) {
		return a.replace(Ext.String.escapeRegexRe, "\\$1")
	},
	escape : function(a) {
		return a.replace(Ext.String.escapeRe, "\\$1")
	},
	toggle : function(b, c, a) {
		return b === c ? a : c
	},
	leftPad : function(b, c, d) {
		var a = String(b);
		d = d || " ";
		while (a.length < c) {
			a = d + a
		}
		return a
	},
	format : function(b) {
		var a = Ext.Array.toArray(arguments, 1);
		return b.replace(Ext.String.formatRe, function(c, d) {
			return a[d]
		})
	},
	repeat : function(e, d, b) {
		for ( var a = [], c = d; c--;) {
			a.push(e)
		}
		return a.join(b || "")
	}
};
Ext.htmlEncode = Ext.String.htmlEncode;
Ext.htmlDecode = Ext.String.htmlDecode;
Ext.urlAppend = Ext.String.urlAppend;
(function() {
	var f = Array.prototype, n = f.slice, p = function() {
		var z = [], e, y = 20;
		if (!z.splice) {
			return false
		}
		while (y--) {
			z.push("A")
		}
		z.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F",
				"F", "F", "F", "F", "F", "F", "F", "F", "F", "F");
		e = z.length;
		z.splice(13, 0, "XXX");
		if (e + 1 != z.length) {
			return false
		}
		return true
	}(), i = "forEach" in f, t = "map" in f, o = "indexOf" in f, x = "every" in f, c = "some" in f, d = "filter" in f, m = function() {
		var e = [ 1, 2, 3, 4, 5 ].sort(function() {
			return 0
		});
		return e[0] === 1 && e[1] === 2 && e[2] === 3 && e[3] === 4
				&& e[4] === 5
	}(), j = true, a;
	try {
		if (typeof document !== "undefined") {
			n.call(document.getElementsByTagName("body"))
		}
	} catch (r) {
		j = false
	}
	function l(y, e) {
		return (e < 0) ? Math.max(0, y.length + e) : Math.min(y.length, e)
	}
	function w(F, E, y, I) {
		var J = I ? I.length : 0, A = F.length, G = l(F, E);
		if (G === A) {
			if (J) {
				F.push.apply(F, I)
			}
		} else {
			var D = Math.min(y, A - G), H = G + D, z = H + J - D, e = A - H, B = A
					- D, C;
			if (z < H) {
				for (C = 0; C < e; ++C) {
					F[z + C] = F[H + C]
				}
			} else {
				if (z > H) {
					for (C = e; C--;) {
						F[z + C] = F[H + C]
					}
				}
			}
			if (J && G === B) {
				F.length = B;
				F.push.apply(F, I)
			} else {
				F.length = B + J;
				for (C = 0; C < J; ++C) {
					F[G + C] = I[C]
				}
			}
		}
		return F
	}
	function h(A, e, z, y) {
		if (y && y.length) {
			if (e < A.length) {
				A.splice.apply(A, [ e, z ].concat(y))
			} else {
				A.push.apply(A, y)
			}
		} else {
			A.splice(e, z)
		}
		return A
	}
	function b(z, e, y) {
		return w(z, e, y)
	}
	function q(z, e, y) {
		z.splice(e, y);
		return z
	}
	function k(B, e, z) {
		var A = l(B, e), y = B.slice(e, l(B, A + z));
		if (arguments.length < 4) {
			w(B, A, z)
		} else {
			w(B, A, z, n.call(arguments, 3))
		}
		return y
	}
	function g(e) {
		return e.splice.apply(e, n.call(arguments, 1))
	}
	var v = p ? q : b, s = p ? h : w, u = p ? g : k;
	a = Ext.Array = {
		each : function(C, A, z, e) {
			C = a.from(C);
			var y, B = C.length;
			if (e !== true) {
				for (y = 0; y < B; y++) {
					if (A.call(z || C[y], C[y], y, C) === false) {
						return y
					}
				}
			} else {
				for (y = B - 1; y > -1; y--) {
					if (A.call(z || C[y], C[y], y, C) === false) {
						return y
					}
				}
			}
			return true
		},
		forEach : i ? function(z, y, e) {
			return z.forEach(y, e)
		} : function(B, z, y) {
			var e = 0, A = B.length;
			for (; e < A; e++) {
				z.call(y, B[e], e, B)
			}
		},
		indexOf : (o) ? function(z, e, y) {
			return z.indexOf(e, y)
		} : function(B, z, A) {
			var e, y = B.length;
			for (e = (A < 0) ? Math.max(0, y + A) : A || 0; e < y; e++) {
				if (B[e] === z) {
					return e
				}
			}
			return -1
		},
		contains : o ? function(y, e) {
			return y.indexOf(e) !== -1
		} : function(A, z) {
			var e, y;
			for (e = 0, y = A.length; e < y; e++) {
				if (A[e] === z) {
					return true
				}
			}
			return false
		},
		toArray : function(z, B, e) {
			if (!z || !z.length) {
				return []
			}
			if (typeof z === "string") {
				z = z.split("")
			}
			if (j) {
				return n.call(z, B || 0, e || z.length)
			}
			var A = [], y;
			B = B || 0;
			e = e ? ((e < 0) ? z.length + e : e) : z.length;
			for (y = B; y < e; y++) {
				A.push(z[y])
			}
			return A
		},
		pluck : function(C, e) {
			var y = [], z, B, A;
			for (z = 0, B = C.length; z < B; z++) {
				A = C[z];
				y.push(A[e])
			}
			return y
		},
		map : t ? function(z, y, e) {
			return z.map(y, e)
		} : function(C, B, A) {
			var z = [], y = 0, e = C.length;
			for (; y < e; y++) {
				z[y] = B.call(A, C[y], y, C)
			}
			return z
		},
		every : function(B, z, y) {
			if (!z) {
				Ext.Error
						.raise("Ext.Array.every must have a callback function passed as second argument.")
			}
			if (x) {
				return B.every(z, y)
			}
			var e = 0, A = B.length;
			for (; e < A; ++e) {
				if (!z.call(y, B[e], e, B)) {
					return false
				}
			}
			return true
		},
		some : function(B, z, y) {
			if (!z) {
				Ext.Error
						.raise("Ext.Array.some must have a callback function passed as second argument.")
			}
			if (c) {
				return B.some(z, y)
			}
			var e = 0, A = B.length;
			for (; e < A; ++e) {
				if (z.call(y, B[e], e, B)) {
					return true
				}
			}
			return false
		},
		clean : function(B) {
			var y = [], e = 0, A = B.length, z;
			for (; e < A; e++) {
				z = B[e];
				if (!Ext.isEmpty(z)) {
					y.push(z)
				}
			}
			return y
		},
		unique : function(B) {
			var A = [], e = 0, z = B.length, y;
			for (; e < z; e++) {
				y = B[e];
				if (a.indexOf(A, y) === -1) {
					A.push(y)
				}
			}
			return A
		},
		filter : function(C, A, z) {
			if (d) {
				return C.filter(A, z)
			}
			var y = [], e = 0, B = C.length;
			for (; e < B; e++) {
				if (A.call(z, C[e], e, C)) {
					y.push(C[e])
				}
			}
			return y
		},
		from : function(y, e) {
			if (y === undefined || y === null) {
				return []
			}
			if (Ext.isArray(y)) {
				return (e) ? n.call(y) : y
			}
			if (y && y.length !== undefined && typeof y !== "string") {
				return a.toArray(y)
			}
			return [ y ]
		},
		remove : function(z, y) {
			var e = a.indexOf(z, y);
			if (e !== -1) {
				v(z, e, 1)
			}
			return z
		},
		include : function(y, e) {
			if (!a.contains(y, e)) {
				y.push(e)
			}
		},
		clone : function(e) {
			return n.call(e)
		},
		merge : function() {
			var e = n.call(arguments), A = [], y, z;
			for (y = 0, z = e.length; y < z; y++) {
				A = A.concat(e[y])
			}
			return a.unique(A)
		},
		intersect : function() {
			var e = [], B = n.call(arguments), A, C, z, y;
			if (!B.length) {
				return e
			}
			B = B.sort(function(E, D) {
				if (E.length > D.length) {
					return 1
				} else {
					if (E.length < D.length) {
						return -1
					} else {
						return 0
					}
				}
			});
			C = a.unique(B[0]);
			for (z = 0; z < C.length; z++) {
				A = C[z];
				for (y = 1; y < B.length; y++) {
					if (B[y].indexOf(A) === -1) {
						break
					}
					if (y == (B.length - 1)) {
						e.push(A)
					}
				}
			}
			return e
		},
		difference : function(y, e) {
			var D = n.call(y), B = D.length, A, z, C;
			for (A = 0, C = e.length; A < C; A++) {
				for (z = 0; z < B; z++) {
					if (D[z] === e[A]) {
						v(D, z, 1);
						z--;
						B--
					}
				}
			}
			return D
		},
		slice : function(z, y, e) {
			return n.call(z, y, e)
		},
		sort : function(E, D) {
			if (m) {
				if (D) {
					return E.sort(D)
				} else {
					return E.sort()
				}
			}
			var B = E.length, A = 0, C, e, z, y;
			for (; A < B; A++) {
				z = A;
				for (e = A + 1; e < B; e++) {
					if (D) {
						C = D(E[e], E[z]);
						if (C < 0) {
							z = e
						}
					} else {
						if (E[e] < E[z]) {
							z = e
						}
					}
				}
				if (z !== A) {
					y = E[A];
					E[A] = E[z];
					E[z] = y
				}
			}
			return E
		},
		flatten : function(z) {
			var y = [];
			function e(A) {
				var C, D, B;
				for (C = 0, D = A.length; C < D; C++) {
					B = A[C];
					if (Ext.isArray(B)) {
						e(B)
					} else {
						y.push(B)
					}
				}
				return y
			}
			return e(z)
		},
		min : function(C, B) {
			var y = C[0], e, A, z;
			for (e = 0, A = C.length; e < A; e++) {
				z = C[e];
				if (B) {
					if (B(y, z) === 1) {
						y = z
					}
				} else {
					if (z < y) {
						y = z
					}
				}
			}
			return y
		},
		max : function(C, B) {
			var e = C[0], y, A, z;
			for (y = 0, A = C.length; y < A; y++) {
				z = C[y];
				if (B) {
					if (B(e, z) === -1) {
						e = z
					}
				} else {
					if (z > e) {
						e = z
					}
				}
			}
			return e
		},
		mean : function(e) {
			return e.length > 0 ? a.sum(e) / e.length : undefined
		},
		sum : function(B) {
			var y = 0, e, A, z;
			for (e = 0, A = B.length; e < A; e++) {
				z = B[e];
				y += z
			}
			return y
		},
		_replaceSim : w,
		_spliceSim : k,
		erase : v,
		insert : function(z, y, e) {
			return s(z, y, 0, e)
		},
		replace : s,
		splice : u
	};
	Ext.each = a.each;
	a.union = a.merge;
	Ext.min = a.min;
	Ext.max = a.max;
	Ext.sum = a.sum;
	Ext.mean = a.mean;
	Ext.flatten = a.flatten;
	Ext.clean = a.clean;
	Ext.unique = a.unique;
	Ext.pluck = a.pluck;
	Ext.toArray = function() {
		return a.toArray.apply(a, arguments)
	}
})();
(function() {
	var a = (0.9).toFixed() !== "1";
	Ext.Number = {
		constrain : function(d, c, b) {
			d = parseFloat(d);
			if (!isNaN(c)) {
				d = Math.max(d, c)
			}
			if (!isNaN(b)) {
				d = Math.min(d, b)
			}
			return d
		},
		snap : function(e, c, d, g) {
			var f = e, b;
			if (!(c && e)) {
				return e
			}
			b = e % c;
			if (b !== 0) {
				f -= b;
				if (b * 2 >= c) {
					f += c
				} else {
					if (b * 2 < -c) {
						f -= c
					}
				}
			}
			return Ext.Number.constrain(f, d, g)
		},
		toFixed : function(d, b) {
			if (a) {
				b = b || 0;
				var c = Math.pow(10, b);
				return (Math.round(d * c) / c).toFixed(b)
			}
			return d.toFixed(b)
		},
		from : function(c, b) {
			if (isFinite(c)) {
				c = parseFloat(c)
			}
			return !isNaN(c) ? c : b
		}
	}
})();
Ext.num = function() {
	return Ext.Number.from.apply(this, arguments)
};
(function() {
	var a = function() {
	};
	var b = Ext.Object = {
		chain : ("create" in Object) ? function(c) {
			return Object.create(c)
		} : function(d) {
			a.prototype = d;
			var c = new a();
			a.prototype = null;
			return c
		},
		toQueryObjects : function(e, j, d) {
			var c = b.toQueryObjects, h = [], f, g;
			if (Ext.isArray(j)) {
				for (f = 0, g = j.length; f < g; f++) {
					if (d) {
						h = h.concat(c(e + "[" + f + "]", j[f], true))
					} else {
						h.push({
							name : e,
							value : j[f]
						})
					}
				}
			} else {
				if (Ext.isObject(j)) {
					for (f in j) {
						if (j.hasOwnProperty(f)) {
							if (d) {
								h = h.concat(c(e + "[" + f + "]", j[f], true))
							} else {
								h.push({
									name : e,
									value : j[f]
								})
							}
						}
					}
				} else {
					h.push({
						name : e,
						value : j
					})
				}
			}
			return h
		},
		toQueryString : function(f, d) {
			var g = [], e = [], k, h, l, c, m;
			for (k in f) {
				if (f.hasOwnProperty(k)) {
					g = g.concat(b.toQueryObjects(k, f[k], d))
				}
			}
			for (h = 0, l = g.length; h < l; h++) {
				c = g[h];
				m = c.value;
				if (Ext.isEmpty(m)) {
					m = ""
				} else {
					if (Ext.isDate(m)) {
						m = Ext.Date.toString(m)
					}
				}
				e.push(encodeURIComponent(c.name) + "="
						+ encodeURIComponent(String(m)))
			}
			return e.join("&")
		},
		fromQueryString : function(d, q) {
			var l = d.replace(/^\?/, "").split("&"), t = {}, r, h, v, m, p, f, n, o, c, g, s, k, u, e;
			for (p = 0, f = l.length; p < f; p++) {
				n = l[p];
				if (n.length > 0) {
					h = n.split("=");
					v = decodeURIComponent(h[0]);
					m = (h[1] !== undefined) ? decodeURIComponent(h[1]) : "";
					if (!q) {
						if (t.hasOwnProperty(v)) {
							if (!Ext.isArray(t[v])) {
								t[v] = [ t[v] ]
							}
							t[v].push(m)
						} else {
							t[v] = m
						}
					} else {
						g = v.match(/(\[):?([^\]]*)\]/g);
						s = v.match(/^([^\[]+)/);
						if (!s) {
							throw new Error(
									'[Ext.Object.fromQueryString] Malformed query string given, failed parsing name from "'
											+ n + '"')
						}
						v = s[0];
						k = [];
						if (g === null) {
							t[v] = m;
							continue
						}
						for (o = 0, c = g.length; o < c; o++) {
							u = g[o];
							u = (u.length === 2) ? "" : u.substring(1,
									u.length - 1);
							k.push(u)
						}
						k.unshift(v);
						r = t;
						for (o = 0, c = k.length; o < c; o++) {
							u = k[o];
							if (o === c - 1) {
								if (Ext.isArray(r) && u === "") {
									r.push(m)
								} else {
									r[u] = m
								}
							} else {
								if (r[u] === undefined
										|| typeof r[u] === "string") {
									e = k[o + 1];
									r[u] = (Ext.isNumeric(e) || e === "") ? []
											: {}
								}
								r = r[u]
							}
						}
					}
				}
			}
			return t
		},
		each : function(c, e, d) {
			for ( var f in c) {
				if (c.hasOwnProperty(f)) {
					if (e.call(d || c, f, c[f], c) === false) {
						return
					}
				}
			}
		},
		merge : function(c) {
			var h = 1, j = arguments.length, d = b.merge, f = Ext.clone, g, l, k, e;
			for (; h < j; h++) {
				g = arguments[h];
				for (l in g) {
					k = g[l];
					if (k && k.constructor === Object) {
						e = c[l];
						if (e && e.constructor === Object) {
							d(e, k)
						} else {
							c[l] = f(k)
						}
					} else {
						c[l] = k
					}
				}
			}
			return c
		},
		mergeIf : function(j) {
			var f = 1, g = arguments.length, d = Ext.clone, c, e, h;
			for (; f < g; f++) {
				c = arguments[f];
				for (e in c) {
					if (!(e in j)) {
						h = c[e];
						if (h && h.constructor === Object) {
							j[e] = d(h)
						} else {
							j[e] = h
						}
					}
				}
			}
			return j
		},
		getKey : function(c, e) {
			for ( var d in c) {
				if (c.hasOwnProperty(d) && c[d] === e) {
					return d
				}
			}
			return null
		},
		getValues : function(d) {
			var c = [], e;
			for (e in d) {
				if (d.hasOwnProperty(e)) {
					c.push(d[e])
				}
			}
			return c
		},
		getKeys : ("keys" in Object) ? Object.keys : function(c) {
			var d = [], e;
			for (e in c) {
				if (c.hasOwnProperty(e)) {
					d.push(e)
				}
			}
			return d
		},
		getSize : function(c) {
			var d = 0, e;
			for (e in c) {
				if (c.hasOwnProperty(e)) {
					d++
				}
			}
			return d
		},
		classify : function(f) {
			var i = [], c = [], e = {}, d = function() {
				var k = 0, l = i.length, m;
				for (; k < l; k++) {
					m = i[k];
					this[m] = new e[m]
				}
				l = c.length;
				for (k = 0; k < l; k++) {
					m = c[k];
					this[m] = f[m].slice()
				}
			}, g, j, h;
			for (g in f) {
				if (f.hasOwnProperty(g)) {
					j = f[g];
					if (j) {
						h = j.constructor;
						if (h === Object) {
							i.push(g);
							e[g] = b.classify(j)
						} else {
							if (h === Array) {
								c.push(g)
							}
						}
					}
				}
			}
			d.prototype = f;
			return d
		},
		defineProperty : ("defineProperty" in Object) ? Object.defineProperty
				: function(d, c, e) {
					if (e.get) {
						d.__defineGetter__(c, e.get)
					}
					if (e.set) {
						d.__defineSetter__(c, e.set)
					}
				}
	};
	Ext.merge = Ext.Object.merge;
	Ext.mergeIf = Ext.Object.mergeIf;
	Ext.urlEncode = function() {
		var c = Ext.Array.from(arguments), d = "";
		if ((typeof c[1] === "string")) {
			d = c[1] + "&";
			c[1] = false
		}
		return d + b.toQueryString.apply(b, c)
	};
	Ext.urlDecode = function() {
		return b.fromQueryString.apply(b, arguments)
	}
})();
Ext.Function = {
	flexSetter : function(a) {
		return function(d, c) {
			var e, f;
			if (d === null) {
				return this
			}
			if (typeof d !== "string") {
				for (e in d) {
					if (d.hasOwnProperty(e)) {
						a.call(this, e, d[e])
					}
				}
				if (Ext.enumerables) {
					for (f = Ext.enumerables.length; f--;) {
						e = Ext.enumerables[f];
						if (d.hasOwnProperty(e)) {
							a.call(this, e, d[e])
						}
					}
				}
			} else {
				a.call(this, d, c)
			}
			return this
		}
	},
	bind : function(d, c, b, a) {
		if (arguments.length === 2) {
			return function() {
				return d.apply(c, arguments)
			}
		}
		var f = d, e = Array.prototype.slice;
		return function() {
			var g = b || arguments;
			if (a === true) {
				g = e.call(arguments, 0);
				g = g.concat(b)
			} else {
				if (typeof a == "number") {
					g = e.call(arguments, 0);
					Ext.Array.insert(g, a, b)
				}
			}
			return f.apply(c || window, g)
		}
	},
	pass : function(c, a, b) {
		if (!Ext.isArray(a)) {
			a = Ext.Array.clone(a)
		}
		return function() {
			a.push.apply(a, arguments);
			return c.apply(b || this, a)
		}
	},
	alias : function(b, a) {
		return function() {
			return b[a].apply(b, arguments)
		}
	},
	clone : function(a) {
		return function() {
			return a.apply(this, arguments)
		}
	},
	createInterceptor : function(d, c, b, a) {
		var e = d;
		if (!Ext.isFunction(c)) {
			return d
		} else {
			return function() {
				var g = this, f = arguments;
				c.target = g;
				c.method = d;
				return (c.apply(b || g || window, f) !== false) ? d.apply(g
						|| window, f) : a || null
			}
		}
	},
	createDelayed : function(e, c, d, b, a) {
		if (d || b) {
			e = Ext.Function.bind(e, d, b, a)
		}
		return function() {
			var g = this, f = Array.prototype.slice.call(arguments);
			setTimeout(function() {
				e.apply(g, f)
			}, c)
		}
	},
	defer : function(e, c, d, b, a) {
		e = Ext.Function.bind(e, d, b, a);
		if (c > 0) {
			return setTimeout(e, c)
		}
		e();
		return 0
	},
	createSequence : function(b, c, a) {
		if (!c) {
			return b
		} else {
			return function() {
				var d = b.apply(this, arguments);
				c.apply(a || this, arguments);
				return d
			}
		}
	},
	createBuffered : function(e, b, d, c) {
		var a;
		return function() {
			var g = c || Array.prototype.slice.call(arguments, 0), f = d
					|| this;
			if (a) {
				clearTimeout(a)
			}
			a = setTimeout(function() {
				e.apply(f, g)
			}, b)
		}
	},
	createThrottled : function(e, b, d) {
		var f, a, c, h, g = function() {
			e.apply(d || this, c);
			f = new Date().getTime()
		};
		return function() {
			a = new Date().getTime() - f;
			c = arguments;
			clearTimeout(h);
			if (!f || (a >= b)) {
				g()
			} else {
				h = setTimeout(g, b - a)
			}
		}
	},
	interceptBefore : function(b, a, c) {
		var d = b[a] || Ext.emptyFn;
		return b[a] = function() {
			var e = c.apply(this, arguments);
			d.apply(this, arguments);
			return e
		}
	},
	interceptAfter : function(b, a, c) {
		var d = b[a] || Ext.emptyFn;
		return b[a] = function() {
			d.apply(this, arguments);
			return c.apply(this, arguments)
		}
	}
};
Ext.defer = Ext.Function.alias(Ext.Function, "defer");
Ext.pass = Ext.Function.alias(Ext.Function, "pass");
Ext.bind = Ext.Function.alias(Ext.Function, "bind");
Ext.JSON = new (function() {
	var useHasOwn = !!{}.hasOwnProperty, isNative = function() {
		var useNative = null;
		return function() {
			if (useNative === null) {
				useNative = Ext.USE_NATIVE_JSON && window.JSON
						&& JSON.toString() == "[object JSON]"
			}
			return useNative
		}
	}(), pad = function(n) {
		return n < 10 ? "0" + n : n
	}, doDecode = function(json) {
		return eval("(" + json + ")")
	}, doEncode = function(o) {
		if (!Ext.isDefined(o) || o === null) {
			return "null"
		} else {
			if (Ext.isArray(o)) {
				return encodeArray(o)
			} else {
				if (Ext.isDate(o)) {
					return Ext.JSON.encodeDate(o)
				} else {
					if (Ext.isString(o)) {
						if (Ext.isMSDate(o)) {
							return encodeMSDate(o)
						} else {
							return encodeString(o)
						}
					} else {
						if (typeof o == "number") {
							return isFinite(o) ? String(o) : "null"
						} else {
							if (Ext.isBoolean(o)) {
								return String(o)
							} else {
								if (Ext.isObject(o)) {
									return encodeObject(o)
								} else {
									if (typeof o === "function") {
										return "null"
									}
								}
							}
						}
					}
				}
			}
		}
		return "undefined"
	}, m = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\",
		"\x0b" : "\\u000b"
	}, charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g, encodeString = function(s) {
		return '"'
				+ s.replace(charToReplace, function(a) {
					var c = m[a];
					return typeof c === "string" ? c : "\\u"
							+ ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				}) + '"'
	}, encodeArray = function(o) {
		var a = [ "[", "" ], len = o.length, i;
		for (i = 0; i < len; i += 1) {
			a.push(doEncode(o[i]), ",")
		}
		a[a.length - 1] = "]";
		return a.join("")
	}, encodeObject = function(o) {
		var a = [ "{", "" ], i;
		for (i in o) {
			if (!useHasOwn || o.hasOwnProperty(i)) {
				a.push(doEncode(i), ":", doEncode(o[i]), ",")
			}
		}
		a[a.length - 1] = "}";
		return a.join("")
	}, encodeMSDate = function(o) {
		return '"' + o + '"'
	};
	this.encodeDate = function(o) {
		return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-"
				+ pad(o.getDate()) + "T" + pad(o.getHours()) + ":"
				+ pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"'
	};
	this.encode = function() {
		var ec;
		return function(o) {
			if (!ec) {
				ec = isNative() ? JSON.stringify : doEncode
			}
			return ec(o)
		}
	}();
	this.decode = function() {
		var dc;
		return function(json, safe) {
			if (!dc) {
				dc = isNative() ? JSON.parse : doDecode
			}
			try {
				return dc(json)
			} catch (e) {
				if (safe === true) {
					return null
				}
				Ext.Error.raise({
					sourceClass : "Ext.JSON",
					sourceMethod : "decode",
					msg : "You're trying to decode an invalid JSON String: "
							+ json
				})
			}
		}
	}()
})();
Ext.encode = Ext.JSON.encode;
Ext.decode = Ext.JSON.decode;
Ext.Error = {
	raise : function(a) {
		throw new Error(a.msg)
	}
};
Ext.Date = {
	now : Date.now,
	toString : function(a) {
		if (!a) {
			a = new Date()
		}
		var b = Ext.String.leftPad;
		return a.getFullYear() + "-" + b(a.getMonth() + 1, 2, "0") + "-"
				+ b(a.getDate(), 2, "0") + "T" + b(a.getHours(), 2, "0") + ":"
				+ b(a.getMinutes(), 2, "0") + ":" + b(a.getSeconds(), 2, "0")
	}
};
(function(a) {
	var c = [], b = function() {
	};
	Ext
			.apply(
					b,
					{
						$className : "Ext.Base",
						$isClass : true,
						create : function() {
							return Ext.create.apply(Ext, [ this ]
									.concat(Array.prototype.slice.call(
											arguments, 0)))
						},
						extend : function(h) {
							var d = h.prototype, f, g, j, e, k;
							f = this.prototype = Ext.Object.chain(d);
							f.self = this;
							this.superclass = f.superclass = d;
							if (!h.$isClass) {
								Ext.apply(f, Ext.Base.prototype);
								f.constructor = function() {
									d.constructor.apply(this, arguments)
								}
							}
							k = d.$inheritableStatics;
							if (k) {
								for (g = 0, j = k.length; g < j; g++) {
									e = k[g];
									if (!this.hasOwnProperty(e)) {
										this[e] = h[e]
									}
								}
							}
							if (h.$onExtended) {
								this.$onExtended = h.$onExtended.slice()
							}
							f.config = f.defaultConfig = new f.configClass;
							f.initConfigList = f.initConfigList.slice();
							f.initConfigMap = Ext.Object.chain(f.initConfigMap)
						},
						"$onExtended" : [],
						triggerExtended : function() {
							var f = this.$onExtended, e = f.length, d, g;
							if (e > 0) {
								for (d = 0; d < e; d++) {
									g = f[d];
									g.fn.apply(g.scope || this, arguments)
								}
							}
						},
						onExtended : function(e, d) {
							this.$onExtended.push({
								fn : e,
								scope : d
							});
							return this
						},
						addConfig : function(f, i) {
							var j = this.prototype, g = j.initConfigList, e = j.initConfigMap, h = j.defaultConfig, l, d, k;
							i = Boolean(i);
							for (d in f) {
								if (f.hasOwnProperty(d) && (i || !(d in h))) {
									k = f[d];
									l = e[d];
									if (k !== null) {
										if (!l) {
											e[d] = true;
											g.push(d)
										}
									} else {
										if (l) {
											e[d] = false;
											Ext.Array.remove(g, d)
										}
									}
								}
							}
							if (i) {
								Ext.merge(h, f)
							} else {
								Ext.mergeIf(h, f)
							}
							j.configClass = Ext.Object.classify(h)
						},
						addStatics : function(d) {
							var g, e;
							var f = Ext.getClassName(this);
							for (e in d) {
								if (d.hasOwnProperty(e)) {
									g = d[e];
									if (typeof g == "function") {
										g.displayName = f + "." + e
									}
									this[e] = g
								}
							}
							return this
						},
						addInheritableStatics : function(e) {
							var i, d, g = this.prototype, f, j;
							i = g.$inheritableStatics;
							d = g.$hasInheritableStatics;
							if (!i) {
								i = g.$inheritableStatics = [];
								d = g.$hasInheritableStatics = {}
							}
							var h = Ext.getClassName(this);
							for (f in e) {
								if (e.hasOwnProperty(f)) {
									j = e[f];
									if (typeof j == "function") {
										j.displayName = h + "." + f
									}
									this[f] = j;
									if (!d[f]) {
										d[f] = true;
										i.push(f)
									}
								}
							}
							return this
						},
						addMembers : function(d) {
							var f = this.prototype, h = [], e, i;
							var g = this.$className || "";
							for (e in d) {
								if (d.hasOwnProperty(e)) {
									i = d[e];
									if (typeof i == "function" && !i.$isClass
											&& i !== Ext.emptyFn) {
										i.$owner = this;
										i.$name = e;
										i.displayName = g + "#" + e
									}
									f[e] = i
								}
							}
							return this
						},
						addMember : function(d, e) {
							if (typeof e == "function" && !e.$isClass
									&& e !== Ext.emptyFn) {
								e.$owner = this;
								e.$name = d;
								e.displayName = (this.$className || "") + "#"
										+ d
							}
							this.prototype[d] = e;
							return this
						},
						implement : function() {
							this.addMembers.apply(this, arguments)
						},
						borrow : function(h, f) {
							var n = this.prototype, m = h.prototype, k = Ext
									.getClassName(this), g, j, e, l, d;
							f = Ext.Array.from(f);
							for (g = 0, j = f.length; g < j; g++) {
								e = f[g];
								d = m[e];
								if (typeof d == "function") {
									l = function() {
										return d.apply(this, arguments)
									};
									if (k) {
										l.displayName = k + "#" + e
									}
									l.$owner = this;
									l.$name = e;
									n[e] = l
								} else {
									n[e] = d
								}
							}
							return this
						},
						override : function(e) {
							var m = this, o = Ext.enumerables, j = m.prototype, g = Ext.Function.clone, d, i, f, n, l, h;
							if (arguments.length === 2) {
								d = e;
								e = {};
								e[d] = arguments[1];
								o = null
							}
							do {
								l = [];
								n = null;
								for (d in e) {
									if (d == "statics") {
										n = e[d]
									} else {
										if (d == "config") {
											m.addConfig(e[d], true)
										} else {
											l.push(d)
										}
									}
								}
								if (o) {
									l.push.apply(l, o)
								}
								for (i = l.length; i--;) {
									d = l[i];
									if (e.hasOwnProperty(d)) {
										f = e[d];
										if (typeof f == "function"
												&& !f.$className
												&& f !== Ext.emptyFn) {
											if (typeof f.$owner != "undefined") {
												f = g(f)
											}
											var k = m.$className;
											if (k) {
												f.displayName = k + "#" + d
											}
											f.$owner = m;
											f.$name = d;
											h = j[d];
											if (h) {
												f.$previous = h
											}
										}
										j[d] = f
									}
								}
								j = m;
								e = n
							} while (e);
							return this
						},
						callParent : function(d) {
							var e;
							return (e = this.callParent.caller)
									&& (e.$previous || ((e = e.$owner ? e
											: e.caller) && e.$owner.superclass.$class[e.$name]))
											.apply(this, d || c)
						},
						mixin : function(f, h) {
							var d = h.prototype, e = this.prototype, g;
							if (typeof d.onClassMixedIn != "undefined") {
								d.onClassMixedIn.call(h, this)
							}
							if (!e.hasOwnProperty("mixins")) {
								if ("mixins" in e) {
									e.mixins = Ext.Object.chain(e.mixins)
								} else {
									e.mixins = {}
								}
							}
							for (g in d) {
								if (g === "mixins") {
									Ext.merge(e.mixins, d[g])
								} else {
									if (typeof e[g] == "undefined"
											&& g != "mixinId" && g != "config") {
										e[g] = d[g]
									}
								}
							}
							if ("config" in d) {
								this.addConfig(d.config, false)
							}
							e.mixins[f] = d
						},
						getName : function() {
							return Ext.getClassName(this)
						},
						createAlias : a(function(e, d) {
							this.override(e, function() {
								return this[d].apply(this, arguments)
							})
						}),
						addXtype : function(h) {
							var e = this.prototype, g = e.xtypesMap, f = e.xtypes, d = e.xtypesChain;
							if (!e.hasOwnProperty("xtypesMap")) {
								g = e.xtypesMap = Ext.merge({}, e.xtypesMap
										|| {});
								f = e.xtypes = e.xtypes ? [].concat(e.xtypes)
										: [];
								d = e.xtypesChain = e.xtypesChain ? []
										.concat(e.xtypesChain) : [];
								e.xtype = h
							}
							if (!g[h]) {
								g[h] = true;
								f.push(h);
								d.push(h);
								Ext.ClassManager.setAlias(this, "widget." + h)
							}
							return this
						}
					});
	b
			.implement({
				isInstance : true,
				$className : "Ext.Base",
				configClass : Ext.emptyFn,
				initConfigList : [],
				initConfigMap : {},
				statics : function() {
					var e = this.statics.caller, d = this.self;
					if (!e) {
						return d
					}
					return e.$owner
				},
				callParent : function(f) {
					var h, d = (h = this.callParent.caller)
							&& (h.$previous || ((h = h.$owner ? h : h.caller) && h.$owner.superclass[h.$name]));
					if (!d) {
						h = this.callParent.caller;
						var g, e;
						if (!h.$owner) {
							if (!h.caller) {
								throw new Error(
										"Attempting to call a protected method from the public scope, which is not allowed")
							}
							h = h.caller
						}
						g = h.$owner.superclass;
						e = h.$name;
						if (!(e in g)) {
							throw new Error(
									"this.callParent() was called but there's no such method ("
											+ e
											+ ") found in the parent class ("
											+ (Ext.getClassName(g) || "Object")
											+ ")")
						}
					}
					return d.apply(this, f || c)
				},
				callSuper : function(f) {
					var h, d = (h = this.callSuper.caller)
							&& ((h = h.$owner ? h : h.caller) && h.$owner.superclass[h.$name]);
					if (!d) {
						h = this.callSuper.caller;
						var g, e;
						if (!h.$owner) {
							if (!h.caller) {
								throw new Error(
										"Attempting to call a protected method from the public scope, which is not allowed")
							}
							h = h.caller
						}
						g = h.$owner.superclass;
						e = h.$name;
						if (!(e in g)) {
							throw new Error(
									"this.callSuper() was called but there's no such method ("
											+ e
											+ ") found in the parent class ("
											+ (Ext.getClassName(g) || "Object")
											+ ")")
						}
					}
					return d.apply(this, f || c)
				},
				callOverridden : function(d) {
					var e;
					return (e = this.callOverridden.caller)
							&& e.$previous.apply(this, d || c)
				},
				self : b,
				constructor : function() {
					return this
				},
				wasInstantiated : false,
				initConfig : function(m) {
					var l = Ext.Class.configNameCache, p = this.self.prototype, h = this.initConfigList, f = this.initConfigMap, g = new this.configClass, j = this.defaultConfig, k, o, e, q, n, d;
					this.initConfig = Ext.emptyFn;
					this.initialConfig = m || {};
					if (m) {
						Ext.merge(g, m)
					}
					this.config = g;
					if (!p.hasOwnProperty("wasInstantiated")) {
						p.wasInstantiated = true;
						for (k = 0, o = h.length; k < o; k++) {
							e = h[k];
							n = l[e];
							q = j[e];
							if (!(n.apply in p) && !(n.update in p)
									&& p[n.set].$isDefault
									&& typeof q != "object") {
								p[n.internal] = j[e];
								f[e] = false;
								Ext.Array.remove(h, e);
								k--;
								o--
							}
						}
					}
					if (m) {
						h = h.slice();
						for (e in m) {
							if (e in j && !f[e]) {
								h.push(e)
							}
						}
					}
					for (k = 0, o = h.length; k < o; k++) {
						e = h[k];
						n = l[e];
						this[n.get] = this[n.initGet]
					}
					this.beforeInitConfig(g);
					for (k = 0, o = h.length; k < o; k++) {
						e = h[k];
						n = l[e];
						d = n.get;
						if (this.hasOwnProperty(d)) {
							this[n.set].call(this, g[e]);
							delete this[d]
						}
					}
					return this
				},
				beforeInitConfig : Ext.emptyFn,
				getCurrentConfig : function() {
					var d = this.defaultConfig, g = Ext.Class.configNameCache, f = {}, e, h;
					for (e in d) {
						h = g[e];
						f[e] = this[h.get].call(this)
					}
					return f
				},
				setConfig : function(e, l) {
					if (!e) {
						return this
					}
					var h = Ext.Class.configNameCache, j = this.config, f = this.defaultConfig, o = this.initialConfig, k = [], d, g, n, m;
					l = Boolean(l);
					for (d in e) {
						if ((l && (d in o))) {
							continue
						}
						j[d] = e[d];
						if (d in f) {
							k.push(d);
							m = h[d];
							this[m.get] = this[m.initGet]
						}
					}
					for (g = 0, n = k.length; g < n; g++) {
						d = k[g];
						m = h[d];
						this[m.set].call(this, e[d]);
						delete this[m.get]
					}
					return this
				},
				set : function(d, e) {
					return this[Ext.Class.configNameCache[d].set].call(this, e)
				},
				get : function(d) {
					return this[Ext.Class.configNameCache[d].get].call(this)
				},
				getConfig : function(d) {
					return this[Ext.Class.configNameCache[d].get].call(this)
				},
				hasConfig : function(d) {
					return (d in this.defaultConfig)
				},
				getInitialConfig : function(e) {
					var d = this.config;
					if (!e) {
						return d
					} else {
						return d[e]
					}
				},
				onConfigUpdate : function(k, m, n) {
					var o = this.self, j = o.$className, f, h, d, g, l, e;
					k = Ext.Array.from(k);
					n = n || this;
					for (f = 0, h = k.length; f < h; f++) {
						d = k[f];
						g = "update" + Ext.String.capitalize(d);
						l = this[g] || Ext.emptyFn;
						e = function() {
							l.apply(this, arguments);
							n[m].apply(n, arguments)
						};
						e.$name = g;
						e.$owner = o;
						e.displayName = j + "#" + g;
						this[g] = e
					}
				},
				link : function(d, e) {
					this.$links = {};
					this.link = this.doLink;
					return this.link.apply(this, arguments)
				},
				doLink : function(d, e) {
					this.$links[d] = true;
					this[d] = e;
					return e
				},
				unlink : function() {
					var d, f, e, g;
					for (d = 0, f = arguments.length; d < f; d++) {
						e = arguments[d];
						if (this.hasOwnProperty(e)) {
							g = this[e];
							if (g) {
								if (g.isInstance && !g.isDestroyed) {
									g.destroy()
								} else {
									if (g.parentNode && "nodeType" in g) {
										g.parentNode.removeChild(g)
									}
								}
							}
							delete this[e]
						}
					}
					return this
				},
				destroy : function() {
					this.destroy = Ext.emptyFn;
					this.isDestroyed = true;
					if (this.hasOwnProperty("$links")) {
						this.unlink
								.apply(this, Ext.Object.getKeys(this.$links));
						delete this.$links
					}
				}
			});
	Ext.Base = b
})(Ext.Function.flexSetter);
(function() {
	var b, a = Ext.Base, e = [], d, c;
	for (d in a) {
		if (a.hasOwnProperty(d)) {
			e.push(d)
		}
	}
	c = e.length;
	Ext.Class = b = function(g, h, f) {
		if (typeof g != "function") {
			f = h;
			h = g;
			g = null
		}
		if (!h) {
			h = {}
		}
		g = b.create(g);
		b.process(g, h, f);
		return g
	};
	Ext
			.apply(
					b,
					{
						onBeforeCreated : function(g, h, f) {
							g.addMembers(h);
							f.onCreated.call(g, g)
						},
						create : function(f) {
							var g, h;
							if (!f) {
								f = function() {
									return this.constructor.apply(this,
											arguments)
								}
							}
							for (h = 0; h < c; h++) {
								g = e[h];
								f[g] = a[g]
							}
							return f
						},
						process : function(g, m, k) {
							var j = m.preprocessors || b.defaultPreprocessors, q = this.preprocessors, t = {
								onBeforeCreated : this.onBeforeCreated,
								onCreated : k || Ext.emptyFn
							}, n = 0, f, u, p, l, o, r, s, h;
							delete m.preprocessors;
							h = function(v, w, i) {
								r = null;
								while (r === null) {
									f = j[n++];
									if (f) {
										u = q[f];
										p = u.properties;
										if (p === true) {
											r = u.fn
										} else {
											for (l = 0, o = p.length; l < o; l++) {
												s = p[l];
												if (w.hasOwnProperty(s)) {
													r = u.fn;
													break
												}
											}
										}
									} else {
										i.onBeforeCreated
												.apply(this, arguments);
										return
									}
								}
								if (r.call(this, v, w, i, h) !== false) {
									h.apply(this, arguments)
								}
							};
							h.call(this, g, m, t)
						},
						preprocessors : {},
						registerPreprocessor : function(g, j, h, f, i) {
							if (!f) {
								f = "last"
							}
							if (!h) {
								h = [ g ]
							}
							this.preprocessors[g] = {
								name : g,
								properties : h || false,
								fn : j
							};
							this.setDefaultPreprocessorPosition(g, f, i);
							return this
						},
						getPreprocessor : function(f) {
							return this.preprocessors[f]
						},
						getPreprocessors : function() {
							return this.preprocessors
						},
						defaultPreprocessors : [],
						getDefaultPreprocessors : function() {
							return this.defaultPreprocessors
						},
						setDefaultPreprocessors : function(f) {
							this.defaultPreprocessors = Ext.Array.from(f);
							return this
						},
						setDefaultPreprocessorPosition : function(h, j, i) {
							var f = this.defaultPreprocessors, g;
							if (typeof j == "string") {
								if (j === "first") {
									f.unshift(h);
									return this
								} else {
									if (j === "last") {
										f.push(h);
										return this
									}
								}
								j = (j === "after") ? 1 : -1
							}
							g = Ext.Array.indexOf(f, i);
							if (g !== -1) {
								Ext.Array.splice(f, Math.max(0, g + j), 0, h)
							}
							return this
						},
						configNameCache : {},
						getConfigNameMap : function(h) {
							var g = this.configNameCache, i = g[h], f;
							if (!i) {
								f = h.charAt(0).toUpperCase() + h.substr(1);
								i = g[h] = {
									name : h,
									internal : "_" + h,
									initializing : "is" + f + "Initializing",
									apply : "apply" + f,
									update : "update" + f,
									set : "set" + f,
									get : "get" + f,
									initGet : "initGet" + f,
									doSet : "doSet" + f,
									changeEvent : h.toLowerCase() + "change"
								}
							}
							return i
						},
						generateSetter : function(i) {
							var g = i.internal, h = i.get, f = i.apply, k = i.update, j;
							j = function(n) {
								var m = this[g], l = this[f], o = this[k];
								delete this[h];
								if (l) {
									n = l.call(this, n, m)
								}
								if (typeof n != "undefined") {
									this[g] = n;
									if (o && n !== m) {
										o.call(this, n, m)
									}
								}
								return this
							};
							j.$isDefault = true;
							return j
						},
						generateInitGetter : function(j) {
							var f = j.name, i = j.set, g = j.get, h = j.initializing;
							return function() {
								this[h] = true;
								delete this[g];
								this[i].call(this, this.config[f]);
								delete this[h];
								return this[g].apply(this, arguments)
							}
						},
						generateGetter : function(g) {
							var f = g.internal;
							return function() {
								return this[f]
							}
						}
					});
	b.registerPreprocessor("extend", function(f, i) {
		var h = Ext.Base, j = i.extend, g;
		delete i.extend;
		if (j && j !== Object) {
			g = j
		} else {
			g = h
		}
		f.extend(g);
		f.triggerExtended.apply(f, arguments);
		if (i.onClassExtended) {
			f.onExtended(i.onClassExtended, f);
			delete i.onClassExtended
		}
	}, true);
	b.registerPreprocessor("statics", function(f, g) {
		f.addStatics(g.statics);
		delete g.statics
	});
	b.registerPreprocessor("inheritableStatics", function(f, g) {
		f.addInheritableStatics(g.inheritableStatics);
		delete g.inheritableStatics
	});
	b.registerPreprocessor("config", function(h, m) {
		var j = m.config, p = h.prototype, l = p.config, o, g, n, f, i, k, q;
		delete m.config;
		for (g in j) {
			if (j.hasOwnProperty(g) && !(g in l)) {
				q = j[g];
				o = this.getConfigNameMap(g);
				n = o.set;
				f = o.get;
				i = o.initGet;
				k = o.internal;
				m[i] = this.generateInitGetter(o);
				if (q === null && !m.hasOwnProperty(k)) {
					m[k] = null
				}
				if (!m.hasOwnProperty(f)) {
					m[f] = this.generateGetter(o)
				}
				if (!m.hasOwnProperty(n)) {
					m[n] = this.generateSetter(o)
				}
			}
		}
		h.addConfig(j, true)
	});
	b.registerPreprocessor("mixins", function(j, n, f) {
		var g = n.mixins, k, h, l, m;
		delete n.mixins;
		Ext.Function.interceptBefore(f, "onCreated", function() {
			if (g instanceof Array) {
				for (l = 0, m = g.length; l < m; l++) {
					h = g[l];
					k = h.prototype.mixinId || h.$className;
					j.mixin(k, h)
				}
			} else {
				for (k in g) {
					if (g.hasOwnProperty(k)) {
						j.mixin(k, g[k])
					}
				}
			}
		})
	});
	Ext.extend = function(h, i, g) {
		if (arguments.length === 2 && Ext.isObject(i)) {
			g = i;
			i = h;
			h = null
		}
		var f;
		if (!i) {
			throw new Error(
					"[Ext.extend] Attempting to extend from a class which has not been loaded on the page.")
		}
		g.extend = i;
		g.preprocessors = [ "extend", "statics", "inheritableStatics",
				"mixins", "config" ];
		if (h) {
			f = new b(h, g)
		} else {
			f = new b(g)
		}
		f.prototype.override = function(k) {
			for ( var j in k) {
				if (k.hasOwnProperty(j)) {
					this[j] = k[j]
				}
			}
		};
		return f
	}
})();
(function(b, d, f, c, e) {
	var a = Ext.ClassManager = {
		classes : {},
		existCache : {},
		namespaceRewrites : [ {
			from : "Ext.",
			to : Ext
		} ],
		maps : {
			alternateToName : {},
			aliasToName : {},
			nameToAliases : {},
			nameToAlternates : {}
		},
		enableNamespaceParseCache : true,
		namespaceParseCache : {},
		instantiators : [],
		isCreated : function(l) {
			var k = this.existCache, j, m, h, g, n;
			if (typeof l != "string" || l.length < 1) {
				throw new Error(
						"[Ext.ClassManager] Invalid classname, must be a string and must not be empty")
			}
			if (this.classes[l] || k[l]) {
				return true
			}
			g = e;
			n = this.parseNamespace(l);
			for (j = 0, m = n.length; j < m; j++) {
				h = n[j];
				if (typeof h != "string") {
					g = h
				} else {
					if (!g || !g[h]) {
						return false
					}
					g = g[h]
				}
			}
			k[l] = true;
			this.triggerCreated(l);
			return true
		},
		createdListeners : [],
		nameCreatedListeners : {},
		triggerCreated : function(q) {
			var s = this.createdListeners, k = this.nameCreatedListeners, l = this.maps.nameToAlternates[q], r = [ q ], n, p, m, o, h, g;
			for (n = 0, p = s.length; n < p; n++) {
				h = s[n];
				h.fn.call(h.scope, q)
			}
			if (l) {
				r.push.apply(r, l)
			}
			for (n = 0, p = r.length; n < p; n++) {
				g = r[n];
				s = k[g];
				if (s) {
					for (m = 0, o = s.length; m < o; m++) {
						h = s[m];
						h.fn.call(h.scope, g)
					}
					delete k[g]
				}
			}
		},
		onCreated : function(k, j, i) {
			var h = this.createdListeners, g = this.nameCreatedListeners, l = {
				fn : k,
				scope : j
			};
			if (i) {
				if (this.isCreated(i)) {
					k.call(j, i);
					return
				}
				if (!g[i]) {
					g[i] = []
				}
				g[i].push(l)
			} else {
				h.push(l)
			}
		},
		parseNamespace : function(j) {
			if (typeof j != "string") {
				throw new Error(
						"[Ext.ClassManager] Invalid namespace, must be a string")
			}
			var g = this.namespaceParseCache;
			if (this.enableNamespaceParseCache) {
				if (g.hasOwnProperty(j)) {
					return g[j]
				}
			}
			var k = [], m = this.namespaceRewrites, o = e, h = j, r, q, p, l, n;
			for (l = 0, n = m.length; l < n; l++) {
				r = m[l];
				q = r.from;
				p = r.to;
				if (h === q || h.substring(0, q.length) === q) {
					h = h.substring(q.length);
					if (typeof p != "string") {
						o = p
					} else {
						k = k.concat(p.split("."))
					}
					break
				}
			}
			k.push(o);
			k = k.concat(h.split("."));
			if (this.enableNamespaceParseCache) {
				g[j] = k
			}
			return k
		},
		setNamespace : function(k, n) {
			var h = e, o = this.parseNamespace(k), m = o.length - 1, g = o[m], l, j;
			for (l = 0; l < m; l++) {
				j = o[l];
				if (typeof j != "string") {
					h = j
				} else {
					if (!h[j]) {
						h[j] = {}
					}
					h = h[j]
				}
			}
			h[g] = n;
			return h[g]
		},
		createNamespaces : function() {
			var g = e, n, k, l, h, m, o;
			for (l = 0, m = arguments.length; l < m; l++) {
				n = this.parseNamespace(arguments[l]);
				for (h = 0, o = n.length; h < o; h++) {
					k = n[h];
					if (typeof k != "string") {
						g = k
					} else {
						if (!g[k]) {
							g[k] = {}
						}
						g = g[k]
					}
				}
			}
			return g
		},
		set : function(g, k) {
			var j = this, m = j.maps, l = m.nameToAlternates, i = j.getName(k), h;
			j.classes[g] = j.setNamespace(g, k);
			if (i && i !== g) {
				m.alternateToName[g] = i;
				h = l[i] || (l[i] = []);
				h.push(g)
			}
			return this
		},
		get : function(j) {
			var l = this.classes;
			if (l[j]) {
				return l[j]
			}
			var g = e, n = this.parseNamespace(j), h, k, m;
			for (k = 0, m = n.length; k < m; k++) {
				h = n[k];
				if (typeof h != "string") {
					g = h
				} else {
					if (!g || !g[h]) {
						return null
					}
					g = g[h]
				}
			}
			return g
		},
		setAlias : function(g, h) {
			var j = this.maps.aliasToName, k = this.maps.nameToAliases, i;
			if (typeof g == "string") {
				i = g
			} else {
				i = this.getName(g)
			}
			if (h && j[h] !== i) {
				if (j[h]) {
					Ext.Logger
							.info("[Ext.ClassManager] Overriding existing alias: '"
									+ h
									+ "' of: '"
									+ j[h]
									+ "' with: '"
									+ i
									+ "'. Be sure it's intentional.")
				}
				j[h] = i
			}
			if (!k[i]) {
				k[i] = []
			}
			if (h) {
				Ext.Array.include(k[i], h)
			}
			return this
		},
		addNameAliasMappings : function(g) {
			var m = this.maps.aliasToName, n = this.maps.nameToAliases, k, l, j, h;
			for (k in g) {
				l = n[k] || (n[k] = []);
				for (h = 0; h < g[k].length; h++) {
					j = g[k][h];
					if (!m[j]) {
						m[j] = k;
						l.push(j)
					}
				}
			}
			return this
		},
		addNameAlternateMappings : function(k) {
			var g = this.maps.alternateToName, n = this.maps.nameToAlternates, j, l, m, h;
			for (j in k) {
				l = n[j] || (n[j] = []);
				for (h = 0; h < k[j].length; h++) {
					m = k[j];
					if (!g[m]) {
						g[m] = j;
						l.push(m)
					}
				}
			}
			return this
		},
		getByAlias : function(g) {
			return this.get(this.getNameByAlias(g))
		},
		getNameByAlias : function(g) {
			return this.maps.aliasToName[g] || ""
		},
		getNameByAlternate : function(g) {
			return this.maps.alternateToName[g] || ""
		},
		getAliasesByName : function(g) {
			return this.maps.nameToAliases[g] || []
		},
		getName : function(g) {
			return g && g.$className || ""
		},
		getClass : function(g) {
			return g && g.self || null
		},
		create : function(h, i, g) {
			if (typeof h != "string") {
				throw new Error("[Ext.define] Invalid class name '" + h
						+ "' specified, must be a non-empty string")
			}
			i.$className = h;
			return new b(
					i,
					function() {
						var m = i.postprocessors || a.defaultPostprocessors, t = a.postprocessors, q = 0, u = [], s, k, n, r, l, p, o, v;
						delete i.postprocessors;
						for (n = 0, r = m.length; n < r; n++) {
							s = m[n];
							if (typeof s == "string") {
								s = t[s];
								o = s.properties;
								if (o === true) {
									u.push(s.fn)
								} else {
									if (o) {
										for (l = 0, p = o.length; l < p; l++) {
											v = o[l];
											if (i.hasOwnProperty(v)) {
												u.push(s.fn);
												break
											}
										}
									}
								}
							} else {
								u.push(s)
							}
						}
						k = function(w, j, x) {
							s = u[q++];
							if (!s) {
								a.set(h, j);
								if (g) {
									g.call(j, j)
								}
								a.triggerCreated(h);
								return
							}
							if (s.call(this, w, j, x, k) !== false) {
								k.apply(this, arguments)
							}
						};
						k.call(a, h, this, i)
					})
		},
		createOverride : function(h, j) {
			var i = j.override, g = Ext.Array.from(j.requires);
			delete j.override;
			delete j.requires;
			this.existCache[h] = true;
			Ext.require(g, function() {
				this.onCreated(function() {
					this.get(i).override(j);
					this.triggerCreated(h)
				}, this, i)
			}, this);
			return this
		},
		instantiateByAlias : function() {
			var h = arguments[0], g = f.call(arguments), i = this
					.getNameByAlias(h);
			if (!i) {
				i = this.maps.aliasToName[h];
				if (!i) {
					throw new Error(
							"[Ext.createByAlias] Cannot create an instance of unrecognized alias: "
									+ h)
				}
				Ext.Logger.warn("[Ext.Loader] Synchronously loading '" + i
						+ "'; consider adding Ext.require('" + h
						+ "') above Ext.onReady");
				Ext.syncRequire(i)
			}
			g[0] = i;
			return this.instantiate.apply(this, g)
		},
		instantiate : function() {
			var i = arguments[0], h = f.call(arguments, 1), j = i, k, g;
			if (typeof i != "function") {
				if ((typeof i != "string" || i.length < 1)) {
					throw new Error(
							"[Ext.create] Invalid class name or alias '" + i
									+ "' specified, must be a non-empty string")
				}
				g = this.get(i)
			} else {
				g = i
			}
			if (!g) {
				k = this.getNameByAlias(i);
				if (k) {
					i = k;
					g = this.get(i)
				}
			}
			if (!g) {
				k = this.getNameByAlternate(i);
				if (k) {
					i = k;
					g = this.get(i)
				}
			}
			if (!g) {
				Ext.Logger
						.warn("[Ext.Loader] Synchronously loading '"
								+ i
								+ "'; consider adding '"
								+ ((k) ? j : i)
								+ "' explicitly as a require of the corresponding class");
				Ext.syncRequire(i);
				g = this.get(i)
			}
			if (!g) {
				throw new Error(
						"[Ext.create] Cannot create an instance of unrecognized class name / alias: "
								+ j)
			}
			if (typeof g != "function") {
				throw new Error("[Ext.create] '" + i
						+ "' is a singleton and cannot be instantiated")
			}
			return this.getInstantiator(h.length)(g, h)
		},
		dynInstantiate : function(h, g) {
			g = c(g, true);
			g.unshift(h);
			return this.instantiate.apply(this, g)
		},
		getInstantiator : function(k) {
			var j = this.instantiators, l;
			l = j[k];
			if (!l) {
				var h = k, g = [];
				for (h = 0; h < k; h++) {
					g.push("a[" + h + "]")
				}
				l = j[k] = new Function("c", "a", "return new c(" + g.join(",")
						+ ")");
				l.displayName = "Ext.ClassManager.instantiate" + k
			}
			return l
		},
		postprocessors : {},
		defaultPostprocessors : [],
		registerPostprocessor : function(h, k, i, g, j) {
			if (!g) {
				g = "last"
			}
			if (!i) {
				i = [ h ]
			}
			this.postprocessors[h] = {
				name : h,
				properties : i || false,
				fn : k
			};
			this.setDefaultPostprocessorPosition(h, g, j);
			return this
		},
		setDefaultPostprocessors : function(g) {
			this.defaultPostprocessors = c(g);
			return this
		},
		setDefaultPostprocessorPosition : function(h, k, j) {
			var i = this.defaultPostprocessors, g;
			if (typeof k == "string") {
				if (k === "first") {
					i.unshift(h);
					return this
				} else {
					if (k === "last") {
						i.push(h);
						return this
					}
				}
				k = (k === "after") ? 1 : -1
			}
			g = Ext.Array.indexOf(i, j);
			if (g !== -1) {
				Ext.Array.splice(i, Math.max(0, g + k), 0, h)
			}
			return this
		},
		getNamesByExpression : function(o) {
			var m = this.maps.nameToAliases, p = [], g, l, j, h, q, k, n;
			if (typeof o != "string" || o.length < 1) {
				throw new Error(
						"[Ext.ClassManager.getNamesByExpression] Expression "
								+ o + " is invalid, must be a non-empty string")
			}
			if (o.indexOf("*") !== -1) {
				o = o.replace(/\*/g, "(.*?)");
				q = new RegExp("^" + o + "$");
				for (g in m) {
					if (m.hasOwnProperty(g)) {
						j = m[g];
						if (g.search(q) !== -1) {
							p.push(g)
						} else {
							for (k = 0, n = j.length; k < n; k++) {
								l = j[k];
								if (l.search(q) !== -1) {
									p.push(g);
									break
								}
							}
						}
					}
				}
			} else {
				h = this.getNameByAlias(o);
				if (h) {
					p.push(h)
				} else {
					h = this.getNameByAlternate(o);
					if (h) {
						p.push(h)
					} else {
						p.push(o)
					}
				}
			}
			return p
		}
	};
	a.registerPostprocessor("alias", function(j, h, m) {
		var g = m.alias, k, l;
		for (k = 0, l = g.length; k < l; k++) {
			d = g[k];
			this.setAlias(h, d)
		}
	}, [ "xtype", "alias" ]);
	a.registerPostprocessor("singleton", function(h, g, j, i) {
		i.call(this, h, new g(), j);
		return false
	});
	a.registerPostprocessor("alternateClassName", function(h, g, m) {
		var k = m.alternateClassName, j, l, n;
		if (!(k instanceof Array)) {
			k = [ k ]
		}
		for (j = 0, l = k.length; j < l; j++) {
			n = k[j];
			if (typeof n != "string") {
				throw new Error("[Ext.define] Invalid alternate of: '" + n
						+ "' for class: '" + h + "'; must be a valid string")
			}
			this.set(n, g)
		}
	});
	Ext.apply(Ext, {
		create : d(a, "instantiate"),
		widget : function(h) {
			var g = f.call(arguments);
			g[0] = "widget." + h;
			return a.instantiateByAlias.apply(a, g)
		},
		createByAlias : d(a, "instantiateByAlias"),
		define : function(h, i, g) {
			if ("override" in i) {
				return a.createOverride.apply(a, arguments)
			}
			return a.create.apply(a, arguments)
		},
		getClassName : d(a, "getName"),
		getDisplayName : function(g) {
			if (g) {
				if (g.displayName) {
					return g.displayName
				}
				if (g.$name && g.$class) {
					return Ext.getClassName(g.$class) + "#" + g.$name
				}
				if (g.$className) {
					return g.$className
				}
			}
			return "Anonymous"
		},
		getClass : d(a, "getClass"),
		namespace : d(a, "createNamespaces")
	});
	Ext.createWidget = Ext.widget;
	Ext.ns = Ext.namespace;
	b.registerPreprocessor("className", function(g, h) {
		if (h.$className) {
			g.$className = h.$className;
			g.displayName = g.$className
		}
	}, true, "first");
	b
			.registerPreprocessor(
					"alias",
					function(s, m) {
						var q = s.prototype, j = c(m.xtype), g = c(m.alias), t = "widget.", r = t.length, n = Array.prototype.slice
								.call(q.xtypesChain || []), k = Ext.merge({},
								q.xtypesMap || {}), l, p, o, h;
						for (l = 0, p = g.length; l < p; l++) {
							o = g[l];
							if (typeof o != "string" || o.length < 1) {
								throw new Error(
										"[Ext.define] Invalid alias of: '" + o
												+ "' for class: '" + name
												+ "'; must be a valid string")
							}
							if (o.substring(0, r) === t) {
								h = o.substring(r);
								Ext.Array.include(j, h)
							}
						}
						s.xtype = m.xtype = j[0];
						m.xtypes = j;
						for (l = 0, p = j.length; l < p; l++) {
							h = j[l];
							if (!k[h]) {
								k[h] = true;
								n.push(h)
							}
						}
						m.xtypesChain = n;
						m.xtypesMap = k;
						Ext.Function
								.interceptAfter(
										m,
										"onClassCreated",
										function() {
											var i = q.mixins, v, u;
											for (v in i) {
												if (i.hasOwnProperty(v)) {
													u = i[v];
													j = u.xtypes;
													if (j) {
														for (l = 0, p = j.length; l < p; l++) {
															h = j[l];
															if (!k[h]) {
																k[h] = true;
																n.push(h)
															}
														}
													}
												}
											}
										});
						for (l = 0, p = j.length; l < p; l++) {
							h = j[l];
							if (typeof h != "string" || h.length < 1) {
								throw new Error(
										"[Ext.define] Invalid xtype of: '"
												+ h
												+ "' for class: '"
												+ name
												+ "'; must be a valid non-empty string")
							}
							Ext.Array.include(g, t + h)
						}
						m.alias = g
					}, [ "xtype", "alias" ])
})(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from,
		Ext.global);
(function(a, c, d, h, j, i, g, k) {
	var e = [ "extend", "mixins", "requires" ], b, f = 0;
	b = Ext.Loader = {
		isInHistory : {},
		history : [],
		config : {
			enabled : true,
			disableCaching : true,
			disableCachingParam : "_dc",
			paths : {
				Ext : "."
			}
		},
		setConfig : function(l, m) {
			if (Ext.isObject(l) && arguments.length === 1) {
				Ext.merge(this.config, l)
			} else {
				this.config[l] = (Ext.isObject(m)) ? Ext.merge(this.config[l],
						m) : m
			}
			f += 1;
			return this
		},
		getConfig : function(l) {
			if (l) {
				return this.config[l]
			}
			return this.config
		},
		setPath : d(function(l, m) {
			this.config.paths[l] = m;
			f += 1;
			return this
		}),
		addClassPathMappings : function(m) {
			var l;
			if (f == 0) {
				b.config.paths = m
			} else {
				for (l in m) {
					b.config.paths[l] = m[l]
				}
			}
			f++;
			return b
		},
		getPath : function(l) {
			var n = "", o = this.config.paths, m = this.getPrefix(l);
			if (m.length > 0) {
				if (m === l) {
					return o[m]
				}
				n = o[m];
				l = l.substring(m.length + 1)
			}
			if (n.length > 0) {
				n += "/"
			}
			return n.replace(/\/\.\//g, "/") + l.replace(/\./g, "/") + ".js"
		},
		getPrefix : function(m) {
			var o = this.config.paths, n, l = "";
			if (o.hasOwnProperty(m)) {
				return m
			}
			for (n in o) {
				if (o.hasOwnProperty(n)
						&& n + "." === m.substring(0, n.length + 1)) {
					if (n.length > l.length) {
						l = n
					}
				}
			}
			return l
		},
		require : function(n, m, l, o) {
			if (m) {
				m.call(l)
			}
		},
		syncRequire : function() {
		},
		exclude : function(m) {
			var l = this;
			return {
				require : function(p, o, n) {
					return l.require(p, o, n, m)
				},
				syncRequire : function(p, o, n) {
					return l.syncRequire(p, o, n, m)
				}
			}
		},
		onReady : function(o, n, p, l) {
			var m;
			if (p !== false && Ext.onDocumentReady) {
				m = o;
				o = function() {
					Ext.onDocumentReady(m, n, l)
				}
			}
			o.call(n)
		}
	};
	Ext
			.apply(
					b,
					{
						documentHead : typeof document != "undefined"
								&& (document.head || document
										.getElementsByTagName("head")[0]),
						isLoading : false,
						queue : [],
						isClassFileLoaded : {},
						isFileLoaded : {},
						readyListeners : [],
						optionalRequires : [],
						requiresMap : {},
						numPendingFiles : 0,
						numLoadedFiles : 0,
						hasFileLoadError : false,
						classNameToFilePathMap : {},
						syncModeEnabled : false,
						scriptElements : {},
						refreshQueue : function() {
							var l = this.queue, r = l.length, o, q, m, p, n;
							if (r === 0) {
								this.triggerReady();
								return
							}
							for (o = 0; o < r; o++) {
								q = l[o];
								if (q) {
									p = q.requires;
									n = q.references;
									if (p.length > this.numLoadedFiles) {
										continue
									}
									m = 0;
									do {
										if (a.isCreated(p[m])) {
											g(p, m, 1)
										} else {
											m++
										}
									} while (m < p.length);
									if (q.requires.length === 0) {
										g(l, o, 1);
										q.callback.call(q.scope);
										this.refreshQueue();
										break
									}
								}
							}
							return this
						},
						injectScriptElement : function(n, p, r, o) {
							var m = document.createElement("script"), q = this, l = function() {
								q.cleanupScriptElement(m);
								p.call(o)
							}, s = function() {
								q.cleanupScriptElement(m);
								r.call(o)
							};
							m.type = "text/javascript";
							m.src = n;
							m.onload = l;
							m.onerror = s;
							m.onreadystatechange = function() {
								if (this.readyState === "loaded"
										|| this.readyState === "complete") {
									l()
								}
							};
							this.documentHead.appendChild(m);
							return m
						},
						removeScriptElement : function(m) {
							var l = this.scriptElements;
							if (l[m]) {
								this.cleanupScriptElement(l[m], true);
								delete l[m]
							}
							return this
						},
						cleanupScriptElement : function(m, l) {
							m.onload = null;
							m.onreadystatechange = null;
							m.onerror = null;
							if (l) {
								this.documentHead.removeChild(m)
							}
							return this
						},
						loadScriptFile : function(m, t, p, x, l) {
							var s = this, y = this.isFileLoaded, n = this.scriptElements, w = m
									+ (this.getConfig("disableCaching") ? ("?"
											+ this
													.getConfig("disableCachingParam")
											+ "=" + Ext.Date.now())
											: ""), v, o, r, u;
							if (y[m]) {
								return this
							}
							x = x || this;
							this.isLoading = true;
							if (!l) {
								u = function() {
									p
											.call(
													x,
													"Failed loading '"
															+ m
															+ "', please verify that the file exists",
													l)
								};
								if (!Ext.isReady && Ext.onDocumentReady) {
									Ext.onDocumentReady(function() {
										if (!y[m]) {
											n[m] = s.injectScriptElement(w, t,
													u, x)
										}
									})
								} else {
									n[m] = this.injectScriptElement(w, t, u, x)
								}
							} else {
								if (typeof XMLHttpRequest != "undefined") {
									v = new XMLHttpRequest()
								} else {
									v = new ActiveXObject("Microsoft.XMLHTTP")
								}
								try {
									v.open("GET", w, false);
									v.send(null)
								} catch (q) {
									p
											.call(
													this,
													"Failed loading synchronously via XHR: '"
															+ m
															+ "'; It's likely that the file is either being loaded from a different domain or from the local file system whereby cross origin requests are not allowed due to security reasons. Use asynchronous loading with Ext.require instead.",
													l)
								}
								o = (v.status == 1223) ? 204 : v.status;
								r = v.responseText;
								if ((o >= 200 && o < 300) || o == 304
										|| (o == 0 && r.length > 0)) {
									Ext.globalEval(r + "\n//@ sourceURL=" + m);
									t.call(x)
								} else {
									p
											.call(
													this,
													"Failed loading synchronously via XHR: '"
															+ m
															+ "'; please verify that the file exists. XHR status code: "
															+ o, l)
								}
								v = null
							}
						},
						syncRequire : function() {
							var l = this.syncModeEnabled;
							if (!l) {
								this.syncModeEnabled = true
							}
							this.require.apply(this, arguments);
							if (!l) {
								this.syncModeEnabled = false
							}
							this.refreshQueue()
						},
						require : function(G, u, o, r) {
							var w = {}, n = {}, z = this.queue, D = this.classNameToFilePathMap, B = this.isClassFileLoaded, t = [], I = [], F = [], m = [], s, H, y, x, l, q, E, C, A, v, p;
							if (r) {
								r = i(r);
								for (C = 0, v = r.length; C < v; C++) {
									l = r[C];
									if (typeof l == "string" && l.length > 0) {
										t = a.getNamesByExpression(l);
										for (A = 0, p = t.length; A < p; A++) {
											w[t[A]] = true
										}
									}
								}
							}
							G = i(G);
							if (u) {
								if (u.length > 0) {
									s = function() {
										var L = [], K, M, J;
										for (K = 0, M = m.length; K < M; K++) {
											J = m[K];
											L.push(a.get(J))
										}
										return u.apply(this, L)
									}
								} else {
									s = u
								}
							} else {
								s = Ext.emptyFn
							}
							o = o || Ext.global;
							for (C = 0, v = G.length; C < v; C++) {
								x = G[C];
								if (typeof x == "string" && x.length > 0) {
									I = a.getNamesByExpression(x);
									p = I.length;
									for (A = 0; A < p; A++) {
										E = I[A];
										if (w[E] !== true) {
											m.push(E);
											if (!a.isCreated(E) && !n[E]) {
												n[E] = true;
												F.push(E)
											}
										}
									}
								}
							}
							if (F.length > 0) {
								if (!this.config.enabled) {
									throw new Error(
											"Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. Missing required class"
													+ ((F.length > 1) ? "es"
															: "")
													+ ": "
													+ F.join(", "))
								}
							} else {
								s.call(o);
								return this
							}
							H = this.syncModeEnabled;
							if (!H) {
								z.push({
									requires : F.slice(),
									callback : s,
									scope : o
								})
							}
							v = F.length;
							for (C = 0; C < v; C++) {
								q = F[C];
								y = this.getPath(q);
								if (H && B.hasOwnProperty(q)) {
									this.numPendingFiles--;
									this.removeScriptElement(y);
									delete B[q]
								}
								if (!B.hasOwnProperty(q)) {
									B[q] = false;
									D[q] = y;
									this.numPendingFiles++;
									this.loadScriptFile(y, j(this.onFileLoaded,
											[ q, y ], this), j(
											this.onFileLoadError, [ q, y ]),
											this, H)
								}
							}
							if (H) {
								s.call(o);
								if (v === 1) {
									return a.get(q)
								}
							}
							return this
						},
						onFileLoaded : function(s, m) {
							this.numLoadedFiles++;
							this.isClassFileLoaded[s] = true;
							this.isFileLoaded[m] = true;
							this.numPendingFiles--;
							if (this.numPendingFiles === 0) {
								this.refreshQueue()
							}
							if (!this.syncModeEnabled
									&& this.numPendingFiles === 0
									&& this.isLoading && !this.hasFileLoadError) {
								var p = this.queue, u = [], l = [], t, o, r, n, q;
								for (o = 0, r = p.length; o < r; o++) {
									t = p[o].requires;
									for (n = 0, q = t.length; n < q; n++) {
										if (this.isClassFileLoaded[t[n]]) {
											u.push(t[n])
										}
									}
								}
								if (u.length < 1) {
									return
								}
								u = Ext.Array.filter(Ext.Array.unique(u),
										function(v) {
											return !this.requiresMap
													.hasOwnProperty(v)
										}, this);
								for (o = 0, r = u.length; o < r; o++) {
									l.push(this.classNameToFilePathMap[u[o]])
								}
								throw new Error(
										"The following classes are not declared even if their files have been loaded: '"
												+ u.join("', '")
												+ "'. Please check the source code of their corresponding files for possible typos: '"
												+ l.join("', '"))
							}
						},
						onFileLoadError : function(n, m, l, o) {
							this.numPendingFiles--;
							this.hasFileLoadError = true;
							throw new Error("[Ext.Loader] " + l)
						},
						addOptionalRequires : function(n) {
							var p = this.optionalRequires, m, o, l;
							n = i(n);
							for (m = 0, o = n.length; m < o; m++) {
								l = n[m];
								k(p, l)
							}
							return this
						},
						triggerReady : function(m) {
							var o = this.readyListeners, n = this.optionalRequires, l;
							if (this.isLoading || m) {
								this.isLoading = false;
								if (n.length !== 0) {
									n = n.slice();
									this.optionalRequires.length = 0;
									this.require(n, j(this.triggerReady,
											[ true ], this), this);
									return this
								}
								while (o.length) {
									l = o.shift();
									l.fn.call(l.scope);
									if (this.isLoading) {
										return this
									}
								}
							}
							return this
						},
						onReady : function(o, n, p, l) {
							var m;
							if (p !== false && Ext.onDocumentReady) {
								m = o;
								o = function() {
									Ext.onDocumentReady(m, n, l)
								}
							}
							if (!this.isLoading) {
								o.call(n)
							} else {
								this.readyListeners.push({
									fn : o,
									scope : n
								})
							}
						},
						historyPush : function(m) {
							var l = this.isInHistory;
							if (m && this.isClassFileLoaded.hasOwnProperty(m)
									&& !l[m]) {
								l[m] = true;
								this.history.push(m)
							}
							return this
						}
					});
	Ext.require = h(b, "require");
	Ext.syncRequire = h(b, "syncRequire");
	Ext.exclude = h(b, "exclude");
	Ext.onReady = function(n, m, l) {
		b.onReady(n, m, true, l)
	};
	c
			.registerPreprocessor(
					"loader",
					function(B, o, A, z) {
						var w = this, u = [], v = a.getName(B), p, n, t, s, x, r, l;
						for (p = 0, t = e.length; p < t; p++) {
							r = e[p];
							if (o.hasOwnProperty(r)) {
								l = o[r];
								if (typeof l == "string") {
									u.push(l)
								} else {
									if (l instanceof Array) {
										for (n = 0, s = l.length; n < s; n++) {
											x = l[n];
											if (typeof x == "string") {
												u.push(x)
											}
										}
									} else {
										if (typeof l != "function") {
											for (n in l) {
												if (l.hasOwnProperty(n)) {
													x = l[n];
													if (typeof x == "string") {
														u.push(x)
													}
												}
											}
										}
									}
								}
							}
						}
						if (u.length === 0) {
							return
						}
						var q = [], y = b.requiresMap, m;
						if (v) {
							y[v] = u;
							if (!b.requiredByMap) {
								b.requiredByMap = {}
							}
							Ext.Array.each(u, function(C) {
								if (!b.requiredByMap[C]) {
									b.requiredByMap[C] = []
								}
								b.requiredByMap[C].push(v)
							});
							m = function(C) {
								q.push(C);
								if (y[C]) {
									if (Ext.Array.contains(y[C], v)) {
										throw new Error(
												"Deadlock detected while loading dependencies! '"
														+ v
														+ "' and '"
														+ q[1]
														+ "' mutually require each other. Path: "
														+ q.join(" -> ")
														+ " -> " + q[0])
									}
									for (p = 0, t = y[C].length; p < t; p++) {
										m(y[C][p])
									}
								}
							};
							m(v)
						}
						b
								.require(
										u,
										function() {
											for (p = 0, t = e.length; p < t; p++) {
												r = e[p];
												if (o.hasOwnProperty(r)) {
													l = o[r];
													if (typeof l == "string") {
														o[r] = a.get(l)
													} else {
														if (l instanceof Array) {
															for (n = 0, s = l.length; n < s; n++) {
																x = l[n];
																if (typeof x == "string") {
																	o[r][n] = a
																			.get(x)
																}
															}
														} else {
															if (typeof l != "function") {
																for ( var C in l) {
																	if (l
																			.hasOwnProperty(C)) {
																		x = l[C];
																		if (typeof x == "string") {
																			o[r][C] = a
																					.get(x)
																		}
																	}
																}
															}
														}
													}
												}
											}
											z.call(w, B, o, A)
										});
						return false
					}, true, "after", "className");
	a.registerPostprocessor("uses", function(o, m, s) {
		var l = i(s.uses), n = [], p, r, q;
		for (p = 0, r = l.length; p < r; p++) {
			q = l[p];
			if (typeof q == "string") {
				n.push(q)
			}
		}
		b.addOptionalRequires(n)
	});
	a.onCreated(function(l) {
		this.historyPush(l)
	}, b)
})(Ext.ClassManager, Ext.Class, Ext.Function.flexSetter, Ext.Function.alias,
		Ext.Function.pass, Ext.Array.from, Ext.Array.erase, Ext.Array.include);
(function() {
	var a = document.getElementsByTagName("script"), b = a[a.length - 1], d = b.src, c = d
			.substring(0, d.lastIndexOf("/") + 1), e = Ext.Loader;
	if (d.indexOf("src/core/class/") != -1) {
		c = c + "../../../"
	}
	e.setConfig({
		enabled : true,
		disableCaching : !/[?&](cache|breakpoint)/i.test(location.search),
		paths : {
			Ext : c + "src"
		}
	})
})();
Ext.setVersion("touch", "2.1.1");
Ext
		.apply(
				Ext,
				{
					version : Ext.getVersion("touch"),
					idSeed : 0,
					repaint : function() {
						var a = Ext.getBody().createChild(
								{
									cls : Ext.baseCSSPrefix + "mask "
											+ Ext.baseCSSPrefix
											+ "mask-transparent"
								});
						setTimeout(function() {
							a.destroy()
						}, 0)
					},
					id : function(a, b) {
						if (a && a.id) {
							return a.id
						}
						a = Ext.getDom(a) || {};
						if (a === document || a === document.documentElement) {
							a.id = "ext-application"
						} else {
							if (a === document.body) {
								a.id = "ext-viewport"
							} else {
								if (a === window) {
									a.id = "ext-window"
								}
							}
						}
						a.id = a.id || ((b || "ext-element-") + (++Ext.idSeed));
						return a.id
					},
					getBody : function() {
						if (!Ext.documentBodyElement) {
							if (!document.body) {
								throw new Error(
										"[Ext.getBody] document.body does not exist at this point")
							}
							Ext.documentBodyElement = Ext.get(document.body)
						}
						return Ext.documentBodyElement
					},
					getHead : function() {
						if (!Ext.documentHeadElement) {
							Ext.documentHeadElement = Ext
									.get(document.head
											|| document
													.getElementsByTagName("head")[0])
						}
						return Ext.documentHeadElement
					},
					getDoc : function() {
						if (!Ext.documentElement) {
							Ext.documentElement = Ext.get(document)
						}
						return Ext.documentElement
					},
					getCmp : function(a) {
						return Ext.ComponentMgr.get(a)
					},
					copyTo : function(a, b, d, c) {
						if (typeof d == "string") {
							d = d.split(/[,;\s]/)
						}
						Ext.each(d, function(e) {
							if (c || b.hasOwnProperty(e)) {
								a[e] = b[e]
							}
						}, this);
						return a
					},
					destroy : function() {
						var a = arguments, d = a.length, b, c;
						for (b = 0; b < d; b++) {
							c = a[b];
							if (c) {
								if (Ext.isArray(c)) {
									this.destroy.apply(this, c)
								} else {
									if (Ext.isFunction(c.destroy)) {
										c.destroy()
									}
								}
							}
						}
					},
					getDom : function(a) {
						if (!a || !document) {
							return null
						}
						return a.dom ? a.dom : (typeof a == "string" ? document
								.getElementById(a) : a)
					},
					removeNode : function(a) {
						if (a && a.parentNode && a.tagName != "BODY") {
							Ext.get(a).clearListeners();
							a.parentNode.removeChild(a);
							delete Ext.cache[a.id]
						}
					},
					defaultSetupConfig : {
						eventPublishers : {
							dom : {
								xclass : "Ext.event.publisher.Dom"
							},
							touchGesture : {
								xclass : "Ext.event.publisher.TouchGesture",
								recognizers : {
									drag : {
										xclass : "Ext.event.recognizer.Drag"
									},
									tap : {
										xclass : "Ext.event.recognizer.Tap"
									},
									doubleTap : {
										xclass : "Ext.event.recognizer.DoubleTap"
									},
									longPress : {
										xclass : "Ext.event.recognizer.LongPress"
									},
									swipe : {
										xclass : "Ext.event.recognizer.HorizontalSwipe"
									},
									pinch : {
										xclass : "Ext.event.recognizer.Pinch"
									},
									rotate : {
										xclass : "Ext.event.recognizer.Rotate"
									}
								}
							},
							componentDelegation : {
								xclass : "Ext.event.publisher.ComponentDelegation"
							},
							componentPaint : {
								xclass : "Ext.event.publisher.ComponentPaint"
							},
							elementPaint : {
								xclass : "Ext.event.publisher.ElementPaint"
							},
							elementSize : {
								xclass : "Ext.event.publisher.ElementSize"
							}
						},
						logger : {
							enabled : true,
							xclass : "Ext.log.Logger",
							minPriority : "deprecate",
							writers : {
								console : {
									xclass : "Ext.log.writer.Console",
									throwOnErrors : true,
									formatter : {
										xclass : "Ext.log.formatter.Default"
									}
								}
							}
						},
						animator : {
							xclass : "Ext.fx.Runner"
						},
						viewport : {
							xclass : "Ext.viewport.Viewport"
						}
					},
					isSetup : false,
					frameStartTime : +new Date(),
					setupListeners : [],
					onSetup : function(b, a) {
						if (Ext.isSetup) {
							b.call(a)
						} else {
							Ext.setupListeners.push({
								fn : b,
								scope : a
							})
						}
					},
					setup : function(s) {
						var k = Ext.defaultSetupConfig, m = Ext.emptyFn, b = s.onReady
								|| m, f = s.onUpdated || m, a = s.scope, d = Ext.Array
								.from(s.requires), l = Ext.onReady, h = Ext
								.getHead(), g, q, i;
						Ext.setup = function() {
							throw new Error(
									"Ext.setup has already been called before")
						};
						delete s.requires;
						delete s.onReady;
						delete s.onUpdated;
						delete s.scope;
						Ext.require([ "Ext.event.Dispatcher" ]);
						g = function() {
							var v = Ext.setupListeners, w = v.length, u, x;
							delete Ext.setupListeners;
							Ext.isSetup = true;
							for (u = 0; u < w; u++) {
								x = v[u];
								x.fn.call(x.scope)
							}
							Ext.onReady = l;
							Ext.onReady(b, a)
						};
						Ext.onUpdated = f;
						Ext.onReady = function(w, v) {
							var u = b;
							b = function() {
								u();
								Ext.onReady(w, v)
							}
						};
						s = Ext.merge({}, k, s);
						Ext.onDocumentReady(function() {
							Ext.factoryConfig(s, function(u) {
								Ext.event.Dispatcher.getInstance()
										.setPublishers(u.eventPublishers);
								if (u.logger) {
									Ext.Logger = u.logger
								}
								if (u.animator) {
									Ext.Animator = u.animator
								}
								if (u.viewport) {
									Ext.Viewport = q = u.viewport;
									if (!a) {
										a = q
									}
									Ext.require(d, function() {
										Ext.Viewport.on("ready", g, null, {
											single : true
										})
									})
								} else {
									Ext.require(d, g)
								}
							})
						});
						function j(u, v) {
							var w = document.createElement("meta");
							w.setAttribute("name", u);
							w.setAttribute("content", v);
							h.append(w)
						}
						function n(u, w, x) {
							var v = document.createElement("link");
							v.setAttribute("rel", "apple-touch-icon"
									+ (x ? "-precomposed" : ""));
							v.setAttribute("href", u);
							if (w) {
								v.setAttribute("sizes", w)
							}
							h.append(v)
						}
						function e(u, w) {
							var v = document.createElement("link");
							v.setAttribute("rel", "apple-touch-startup-image");
							v.setAttribute("href", u);
							if (w) {
								v.setAttribute("media", w)
							}
							h.append(v)
						}
						var p = s.icon, t = Boolean(s.isIconPrecomposed), r = s.startupImage
								|| {}, c = s.statusBarStyle, o = window.devicePixelRatio || 1;
						if (navigator.standalone) {
							j("viewport",
									"width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0")
						} else {
							j("viewport",
									"initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0")
						}
						j("apple-mobile-web-app-capable", "yes");
						j("apple-touch-fullscreen", "yes");
						if (c) {
							j("apple-mobile-web-app-status-bar-style", c)
						}
						if (Ext.isString(p)) {
							p = {
								57 : p,
								72 : p,
								114 : p,
								144 : p
							}
						} else {
							if (!p) {
								p = {}
							}
						}
						if (Ext.os.is.iPad) {
							if (o >= 2) {
								if ("1496x2048" in r) {
									e(r["1496x2048"],
											"(orientation: landscape)")
								}
								if ("1536x2008" in r) {
									e(r["1536x2008"], "(orientation: portrait)")
								}
								if ("144" in p) {
									n(p["144"], "144x144", t)
								}
							} else {
								if ("748x1024" in r) {
									e(r["748x1024"], "(orientation: landscape)")
								}
								if ("768x1004" in r) {
									e(r["768x1004"], "(orientation: portrait)")
								}
								if ("72" in p) {
									n(p["72"], "72x72", t)
								}
							}
						} else {
							if (o >= 2 && Ext.os.version.gtEq("4.3")) {
								if (Ext.os.is.iPhone5) {
									e(r["640x1096"])
								} else {
									e(r["640x920"])
								}
								if ("114" in p) {
									n(p["114"], "114x114", t)
								}
							} else {
								e(r["320x460"]);
								if ("57" in p) {
									n(p["57"], null, t)
								}
							}
						}
					},
					application : function(b) {
						var a = b.name, e, d, c;
						if (!b) {
							b = {}
						}
						if (!Ext.Loader.config.paths[a]) {
							Ext.Loader.setPath(a, b.appFolder || "app")
						}
						c = Ext.Array.from(b.requires);
						b.requires = [ "Ext.app.Application" ];
						e = b.onReady;
						d = b.scope;
						b.onReady = function() {
							b.requires = c;
							new Ext.app.Application(b);
							if (e) {
								e.call(d)
							}
						};
						Ext.setup(b)
					},
					factoryConfig : function(a, l) {
						var g = Ext.isSimpleObject(a);
						if (g && a.xclass) {
							var f = a.xclass;
							delete a.xclass;
							Ext.require(f, function() {
								Ext.factoryConfig(a, function(i) {
									l(Ext.create(f, i))
								})
							});
							return
						}
						var d = Ext.isArray(a), m = [], k, j, c, e;
						if (g || d) {
							if (g) {
								for (k in a) {
									if (a.hasOwnProperty(k)) {
										j = a[k];
										if (Ext.isSimpleObject(j)
												|| Ext.isArray(j)) {
											m.push(k)
										}
									}
								}
							} else {
								for (c = 0, e = a.length; c < e; c++) {
									j = a[c];
									if (Ext.isSimpleObject(j) || Ext.isArray(j)) {
										m.push(c)
									}
								}
							}
							c = 0;
							e = m.length;
							if (e === 0) {
								l(a);
								return
							}
							function h(i) {
								a[k] = i;
								c++;
								b()
							}
							function b() {
								if (c >= e) {
									l(a);
									return
								}
								k = m[c];
								j = a[k];
								Ext.factoryConfig(j, h)
							}
							b();
							return
						}
						l(a)
					},
					factory : function(b, e, a, f) {
						var d = Ext.ClassManager, c;
						if (!b || b.isInstance) {
							if (a && a !== b) {
								a.destroy()
							}
							return b
						}
						if (f) {
							if (typeof b == "string") {
								return d.instantiateByAlias(f + "." + b)
							} else {
								if (Ext.isObject(b) && "type" in b) {
									return d.instantiateByAlias(f + "."
											+ b.type, b)
								}
							}
						}
						if (b === true) {
							return a || d.instantiate(e)
						}
						if (!Ext.isObject(b)) {
							Ext.Logger
									.error("Invalid config, must be a valid config object")
						}
						if ("xtype" in b) {
							c = d.instantiateByAlias("widget." + b.xtype, b)
						} else {
							if ("xclass" in b) {
								c = d.instantiate(b.xclass, b)
							}
						}
						if (c) {
							if (a) {
								a.destroy()
							}
							return c
						}
						if (a) {
							return a.setConfig(b)
						}
						return d.instantiate(e, b)
					},
					deprecateClassMember : function(b, c, a, d) {
						return this.deprecateProperty(b.prototype, c, a, d)
					},
					deprecateClassMembers : function(b, c) {
						var d = b.prototype, e, a;
						for (e in c) {
							if (c.hasOwnProperty(e)) {
								a = c[e];
								this.deprecateProperty(d, e, a)
							}
						}
					},
					deprecateProperty : function(b, c, a, d) {
						if (!d) {
							d = "'" + c + "' is deprecated"
						}
						if (a) {
							d += ", please use '" + a + "' instead"
						}
						if (a) {
							Ext.Object.defineProperty(b, c, {
								get : function() {
									Ext.Logger.deprecate(d, 1);
									return this[a]
								},
								set : function(e) {
									Ext.Logger.deprecate(d, 1);
									this[a] = e
								},
								configurable : true
							})
						}
					},
					deprecatePropertyValue : function(b, a, d, c) {
						Ext.Object.defineProperty(b, a, {
							get : function() {
								Ext.Logger.deprecate(c, 1);
								return d
							},
							configurable : true
						})
					},
					deprecateMethod : function(b, a, d, c) {
						b[a] = function() {
							Ext.Logger.deprecate(c, 2);
							if (d) {
								return d.apply(this, arguments)
							}
						}
					},
					deprecateClassMethod : function(a, b, h, d) {
						if (typeof b != "string") {
							var g, f;
							for (g in b) {
								if (b.hasOwnProperty(g)) {
									f = b[g];
									Ext.deprecateClassMethod(a, g, f)
								}
							}
							return
						}
						var c = typeof h == "string", e;
						if (!d) {
							d = "'" + b + "()' is deprecated, please use '"
									+ (c ? h : h.name) + "()' instead"
						}
						if (c) {
							e = function() {
								Ext.Logger.deprecate(d, this);
								return this[h].apply(this, arguments)
							}
						} else {
							e = function() {
								Ext.Logger.deprecate(d, this);
								return h.apply(this, arguments)
							}
						}
						if (b in a.prototype) {
							Ext.Object.defineProperty(a.prototype, b, {
								value : null,
								writable : true,
								configurable : true
							})
						}
						a.addMember(b, e)
					},
					showLeaks : function() {
						var c = Ext.ComponentManager.all.map, a = [], b;
						Ext.Object.each(c, function(e, d) {
							while ((b = d.getParent())
									&& c.hasOwnProperty(b.getId())) {
								d = b
							}
							if (a.indexOf(d) === -1) {
								a.push(d)
							}
						});
						console.log(a)
					},
					isReady : false,
					readyListeners : [],
					triggerReady : function() {
						var b = Ext.readyListeners, a, c, d;
						if (!Ext.isReady) {
							Ext.isReady = true;
							for (a = 0, c = b.length; a < c; a++) {
								d = b[a];
								d.fn.call(d.scope)
							}
							delete Ext.readyListeners
						}
					},
					onDocumentReady : function(c, b) {
						if (Ext.isReady) {
							c.call(b)
						} else {
							var a = Ext.triggerReady;
							Ext.readyListeners.push({
								fn : c,
								scope : b
							});
							if (Ext.browser.is.PhoneGap && !Ext.os.is.Desktop) {
								if (!Ext.readyListenerAttached) {
									Ext.readyListenerAttached = true;
									document.addEventListener("deviceready", a,
											false)
								}
							} else {
								if (document.readyState
										.match(/interactive|complete|loaded/) !== null) {
									a()
								} else {
									if (!Ext.readyListenerAttached) {
										Ext.readyListenerAttached = true;
										window.addEventListener(
												"DOMContentLoaded", a, false)
									}
								}
							}
						}
					},
					callback : function(d, c, b, a) {
						if (Ext.isFunction(d)) {
							b = b || [];
							c = c || window;
							if (a) {
								Ext.defer(d, a, c, b)
							} else {
								d.apply(c, b)
							}
						}
					}
				});
Ext.Object.defineProperty(Ext, "Msg", {
	get : function() {
		Ext.Logger.error("Using Ext.Msg without requiring Ext.MessageBox");
		return null
	},
	set : function(a) {
		Ext.Object.defineProperty(Ext, "Msg", {
			value : a
		});
		return a
	},
	configurable : true
});
Ext
		.define(
				"Ext.env.Browser",
				{
					requires : [ "Ext.Version" ],
					statics : {
						browserNames : {
							ie : "IE",
							firefox : "Firefox",
							safari : "Safari",
							chrome : "Chrome",
							opera : "Opera",
							dolfin : "Dolfin",
							webosbrowser : "webOSBrowser",
							chromeMobile : "ChromeMobile",
							silk : "Silk",
							other : "Other"
						},
						engineNames : {
							webkit : "WebKit",
							gecko : "Gecko",
							presto : "Presto",
							trident : "Trident",
							other : "Other"
						},
						enginePrefixes : {
							webkit : "AppleWebKit/",
							gecko : "Gecko/",
							presto : "Presto/",
							trident : "Trident/"
						},
						browserPrefixes : {
							ie : "MSIE ",
							firefox : "Firefox/",
							chrome : "Chrome/",
							safari : "Version/",
							opera : "Opera/",
							dolfin : "Dolfin/",
							webosbrowser : "wOSBrowser/",
							chromeMobile : "CrMo/",
							silk : "Silk/"
						}
					},
					styleDashPrefixes : {
						WebKit : "-webkit-",
						Gecko : "-moz-",
						Trident : "-ms-",
						Presto : "-o-",
						Other : ""
					},
					stylePrefixes : {
						WebKit : "Webkit",
						Gecko : "Moz",
						Trident : "ms",
						Presto : "O",
						Other : ""
					},
					propertyPrefixes : {
						WebKit : "webkit",
						Gecko : "moz",
						Trident : "ms",
						Presto : "o",
						Other : ""
					},
					is : Ext.emptyFn,
					name : null,
					version : null,
					engineName : null,
					engineVersion : null,
					setFlag : function(a, b) {
						if (typeof b == "undefined") {
							b = true
						}
						this.is[a] = b;
						this.is[a.toLowerCase()] = b;
						return this
					},
					constructor : function(o) {
						this.userAgent = o;
						e = this.is = function(i) {
							return e[i] === true
						};
						var k = this.statics(), c = o.match(new RegExp("((?:"
								+ Ext.Object.getValues(k.browserPrefixes).join(
										")|(?:") + "))([\\w\\._]+)")), b = o
								.match(new RegExp("((?:"
										+ Ext.Object
												.getValues(k.enginePrefixes)
												.join(")|(?:")
										+ "))([\\w\\._]+)")), g = k.browserNames, j = g.other, f = k.engineNames, n = f.other, m = "", l = "", h = false, e, d, a;
						if (c) {
							j = g[Ext.Object.getKey(k.browserPrefixes, c[1])];
							m = new Ext.Version(c[2])
						}
						if (b) {
							n = f[Ext.Object.getKey(k.enginePrefixes, b[1])];
							l = new Ext.Version(b[2])
						}
						if (o.match(/FB/) && j == "Other") {
							j = g.safari;
							n = f.webkit
						}
						if (o.match(/Android.*Chrome/g)) {
							j = "ChromeMobile"
						}
						Ext.apply(this, {
							engineName : n,
							engineVersion : l,
							name : j,
							version : m
						});
						this.setFlag(j);
						if (m) {
							this.setFlag(j + (m.getMajor() || ""));
							this.setFlag(j + m.getShortVersion())
						}
						for (d in g) {
							if (g.hasOwnProperty(d)) {
								a = g[d];
								this.setFlag(a, j === a)
							}
						}
						this.setFlag(a);
						if (l) {
							this.setFlag(n + (l.getMajor() || ""));
							this.setFlag(n + l.getShortVersion())
						}
						for (d in f) {
							if (f.hasOwnProperty(d)) {
								a = f[d];
								this.setFlag(a, n === a)
							}
						}
						this.setFlag("Standalone", !!navigator.standalone);
						if (typeof window.PhoneGap != "undefined"
								|| typeof window.Cordova != "undefined"
								|| typeof window.cordova != "undefined") {
							h = true;
							this.setFlag("PhoneGap")
						} else {
							if (!!window.isNK) {
								h = true;
								this.setFlag("Sencha")
							}
						}
						if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)(?!.*FBAN)/i
								.test(o)) {
							h = true
						}
						this.setFlag("WebView", h);
						this.isStrict = document.compatMode == "CSS1Compat";
						this.isSecure = /^https/i
								.test(window.location.protocol);
						return this
					},
					getStyleDashPrefix : function() {
						return this.styleDashPrefixes[this.engineName]
					},
					getStylePrefix : function() {
						return this.stylePrefixes[this.engineName]
					},
					getVendorProperyName : function(a) {
						var b = this.propertyPrefixes[this.engineName];
						if (b.length > 0) {
							return b + Ext.String.capitalize(a)
						}
						return a
					}
				}, function() {
					var a = Ext.browser = new this(
							Ext.global.navigator.userAgent)
				});
Ext
		.define(
				"Ext.env.OS",
				{
					requires : [ "Ext.Version" ],
					statics : {
						names : {
							ios : "iOS",
							android : "Android",
							webos : "webOS",
							blackberry : "BlackBerry",
							rimTablet : "RIMTablet",
							mac : "MacOS",
							win : "Windows",
							linux : "Linux",
							bada : "Bada",
							other : "Other"
						},
						prefixes : {
							ios : "i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ",
							android : "(Android |HTC_|Silk/)",
							blackberry : "(?:BlackBerry|BB)(?:.*)Version/",
							rimTablet : "RIM Tablet OS ",
							webos : "(?:webOS|hpwOS)/",
							bada : "Bada/"
						}
					},
					is : Ext.emptyFn,
					name : null,
					version : null,
					setFlag : function(a, b) {
						if (typeof b == "undefined") {
							b = true
						}
						this.is[a] = b;
						this.is[a.toLowerCase()] = b;
						return this
					},
					constructor : function(m, b) {
						var k = this.statics(), j = k.names, c = k.prefixes, a, h = "", d, g, f, l, e;
						e = this.is = function(i) {
							return this.is[i] === true
						};
						for (d in c) {
							if (c.hasOwnProperty(d)) {
								g = c[d];
								f = m.match(new RegExp("(?:" + g
										+ ")([^\\s;]+)"));
								if (f) {
									a = j[d];
									if (f[1]
											&& (f[1] == "HTC_" || f[1] == "Silk/")) {
										h = new Ext.Version("2.3")
									} else {
										h = new Ext.Version(f[f.length - 1])
									}
									break
								}
							}
						}
						if (!a) {
							a = j[(m.toLowerCase().match(/mac|win|linux/) || [ "other" ])[0]];
							h = new Ext.Version("")
						}
						this.name = a;
						this.version = h;
						if (b) {
							this.setFlag(b.replace(/ simulator$/i, ""))
						}
						this.setFlag(a);
						if (h) {
							this.setFlag(a + (h.getMajor() || ""));
							this.setFlag(a + h.getShortVersion())
						}
						for (d in j) {
							if (j.hasOwnProperty(d)) {
								l = j[d];
								if (!e.hasOwnProperty(a)) {
									this.setFlag(l, (a === l))
								}
							}
						}
						if (this.name == "iOS" && window.screen.height == 568) {
							this.setFlag("iPhone5")
						}
						return this
					}
				},
				function() {
					var a = Ext.global.navigator, e = a.userAgent, b, g, d;
					Ext.os = b = new this(e, a.platform);
					g = b.name;
					var c = window.location.search
							.match(/deviceType=(Tablet|Phone)/), f = window.deviceType;
					if (c && c[1]) {
						d = c[1]
					} else {
						if (f === "iPhone") {
							d = "Phone"
						} else {
							if (f === "iPad") {
								d = "Tablet"
							} else {
								if (!b.is.Android && !b.is.iOS
										&& /Windows|Linux|MacOS/.test(g)) {
									d = "Desktop";
									Ext.browser.is.WebView = false
								} else {
									if (b.is.iPad
											|| b.is.RIMTablet
											|| b.is.Android3
											|| (b.is.Android4 && e
													.search(/mobile/i) == -1)) {
										d = "Tablet"
									} else {
										d = "Phone"
									}
								}
							}
						}
					}
					b.setFlag(d, true);
					b.deviceType = d
				});
Ext
		.define(
				"Ext.env.Feature",
				{
					requires : [ "Ext.env.Browser", "Ext.env.OS" ],
					constructor : function() {
						this.testElements = {};
						this.has = function(a) {
							return !!this.has[a]
						};
						return this
					},
					getTestElement : function(a, b) {
						if (a === undefined) {
							a = "div"
						} else {
							if (typeof a !== "string") {
								return a
							}
						}
						if (b) {
							return document.createElement(a)
						}
						if (!this.testElements[a]) {
							this.testElements[a] = document.createElement(a)
						}
						return this.testElements[a]
					},
					isStyleSupported : function(c, b) {
						var d = this.getTestElement(b).style, a = Ext.String
								.capitalize(c);
						if (typeof d[c] !== "undefined"
								|| typeof d[Ext.browser.getStylePrefix(c) + a] !== "undefined") {
							return true
						}
						return false
					},
					isEventSupported : function(c, a) {
						if (a === undefined) {
							a = window
						}
						var e = this.getTestElement(a), b = "on"
								+ c.toLowerCase(), d = (b in e);
						if (!d) {
							if (e.setAttribute && e.removeAttribute) {
								e.setAttribute(b, "");
								d = typeof e[b] === "function";
								if (typeof e[b] !== "undefined") {
									e[b] = undefined
								}
								e.removeAttribute(b)
							}
						}
						return d
					},
					getSupportedPropertyName : function(b, a) {
						var c = Ext.browser.getVendorProperyName(a);
						if (c in b) {
							return c
						} else {
							if (a in b) {
								return a
							}
						}
						return null
					},
					registerTest : Ext.Function.flexSetter(function(a, b) {
						this.has[a] = b.call(this);
						return this
					})
				},
				function() {
					Ext.feature = new this;
					var a = Ext.feature.has;
					Ext.feature
							.registerTest({
								Canvas : function() {
									var b = this.getTestElement("canvas");
									return !!(b && b.getContext && b
											.getContext("2d"))
								},
								Svg : function() {
									var b = document;
									return !!(b.createElementNS && !!b
											.createElementNS(
													"http://www.w3.org/2000/svg",
													"svg").createSVGRect)
								},
								Vml : function() {
									var c = this.getTestElement(), b = false;
									c.innerHTML = "<!--[if vml]><br><![endif]-->";
									b = (c.childNodes.length === 1);
									c.innerHTML = "";
									return b
								},
								Touch : function() {
									return this.isEventSupported("touchstart")
											&& !(Ext.os
													&& Ext.os.name
															.match(/Windows|MacOS|Linux/) && !Ext.os.is.BlackBerry6)
								},
								Orientation : function() {
									return ("orientation" in window)
											&& this
													.isEventSupported("orientationchange")
								},
								OrientationChange : function() {
									return this
											.isEventSupported("orientationchange")
								},
								DeviceMotion : function() {
									return this
											.isEventSupported("devicemotion")
								},
								Geolocation : function() {
									return "geolocation" in window.navigator
								},
								SqlDatabase : function() {
									return "openDatabase" in window
								},
								WebSockets : function() {
									return "WebSocket" in window
								},
								Range : function() {
									return !!document.createRange
								},
								CreateContextualFragment : function() {
									var b = !!document.createRange ? document
											.createRange() : false;
									return b && !!b.createContextualFragment
								},
								History : function() {
									return ("history" in window && "pushState" in window.history)
								},
								CssTransforms : function() {
									return this.isStyleSupported("transform")
								},
								Css3dTransforms : function() {
									return this.has("CssTransforms")
											&& this
													.isStyleSupported("perspective")
											&& !Ext.os.is.Android2
								},
								CssAnimations : function() {
									return this
											.isStyleSupported("animationName")
								},
								CssTransitions : function() {
									return this
											.isStyleSupported("transitionProperty")
								},
								Audio : function() {
									return !!this.getTestElement("audio").canPlayType
								},
								Video : function() {
									return !!this.getTestElement("video").canPlayType
								},
								ClassList : function() {
									return "classList" in this.getTestElement()
								},
								LocalStorage : function() {
									var b = false;
									try {
										if ("localStorage" in window
												&& window.localStorage !== null) {
											localStorage.setItem(
													"sencha-localstorage-test",
													"test success");
											localStorage
													.removeItem("sencha-localstorage-test");
											b = true
										}
									} catch (c) {
									}
									return b
								}
							})
				});
Ext.define("Ext.dom.Query", {
	select : function(h, b) {
		var g = [], d, f, e, c, a;
		b = b || document;
		if (typeof b == "string") {
			b = document.getElementById(b)
		}
		h = h.split(",");
		for (f = 0, c = h.length; f < c; f++) {
			if (typeof h[f] == "string") {
				if (h[f][0] == "@") {
					d = b.getAttributeNode(h[f].substring(1));
					g.push(d)
				} else {
					d = b.querySelectorAll(h[f]);
					for (e = 0, a = d.length; e < a; e++) {
						g.push(d[e])
					}
				}
			}
		}
		return g
	},
	selectNode : function(b, a) {
		return this.select(b, a)[0]
	},
	is : function(a, b) {
		if (typeof a == "string") {
			a = document.getElementById(a)
		}
		return this.select(b).indexOf(a) !== -1
	},
	isXml : function(a) {
		var b = (a ? a.ownerDocument || a : 0).documentElement;
		return b ? b.nodeName !== "HTML" : false
	}
}, function() {
	Ext.ns("Ext.core");
	Ext.core.DomQuery = Ext.DomQuery = new this();
	Ext.query = Ext.Function.alias(Ext.DomQuery, "select")
});
Ext
		.define(
				"Ext.dom.Helper",
				{
					emptyTags : /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
					confRe : /tag|children|cn|html|tpl|tplData$/i,
					endRe : /end/i,
					attribXlat : {
						cls : "class",
						htmlFor : "for"
					},
					closeTags : {},
					decamelizeName : function() {
						var c = /([a-z])([A-Z])/g, b = {};
						function a(d, f, e) {
							return f + "-" + e.toLowerCase()
						}
						return function(d) {
							return b[d] || (b[d] = d.replace(c, a))
						}
					}(),
					generateMarkup : function(d, c) {
						var g = this, b, h, a, e, f;
						if (typeof d == "string") {
							c.push(d)
						} else {
							if (Ext.isArray(d)) {
								for (e = 0; e < d.length; e++) {
									if (d[e]) {
										g.generateMarkup(d[e], c)
									}
								}
							} else {
								a = d.tag || "div";
								c.push("<", a);
								for (b in d) {
									if (d.hasOwnProperty(b)) {
										h = d[b];
										if (!g.confRe.test(b)) {
											if (typeof h == "object") {
												c.push(" ", b, '="');
												g.generateStyles(h, c)
														.push('"')
											} else {
												c.push(" ", g.attribXlat[b]
														|| b, '="', h, '"')
											}
										}
									}
								}
								if (g.emptyTags.test(a)) {
									c.push("/>")
								} else {
									c.push(">");
									if ((h = d.tpl)) {
										h.applyOut(d.tplData, c)
									}
									if ((h = d.html)) {
										c.push(h)
									}
									if ((h = d.cn || d.children)) {
										g.generateMarkup(h, c)
									}
									f = g.closeTags;
									c.push(f[a] || (f[a] = "</" + a + ">"))
								}
							}
						}
						return c
					},
					generateStyles : function(e, c) {
						var b = c || [], d;
						for (d in e) {
							if (e.hasOwnProperty(d)) {
								b.push(this.decamelizeName(d), ":", e[d], ";")
							}
						}
						return c || b.join("")
					},
					markup : function(a) {
						if (typeof a == "string") {
							return a
						}
						var b = this.generateMarkup(a, []);
						return b.join("")
					},
					applyStyles : function(a, b) {
						Ext.fly(a).applyStyles(b)
					},
					createContextualFragment : function(c) {
						var f = document.createElement("div"), a = document
								.createDocumentFragment(), b = 0, d, e;
						f.innerHTML = c;
						e = f.childNodes;
						d = e.length;
						for (; b < d; b++) {
							a.appendChild(e[b].cloneNode(true))
						}
						return a
					},
					insertHtml : function(d, a, e) {
						var h, f, i, c, b, g;
						d = d.toLowerCase();
						if (Ext.isTextNode(a)) {
							if (d == "afterbegin") {
								d = "beforebegin"
							} else {
								if (d == "beforeend") {
									d = "afterend"
								}
							}
						}
						b = d == "beforebegin";
						g = d == "afterbegin";
						f = Ext.feature.has.CreateContextualFragment ? a.ownerDocument
								.createRange()
								: undefined;
						h = "setStart"
								+ (this.endRe.test(d) ? "After" : "Before");
						if (b || d == "afterend") {
							if (f) {
								f[h](a);
								i = f.createContextualFragment(e)
							} else {
								i = this.createContextualFragment(e)
							}
							a.parentNode.insertBefore(i, b ? a : a.nextSibling);
							return a[(b ? "previous" : "next") + "Sibling"]
						} else {
							c = (g ? "first" : "last") + "Child";
							if (a.firstChild) {
								if (f) {
									f[h](a[c]);
									i = f.createContextualFragment(e)
								} else {
									i = this.createContextualFragment(e)
								}
								if (g) {
									a.insertBefore(i, a.firstChild)
								} else {
									a.appendChild(i)
								}
							} else {
								a.innerHTML = e
							}
							return a[c]
						}
					},
					insertBefore : function(a, c, b) {
						return this.doInsert(a, c, b, "beforebegin")
					},
					insertAfter : function(a, c, b) {
						return this.doInsert(a, c, b, "afterend")
					},
					insertFirst : function(a, c, b) {
						return this.doInsert(a, c, b, "afterbegin")
					},
					append : function(a, c, b) {
						return this.doInsert(a, c, b, "beforeend")
					},
					overwrite : function(a, c, b) {
						a = Ext.getDom(a);
						a.innerHTML = this.markup(c);
						return b ? Ext.get(a.firstChild) : a.firstChild
					},
					doInsert : function(b, d, c, e) {
						var a = this.insertHtml(e, Ext.getDom(b), this
								.markup(d));
						return c ? Ext.get(a, true) : a
					},
					createTemplate : function(b) {
						var a = this.markup(b);
						return new Ext.Template(a)
					}
				}, function() {
					Ext.ns("Ext.core");
					Ext.core.DomHelper = Ext.DomHelper = new this
				});
Ext.define("Ext.mixin.Identifiable", {
	statics : {
		uniqueIds : {}
	},
	isIdentifiable : true,
	mixinId : "identifiable",
	idCleanRegex : /\.|[^\w\-]/g,
	defaultIdPrefix : "ext-",
	defaultIdSeparator : "-",
	getOptimizedId : function() {
		return this.id
	},
	getUniqueId : function() {
		var f = this.id, b, d, e, a, c;
		if (!f) {
			b = this.self.prototype;
			d = this.defaultIdSeparator;
			a = Ext.mixin.Identifiable.uniqueIds;
			if (!b.hasOwnProperty("identifiablePrefix")) {
				e = this.xtype;
				if (e) {
					c = this.defaultIdPrefix + e + d
				} else {
					c = b.$className.replace(this.idCleanRegex, d)
							.toLowerCase()
							+ d
				}
				b.identifiablePrefix = c
			}
			c = this.identifiablePrefix;
			if (!a.hasOwnProperty(c)) {
				a[c] = 0
			}
			f = this.id = c + (++a[c])
		}
		this.getUniqueId = this.getOptimizedId;
		return f
	},
	setId : function(a) {
		this.id = a
	},
	getId : function() {
		var a = this.id;
		if (!a) {
			a = this.getUniqueId()
		}
		this.getId = this.getOptimizedId;
		return a
	}
});
Ext.define("Ext.dom.Element", {
	alternateClassName : "Ext.Element",
	mixins : [ "Ext.mixin.Identifiable" ],
	requires : [ "Ext.dom.Query", "Ext.dom.Helper" ],
	observableType : "element",
	xtype : "element",
	statics : {
		CREATE_ATTRIBUTES : {
			style : "style",
			className : "className",
			cls : "cls",
			classList : "classList",
			text : "text",
			hidden : "hidden",
			html : "html",
			children : "children"
		},
		create : function(c, b) {
			var f = this.CREATE_ATTRIBUTES, e, h, k, j, a, d, g;
			if (!c) {
				c = {}
			}
			if (c.isElement) {
				return c.dom
			} else {
				if ("nodeType" in c) {
					return c
				}
			}
			if (typeof c == "string") {
				return document.createTextNode(c)
			}
			k = c.tag;
			if (!k) {
				k = "div"
			}
			if (c.namespace) {
				e = document.createElementNS(c.namespace, k)
			} else {
				e = document.createElement(k)
			}
			h = e.style;
			for (a in c) {
				if (a != "tag") {
					j = c[a];
					switch (a) {
					case f.style:
						if (typeof j == "string") {
							e.setAttribute(a, j)
						} else {
							for (d in j) {
								if (j.hasOwnProperty(d)) {
									h[d] = j[d]
								}
							}
						}
						break;
					case f.className:
					case f.cls:
						e.className = j;
						break;
					case f.classList:
						e.className = j.join(" ");
						break;
					case f.text:
						e.textContent = j;
						break;
					case f.hidden:
						if (j) {
							e.style.display = "none"
						}
						break;
					case f.html:
						e.innerHTML = j;
						break;
					case f.children:
						for (d = 0, g = j.length; d < g; d++) {
							e.appendChild(this.create(j[d], true))
						}
						break;
					default:
						e.setAttribute(a, j)
					}
				}
			}
			if (b) {
				return e
			} else {
				return this.get(e)
			}
		},
		documentElement : null,
		cache : {},
		get : function(c) {
			var b = this.cache, a, d, e;
			if (!c) {
				return null
			}
			if (typeof c == "string") {
				if (b.hasOwnProperty(c)) {
					return b[c]
				}
				if (!(d = document.getElementById(c))) {
					return null
				}
				b[c] = a = new this(d);
				return a
			}
			if ("tagName" in c) {
				e = c.id;
				if (b.hasOwnProperty(e)) {
					return b[e]
				}
				a = new this(c);
				b[a.getId()] = a;
				return a
			}
			if (c.isElement) {
				return c
			}
			if (c.isComposite) {
				return c
			}
			if (Ext.isArray(c)) {
				return this.select(c)
			}
			if (c === document) {
				if (!this.documentElement) {
					this.documentElement = new this(document.documentElement);
					this.documentElement.setId("ext-application")
				}
				return this.documentElement
			}
			return null
		},
		data : function(c, b, e) {
			var a = Ext.cache, f, d;
			c = this.get(c);
			if (!c) {
				return null
			}
			f = c.id;
			d = a[f].data;
			if (!d) {
				a[f].data = d = {}
			}
			if (arguments.length == 2) {
				return d[b]
			} else {
				return (d[b] = e)
			}
		}
	},
	isElement : true,
	constructor : function(a) {
		if (typeof a == "string") {
			a = document.getElementById(a)
		}
		if (!a) {
			throw new Error(
					"Invalid domNode reference or an id of an existing domNode: "
							+ a)
		}
		this.dom = a;
		this.getUniqueId()
	},
	attach : function(a) {
		this.dom = a;
		this.id = a.id;
		return this
	},
	getUniqueId : function() {
		var b = this.id, a;
		if (!b) {
			a = this.dom;
			if (a.id.length > 0) {
				this.id = b = a.id
			} else {
				a.id = b = this.mixins.identifiable.getUniqueId.call(this)
			}
			this.self.cache[b] = this
		}
		return b
	},
	setId : function(c) {
		var a = this.id, b = this.self.cache;
		if (a) {
			delete b[a]
		}
		this.dom.id = c;
		this.id = c;
		b[c] = this;
		return this
	},
	setHtml : function(a) {
		this.dom.innerHTML = a
	},
	getHtml : function() {
		return this.dom.innerHTML
	},
	setText : function(a) {
		this.dom.textContent = a
	},
	redraw : function() {
		var b = this.dom, a = b.style;
		a.display = "none";
		b.offsetHeight;
		a.display = ""
	},
	isPainted : function() {
		var a = this.dom;
		return Boolean(a && a.offsetParent)
	},
	set : function(a, b) {
		var e = this.dom, c, d;
		for (c in a) {
			if (a.hasOwnProperty(c)) {
				d = a[c];
				if (c == "style") {
					this.applyStyles(d)
				} else {
					if (c == "cls") {
						e.className = d
					} else {
						if (b !== false) {
							if (d === undefined) {
								e.removeAttribute(c)
							} else {
								e.setAttribute(c, d)
							}
						} else {
							e[c] = d
						}
					}
				}
			}
		}
		return this
	},
	is : function(a) {
		return Ext.DomQuery.is(this.dom, a)
	},
	getValue : function(b) {
		var a = this.dom.value;
		return b ? parseInt(a, 10) : a
	},
	getAttribute : function(a, b) {
		var c = this.dom;
		return c.getAttributeNS(b, a) || c.getAttribute(b + ":" + a)
				|| c.getAttribute(a) || c[a]
	},
	setSizeState : function(d) {
		var c = [ "x-sized", "x-unsized", "x-stretched" ], a = [ true, false,
				null ], b = a.indexOf(d), e;
		if (b !== -1) {
			e = c[b];
			c.splice(b, 1);
			this.addCls(e)
		}
		this.removeCls(c);
		return this
	},
	destroy : function() {
		this.isDestroyed = true;
		var a = Ext.Element.cache, b = this.dom;
		if (b && b.parentNode && b.tagName != "BODY") {
			b.parentNode.removeChild(b)
		}
		delete a[this.id];
		delete this.dom
	}
}, function(a) {
	Ext.elements = Ext.cache = a.cache;
	this.addStatics({
		Fly : new Ext.Class({
			extend : a,
			constructor : function(b) {
				this.dom = b
			}
		}),
		_flyweights : {},
		fly : function(e, c) {
			var f = null, d = a._flyweights, b;
			c = c || "_global";
			e = Ext.getDom(e);
			if (e) {
				f = d[c] || (d[c] = new a.Fly());
				f.dom = e;
				f.isSynchronized = false;
				b = Ext.cache[e.id];
				if (b && b.isElement) {
					b.isSynchronized = false
				}
			}
			return f
		}
	});
	Ext.get = function(b) {
		return a.get.call(a, b)
	};
	Ext.fly = function() {
		return a.fly.apply(a, arguments)
	};
	Ext.ClassManager.onCreated(function() {
		a.mixin("observable", Ext.mixin.Observable)
	}, null, "Ext.mixin.Observable")
});
Ext.dom.Element.addStatics({
	numberRe : /\d+$/,
	unitRe : /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
	camelRe : /(-[a-z])/gi,
	cssRe : /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
	opacityRe : /alpha\(opacity=(.*)\)/i,
	propertyCache : {},
	defaultUnit : "px",
	borders : {
		l : "border-left-width",
		r : "border-right-width",
		t : "border-top-width",
		b : "border-bottom-width"
	},
	paddings : {
		l : "padding-left",
		r : "padding-right",
		t : "padding-top",
		b : "padding-bottom"
	},
	margins : {
		l : "margin-left",
		r : "margin-right",
		t : "margin-top",
		b : "margin-bottom"
	},
	addUnits : function(b, a) {
		if (b === "" || b == "auto" || b === undefined || b === null) {
			return b || ""
		}
		if (Ext.isNumber(b) || this.numberRe.test(b)) {
			return b + (a || this.defaultUnit || "px")
		} else {
			if (!this.unitRe.test(b)) {
				Ext.Logger.warn("Warning, size detected (" + b
						+ ") not a valid property value on Element.addUnits.");
				return b || ""
			}
		}
		return b
	},
	isAncestor : function(b, d) {
		var a = false;
		b = Ext.getDom(b);
		d = Ext.getDom(d);
		if (b && d) {
			if (b.contains) {
				return b.contains(d)
			} else {
				if (b.compareDocumentPosition) {
					return !!(b.compareDocumentPosition(d) & 16)
				} else {
					while ((d = d.parentNode)) {
						a = d == b || a
					}
				}
			}
		}
		return a
	},
	parseBox : function(b) {
		if (typeof b != "string") {
			b = b.toString()
		}
		var c = b.split(" "), a = c.length;
		if (a == 1) {
			c[1] = c[2] = c[3] = c[0]
		} else {
			if (a == 2) {
				c[2] = c[0];
				c[3] = c[1]
			} else {
				if (a == 3) {
					c[3] = c[1]
				}
			}
		}
		return {
			top : c[0] || 0,
			right : c[1] || 0,
			bottom : c[2] || 0,
			left : c[3] || 0
		}
	},
	unitizeBox : function(c, a) {
		var b = this;
		c = b.parseBox(c);
		return b.addUnits(c.top, a) + " " + b.addUnits(c.right, a) + " "
				+ b.addUnits(c.bottom, a) + " " + b.addUnits(c.left, a)
	},
	camelReplaceFn : function(b, c) {
		return c.charAt(1).toUpperCase()
	},
	normalize : function(a) {
		return this.propertyCache[a]
				|| (this.propertyCache[a] = a.replace(this.camelRe,
						this.camelReplaceFn))
	},
	fromPoint : function(a, b) {
		return Ext.get(document.elementFromPoint(a, b))
	},
	parseStyles : function(c) {
		var a = {}, b = this.cssRe, d;
		if (c) {
			b.lastIndex = 0;
			while ((d = b.exec(c))) {
				a[d[1]] = d[2]
			}
		}
		return a
	}
});
Ext.dom.Element
		.addMembers({
			appendChild : function(a) {
				this.dom.appendChild(Ext.getDom(a));
				return this
			},
			removeChild : function(a) {
				this.dom.removeChild(Ext.getDom(a));
				return this
			},
			append : function() {
				this.appendChild.apply(this, arguments)
			},
			appendTo : function(a) {
				Ext.getDom(a).appendChild(this.dom);
				return this
			},
			insertBefore : function(a) {
				a = Ext.getDom(a);
				a.parentNode.insertBefore(this.dom, a);
				return this
			},
			insertAfter : function(a) {
				a = Ext.getDom(a);
				a.parentNode.insertBefore(this.dom, a.nextSibling);
				return this
			},
			insertFirst : function(b) {
				var a = Ext.getDom(b), d = this.dom, c = d.firstChild;
				if (!c) {
					d.appendChild(a)
				} else {
					d.insertBefore(a, c)
				}
				return this
			},
			insertSibling : function(e, c, d) {
				var f = this, b, a = (c || "before").toLowerCase() == "after", g;
				if (Ext.isArray(e)) {
					g = f;
					Ext.each(e, function(h) {
						b = Ext.fly(g, "_internal").insertSibling(h, c, d);
						if (a) {
							g = b
						}
					});
					return b
				}
				e = e || {};
				if (e.nodeType || e.dom) {
					b = f.dom.parentNode.insertBefore(Ext.getDom(e),
							a ? f.dom.nextSibling : f.dom);
					if (!d) {
						b = Ext.get(b)
					}
				} else {
					if (a && !f.dom.nextSibling) {
						b = Ext.core.DomHelper.append(f.dom.parentNode, e, !d)
					} else {
						b = Ext.core.DomHelper[a ? "insertAfter"
								: "insertBefore"](f.dom, e, !d)
					}
				}
				return b
			},
			replace : function(a) {
				a = Ext.getDom(a);
				a.parentNode.replaceChild(this.dom, a);
				return this
			},
			replaceWith : function(a) {
				var b = this;
				if (a.nodeType || a.dom || typeof a == "string") {
					a = Ext.get(a);
					b.dom.parentNode.insertBefore(a, b.dom)
				} else {
					a = Ext.core.DomHelper.insertBefore(b.dom, a)
				}
				delete Ext.cache[b.id];
				Ext.removeNode(b.dom);
				b.id = Ext.id(b.dom = a);
				Ext.dom.Element.addToCache(b.isFlyweight ? new Ext.dom.Element(
						b.dom) : b);
				return b
			},
			doReplaceWith : function(a) {
				var b = this.dom;
				b.parentNode.replaceChild(Ext.getDom(a), b)
			},
			createChild : function(b, a, c) {
				b = b || {
					tag : "div"
				};
				if (a) {
					return Ext.core.DomHelper.insertBefore(a, b, c !== true)
				} else {
					return Ext.core.DomHelper[!this.dom.firstChild ? "insertFirst"
							: "append"](this.dom, b, c !== true)
				}
			},
			wrap : function(b, c) {
				var e = this.dom, f = this.self.create(b, c), d = (c) ? f
						: f.dom, a = e.parentNode;
				if (a) {
					a.insertBefore(d, e)
				}
				d.appendChild(e);
				return f
			},
			wrapAllChildren : function(a) {
				var d = this.dom, b = d.childNodes, e = this.self.create(a), c = e.dom;
				while (b.length > 0) {
					c.appendChild(d.firstChild)
				}
				d.appendChild(c);
				return e
			},
			unwrapAllChildren : function() {
				var c = this.dom, b = c.childNodes, a = c.parentNode;
				if (a) {
					while (b.length > 0) {
						a.insertBefore(c, c.firstChild)
					}
					this.destroy()
				}
			},
			unwrap : function() {
				var c = this.dom, a = c.parentNode, b;
				if (a) {
					b = a.parentNode;
					b.insertBefore(c, a);
					b.removeChild(a)
				} else {
					b = document.createDocumentFragment();
					b.appendChild(c)
				}
				return this
			},
			detach : function() {
				var a = this.dom;
				if (a && a.parentNode && a.tagName !== "BODY") {
					a.parentNode.removeChild(a)
				}
				return this
			},
			insertHtml : function(b, c, a) {
				var d = Ext.core.DomHelper.insertHtml(b, this.dom, c);
				return a ? Ext.get(d) : d
			}
		});
Ext.dom.Element
		.override({
			getX : function(a) {
				return this.getXY(a)[0]
			},
			getY : function(a) {
				return this.getXY(a)[1]
			},
			getXY : function() {
				var b = this.dom.getBoundingClientRect(), a = Math.round;
				return [ a(b.left + window.pageXOffset),
						a(b.top + window.pageYOffset) ]
			},
			getOffsetsTo : function(a) {
				var c = this.getXY(), b = Ext.fly(a, "_internal").getXY();
				return [ c[0] - b[0], c[1] - b[1] ]
			},
			setX : function(a) {
				return this.setXY([ a, this.getY() ])
			},
			setY : function(a) {
				return this.setXY([ this.getX(), a ])
			},
			setXY : function(d) {
				var b = this;
				if (arguments.length > 1) {
					d = [ d, arguments[1] ]
				}
				var c = b.translatePoints(d), a = b.dom.style;
				for (d in c) {
					if (!c.hasOwnProperty(d)) {
						continue
					}
					if (!isNaN(c[d])) {
						a[d] = c[d] + "px"
					}
				}
				return b
			},
			getLeft : function() {
				return parseInt(this.getStyle("left"), 10) || 0
			},
			getRight : function() {
				return parseInt(this.getStyle("right"), 10) || 0
			},
			getTop : function() {
				return parseInt(this.getStyle("top"), 10) || 0
			},
			getBottom : function() {
				return parseInt(this.getStyle("bottom"), 10) || 0
			},
			translatePoints : function(a, g) {
				g = isNaN(a[1]) ? g : a[1];
				a = isNaN(a[0]) ? a : a[0];
				var d = this, e = d.isStyle("position", "relative"), f = d
						.getXY(), b = parseInt(d.getStyle("left"), 10), c = parseInt(
						d.getStyle("top"), 10);
				b = !isNaN(b) ? b : (e ? 0 : d.dom.offsetLeft);
				c = !isNaN(c) ? c : (e ? 0 : d.dom.offsetTop);
				return {
					left : (a - f[0] + b),
					top : (g - f[1] + c)
				}
			},
			setBox : function(d) {
				var c = this, b = d.width, a = d.height, f = d.top, e = d.left;
				if (e !== undefined) {
					c.setLeft(e)
				}
				if (f !== undefined) {
					c.setTop(f)
				}
				if (b !== undefined) {
					c.setWidth(b)
				}
				if (a !== undefined) {
					c.setHeight(a)
				}
				return this
			},
			getBox : function(g, j) {
				var h = this, e = h.dom, c = e.offsetWidth, k = e.offsetHeight, n, f, d, a, m, i;
				if (!j) {
					n = h.getXY()
				} else {
					if (g) {
						n = [ 0, 0 ]
					} else {
						n = [ parseInt(h.getStyle("left"), 10) || 0,
								parseInt(h.getStyle("top"), 10) || 0 ]
					}
				}
				if (!g) {
					f = {
						x : n[0],
						y : n[1],
						0 : n[0],
						1 : n[1],
						width : c,
						height : k
					}
				} else {
					d = h.getBorderWidth.call(h, "l")
							+ h.getPadding.call(h, "l");
					a = h.getBorderWidth.call(h, "r")
							+ h.getPadding.call(h, "r");
					m = h.getBorderWidth.call(h, "t")
							+ h.getPadding.call(h, "t");
					i = h.getBorderWidth.call(h, "b")
							+ h.getPadding.call(h, "b");
					f = {
						x : n[0] + d,
						y : n[1] + m,
						0 : n[0] + d,
						1 : n[1] + m,
						width : c - (d + a),
						height : k - (m + i)
					}
				}
				f.left = f.x;
				f.top = f.y;
				f.right = f.x + f.width;
				f.bottom = f.y + f.height;
				return f
			},
			getPageBox : function(e) {
				var g = this, c = g.dom, j = c.offsetWidth, f = c.offsetHeight, m = g
						.getXY(), k = m[1], a = m[0] + j, i = m[1] + f, d = m[0];
				if (!c) {
					return new Ext.util.Region()
				}
				if (e) {
					return new Ext.util.Region(k, a, i, d)
				} else {
					return {
						left : d,
						top : k,
						width : j,
						height : f,
						right : a,
						bottom : i
					}
				}
			}
		});
Ext.dom.Element
		.addMembers({
			WIDTH : "width",
			HEIGHT : "height",
			MIN_WIDTH : "min-width",
			MIN_HEIGHT : "min-height",
			MAX_WIDTH : "max-width",
			MAX_HEIGHT : "max-height",
			TOP : "top",
			RIGHT : "right",
			BOTTOM : "bottom",
			LEFT : "left",
			VISIBILITY : 1,
			DISPLAY : 2,
			OFFSETS : 3,
			SEPARATOR : "-",
			trimRe : /^\s+|\s+$/g,
			wordsRe : /\w/g,
			spacesRe : /\s+/,
			styleSplitRe : /\s*(?::|;)\s*/,
			transparentRe : /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
			classNameSplitRegex : /[\s]+/,
			borders : {
				t : "border-top-width",
				r : "border-right-width",
				b : "border-bottom-width",
				l : "border-left-width"
			},
			paddings : {
				t : "padding-top",
				r : "padding-right",
				b : "padding-bottom",
				l : "padding-left"
			},
			margins : {
				t : "margin-top",
				r : "margin-right",
				b : "margin-bottom",
				l : "margin-left"
			},
			defaultUnit : "px",
			isSynchronized : false,
			synchronize : function() {
				var g = this.dom, a = {}, d = g.className, f, c, e, b;
				if (d.length > 0) {
					f = g.className.split(this.classNameSplitRegex);
					for (c = 0, e = f.length; c < e; c++) {
						b = f[c];
						a[b] = true
					}
				} else {
					f = []
				}
				this.classList = f;
				this.hasClassMap = a;
				this.isSynchronized = true;
				return this
			},
			addCls : function(j, g, k) {
				if (!j) {
					return this
				}
				if (!this.isSynchronized) {
					this.synchronize()
				}
				var e = this.dom, c = this.hasClassMap, d = this.classList, a = this.SEPARATOR, f, h, b;
				g = g ? g + a : "";
				k = k ? a + k : "";
				if (typeof j == "string") {
					j = j.split(this.spacesRe)
				}
				for (f = 0, h = j.length; f < h; f++) {
					b = g + j[f] + k;
					if (!c[b]) {
						c[b] = true;
						d.push(b)
					}
				}
				e.className = d.join(" ");
				return this
			},
			removeCls : function(j, g, k) {
				if (!j) {
					return this
				}
				if (!this.isSynchronized) {
					this.synchronize()
				}
				if (!k) {
					k = ""
				}
				var e = this.dom, c = this.hasClassMap, d = this.classList, a = this.SEPARATOR, f, h, b;
				g = g ? g + a : "";
				k = k ? a + k : "";
				if (typeof j == "string") {
					j = j.split(this.spacesRe)
				}
				for (f = 0, h = j.length; f < h; f++) {
					b = g + j[f] + k;
					if (c[b]) {
						delete c[b];
						Ext.Array.remove(d, b)
					}
				}
				e.className = d.join(" ");
				return this
			},
			replaceCls : function(b, a, c, d) {
				return this.removeCls(b, c, d).addCls(a, c, d)
			},
			hasCls : function(a) {
				if (!this.isSynchronized) {
					this.synchronize()
				}
				return this.hasClassMap.hasOwnProperty(a)
			},
			toggleCls : function(a, b) {
				if (typeof b !== "boolean") {
					b = !this.hasCls(a)
				}
				return (b) ? this.addCls(a) : this.removeCls(a)
			},
			swapCls : function(b, f, a, d) {
				if (a === undefined) {
					a = true
				}
				var e = a ? b : f, c = a ? f : b;
				if (c) {
					this.removeCls(d ? d + "-" + c : c)
				}
				if (e) {
					this.addCls(d ? d + "-" + e : e)
				}
				return this
			},
			setWidth : function(a) {
				return this.setLengthValue(this.WIDTH, a)
			},
			setHeight : function(a) {
				return this.setLengthValue(this.HEIGHT, a)
			},
			setSize : function(b, a) {
				if (Ext.isObject(b)) {
					a = b.height;
					b = b.width
				}
				this.setWidth(b);
				this.setHeight(a);
				return this
			},
			setMinWidth : function(a) {
				return this.setLengthValue(this.MIN_WIDTH, a)
			},
			setMinHeight : function(a) {
				return this.setLengthValue(this.MIN_HEIGHT, a)
			},
			setMaxWidth : function(a) {
				return this.setLengthValue(this.MAX_WIDTH, a)
			},
			setMaxHeight : function(a) {
				return this.setLengthValue(this.MAX_HEIGHT, a)
			},
			setTop : function(a) {
				return this.setLengthValue(this.TOP, a)
			},
			setRight : function(a) {
				return this.setLengthValue(this.RIGHT, a)
			},
			setBottom : function(a) {
				return this.setLengthValue(this.BOTTOM, a)
			},
			setLeft : function(a) {
				return this.setLengthValue(this.LEFT, a)
			},
			setMargin : function(b) {
				var a = this.dom.style;
				if (b || b === 0) {
					b = this.self.unitizeBox((b === true) ? 5 : b);
					a.setProperty("margin", b, "important")
				} else {
					a.removeProperty("margin-top");
					a.removeProperty("margin-right");
					a.removeProperty("margin-bottom");
					a.removeProperty("margin-left")
				}
			},
			setPadding : function(b) {
				var a = this.dom.style;
				if (b || b === 0) {
					b = this.self.unitizeBox((b === true) ? 5 : b);
					a.setProperty("padding", b, "important")
				} else {
					a.removeProperty("padding-top");
					a.removeProperty("padding-right");
					a.removeProperty("padding-bottom");
					a.removeProperty("padding-left")
				}
			},
			setBorder : function(a) {
				var b = this.dom.style;
				if (a || a === 0) {
					a = this.self.unitizeBox((a === true) ? 1 : a);
					b.setProperty("border-width", a, "important")
				} else {
					b.removeProperty("border-top-width");
					b.removeProperty("border-right-width");
					b.removeProperty("border-bottom-width");
					b.removeProperty("border-left-width")
				}
			},
			setLengthValue : function(a, c) {
				var b = this.dom.style;
				if (c === null) {
					b.removeProperty(a);
					return this
				}
				if (typeof c == "number") {
					c = c + "px"
				}
				b.setProperty(a, c, "important");
				return this
			},
			setVisible : function(b) {
				var a = this.getVisibilityMode(), c = b ? "removeCls"
						: "addCls";
				switch (a) {
				case this.VISIBILITY:
					this.removeCls([ "x-hidden-display", "x-hidden-offsets" ]);
					this[c]("x-hidden-visibility");
					break;
				case this.DISPLAY:
					this
							.removeCls([ "x-hidden-visibility",
									"x-hidden-offsets" ]);
					this[c]("x-hidden-display");
					break;
				case this.OFFSETS:
					this
							.removeCls([ "x-hidden-visibility",
									"x-hidden-display" ]);
					this[c]("x-hidden-offsets");
					break
				}
				return this
			},
			getVisibilityMode : function() {
				var b = this.dom, a = Ext.dom.Element.data(b, "visibilityMode");
				if (a === undefined) {
					Ext.dom.Element.data(b, "visibilityMode", a = this.DISPLAY)
				}
				return a
			},
			setVisibilityMode : function(a) {
				this.self.data(this.dom, "visibilityMode", a);
				return this
			},
			show : function() {
				var a = this.dom;
				if (a) {
					a.style.removeProperty("display")
				}
			},
			hide : function() {
				this.dom.style.setProperty("display", "none", "important")
			},
			setVisibility : function(a) {
				var b = this.dom.style;
				if (a) {
					b.removeProperty("visibility")
				} else {
					b.setProperty("visibility", "hidden", "important")
				}
			},
			styleHooks : {},
			addStyles : function(h, g) {
				var b = 0, f = h.match(this.wordsRe), e = 0, a = f.length, d, c;
				for (; e < a; e++) {
					d = f[e];
					c = d && parseInt(this.getStyle(g[d]), 10);
					if (c) {
						b += Math.abs(c)
					}
				}
				return b
			},
			isStyle : function(a, b) {
				return this.getStyle(a) == b
			},
			getStyleValue : function(a) {
				return this.dom.style.getPropertyValue(a)
			},
			getStyle : function(f) {
				var c = this, e = c.dom, d = c.styleHooks[f], b, a;
				if (e == document) {
					return null
				}
				if (!d) {
					c.styleHooks[f] = d = {
						name : Ext.dom.Element.normalize(f)
					}
				}
				if (d.get) {
					return d.get(e, c)
				}
				b = window.getComputedStyle(e, "");
				a = (b && b[d.name]);
				return a
			},
			setStyle : function(a, h) {
				var f = this, d = f.dom, i = f.styleHooks, b = d.style, e = Ext.valueFrom, c, g;
				if (typeof a == "string") {
					g = i[a];
					if (!g) {
						i[a] = g = {
							name : Ext.dom.Element.normalize(a)
						}
					}
					h = e(h, "");
					if (g.set) {
						g.set(d, h, f)
					} else {
						b[g.name] = h
					}
				} else {
					for (c in a) {
						if (a.hasOwnProperty(c)) {
							g = i[c];
							if (!g) {
								i[c] = g = {
									name : Ext.dom.Element.normalize(c)
								}
							}
							h = e(a[c], "");
							if (g.set) {
								g.set(d, h, f)
							} else {
								b[g.name] = h
							}
						}
					}
				}
				return f
			},
			getHeight : function(b) {
				var c = this.dom, a = b ? (c.clientHeight - this
						.getPadding("tb")) : c.offsetHeight;
				return a > 0 ? a : 0
			},
			getWidth : function(a) {
				var c = this.dom, b = a ? (c.clientWidth - this
						.getPadding("lr")) : c.offsetWidth;
				return b > 0 ? b : 0
			},
			getBorderWidth : function(a) {
				return this.addStyles(a, this.borders)
			},
			getPadding : function(a) {
				return this.addStyles(a, this.paddings)
			},
			applyStyles : function(d) {
				if (d) {
					var e = this.dom, c, b, a;
					if (typeof d == "function") {
						d = d.call()
					}
					c = typeof d;
					if (c == "string") {
						d = Ext.util.Format.trim(d).split(this.styleSplitRe);
						for (b = 0, a = d.length; b < a;) {
							e.style[Ext.dom.Element.normalize(d[b++])] = d[b++]
						}
					} else {
						if (c == "object") {
							this.setStyle(d)
						}
					}
				}
			},
			getSize : function(b) {
				var a = this.dom;
				return {
					width : Math.max(0, b ? (a.clientWidth - this
							.getPadding("lr")) : a.offsetWidth),
					height : Math.max(0, b ? (a.clientHeight - this
							.getPadding("tb")) : a.offsetHeight)
				}
			},
			repaint : function() {
				var a = this.dom;
				this.addCls(Ext.baseCSSPrefix + "repaint");
				setTimeout(function() {
					Ext.fly(a).removeCls(Ext.baseCSSPrefix + "repaint")
				}, 1);
				return this
			},
			getMargin : function(b) {
				var c = this, d = {
					t : "top",
					l : "left",
					r : "right",
					b : "bottom"
				}, e = {}, a;
				if (!b) {
					for (a in c.margins) {
						e[d[a]] = parseFloat(c.getStyle(c.margins[a])) || 0
					}
					return e
				} else {
					return c.addStyles.call(c, b, c.margins)
				}
			}
		});
Ext.dom.Element.addMembers({
	getParent : function() {
		return Ext.get(this.dom.parentNode)
	},
	getFirstChild : function() {
		return Ext.get(this.dom.firstElementChild)
	},
	contains : function(a) {
		if (!a) {
			return false
		}
		var b = Ext.getDom(a);
		return (b === this.dom) || this.self.isAncestor(this.dom, b)
	},
	findParent : function(h, g, c) {
		var e = this.dom, a = document.body, f = 0, d;
		g = g || 50;
		if (isNaN(g)) {
			d = Ext.getDom(g);
			g = Number.MAX_VALUE
		}
		while (e && e.nodeType == 1 && f < g && e != a && e != d) {
			if (Ext.DomQuery.is(e, h)) {
				return c ? Ext.get(e) : e
			}
			f++;
			e = e.parentNode
		}
		return null
	},
	findParentNode : function(d, c, a) {
		var b = Ext.fly(this.dom.parentNode, "_internal");
		return b ? b.findParent(d, c, a) : null
	},
	up : function(b, a) {
		return this.findParentNode(b, a, true)
	},
	select : function(a, b) {
		return Ext.dom.Element.select(a, this.dom, b)
	},
	query : function(a) {
		return Ext.DomQuery.select(a, this.dom)
	},
	down : function(a, b) {
		var c = Ext.DomQuery.selectNode(a, this.dom);
		return b ? c : Ext.get(c)
	},
	child : function(a, b) {
		var d, c = this, e;
		e = Ext.get(c).id;
		e = e.replace(/[\.:]/g, "\\$0");
		d = Ext.DomQuery.selectNode("#" + e + " > " + a, c.dom);
		return b ? d : Ext.get(d)
	},
	parent : function(a, b) {
		return this.matchNode("parentNode", "parentNode", a, b)
	},
	next : function(a, b) {
		return this.matchNode("nextSibling", "nextSibling", a, b)
	},
	prev : function(a, b) {
		return this.matchNode("previousSibling", "previousSibling", a, b)
	},
	first : function(a, b) {
		return this.matchNode("nextSibling", "firstChild", a, b)
	},
	last : function(a, b) {
		return this.matchNode("previousSibling", "lastChild", a, b)
	},
	matchNode : function(b, e, a, c) {
		if (!this.dom) {
			return null
		}
		var d = this.dom[e];
		while (d) {
			if (d.nodeType == 1 && (!a || Ext.DomQuery.is(d, a))) {
				return !c ? Ext.get(d) : d
			}
			d = d[b]
		}
		return null
	},
	isAncestor : function(a) {
		return this.self.isAncestor.call(this.self, this.dom, a)
	}
});
Ext
		.define(
				"Ext.dom.CompositeElementLite",
				{
					alternateClassName : [ "Ext.CompositeElementLite",
							"Ext.CompositeElement" ],
					requires : [ "Ext.dom.Element" ],
					statics : {
						importElementMethods : function() {
						}
					},
					constructor : function(b, a) {
						this.elements = [];
						this.add(b, a);
						this.el = new Ext.dom.Element.Fly()
					},
					isComposite : true,
					getElement : function(a) {
						return this.el.attach(a).synchronize()
					},
					transformElement : function(a) {
						return Ext.getDom(a)
					},
					getCount : function() {
						return this.elements.length
					},
					add : function(c, a) {
						var e = this.elements, b, d;
						if (!c) {
							return this
						}
						if (typeof c == "string") {
							c = Ext.dom.Element.selectorFunction(c, a)
						} else {
							if (c.isComposite) {
								c = c.elements
							} else {
								if (!Ext.isIterable(c)) {
									c = [ c ]
								}
							}
						}
						for (b = 0, d = c.length; b < d; ++b) {
							e.push(this.transformElement(c[b]))
						}
						return this
					},
					invoke : function(d, a) {
						var f = this.elements, e = f.length, c, b;
						for (b = 0; b < e; b++) {
							c = f[b];
							if (c) {
								Ext.dom.Element.prototype[d].apply(this
										.getElement(c), a)
							}
						}
						return this
					},
					item : function(b) {
						var c = this.elements[b], a = null;
						if (c) {
							a = this.getElement(c)
						}
						return a
					},
					addListener : function(b, h, g, f) {
						var d = this.elements, a = d.length, c, j;
						for (c = 0; c < a; c++) {
							j = d[c];
							if (j) {
								j.on(b, h, g || j, f)
							}
						}
						return this
					},
					each : function(f, d) {
						var g = this, c = g.elements, a = c.length, b, h;
						for (b = 0; b < a; b++) {
							h = c[b];
							if (h) {
								h = this.getElement(h);
								if (f.call(d || h, h, g, b) === false) {
									break
								}
							}
						}
						return g
					},
					fill : function(a) {
						var b = this;
						b.elements = [];
						b.add(a);
						return b
					},
					filter : function(a) {
						var b = [], d = this, c = Ext.isFunction(a) ? a
								: function(e) {
									return e.is(a)
								};
						d.each(function(g, e, f) {
							if (c(g, f) !== false) {
								b[b.length] = d.transformElement(g)
							}
						});
						d.elements = b;
						return d
					},
					indexOf : function(a) {
						return Ext.Array.indexOf(this.elements, this
								.transformElement(a))
					},
					replaceElement : function(e, c, a) {
						var b = !isNaN(e) ? e : this.indexOf(e), f;
						if (b > -1) {
							c = Ext.getDom(c);
							if (a) {
								f = this.elements[b];
								f.parentNode.insertBefore(c, f);
								Ext.removeNode(f)
							}
							Ext.Array.splice(this.elements, b, 1, c)
						}
						return this
					},
					clear : function() {
						this.elements = []
					},
					addElements : function(c, a) {
						if (!c) {
							return this
						}
						if (typeof c == "string") {
							c = Ext.dom.Element.selectorFunction(c, a)
						}
						var b = this.elements;
						Ext.each(c, function(d) {
							b.push(Ext.get(d))
						});
						return this
					},
					first : function() {
						return this.item(0)
					},
					last : function() {
						return this.item(this.getCount() - 1)
					},
					contains : function(a) {
						return this.indexOf(a) != -1
					},
					removeElement : function(c, e) {
						var b = this, d = this.elements, a;
						Ext.each(c, function(f) {
							if ((a = (d[f] || d[f = b.indexOf(f)]))) {
								if (e) {
									if (a.dom) {
										a.remove()
									} else {
										Ext.removeNode(a)
									}
								}
								Ext.Array.erase(d, f, 1)
							}
						});
						return this
					}
				},
				function() {
					var a = Ext.dom.Element, d = a.prototype, c = this.prototype, b;
					for (b in d) {
						if (typeof d[b] == "function") {
							(function(e) {
								c[e] = c[e] || function() {
									return this.invoke(e, arguments)
								}
							}).call(c, b)
						}
					}
					c.on = c.addListener;
					if (Ext.DomQuery) {
						a.selectorFunction = Ext.DomQuery.select
					}
					a.select = function(e, f) {
						var g;
						if (typeof e == "string") {
							g = a.selectorFunction(e, f)
						} else {
							if (e.length !== undefined) {
								g = e
							} else {
								throw new Error(
										"[Ext.select] Invalid selector specified: "
												+ e)
							}
						}
						return new Ext.CompositeElementLite(g)
					};
					Ext.select = function() {
						return a.select.apply(a, arguments)
					}
				});
Ext.ClassManager.addNameAlternateMappings({
	"Ext.data.identifier.Uuid" : [],
	"Ext.event.recognizer.MultiTouch" : [],
	"Ext.app.Profile" : [],
	"Ext.fx.Runner" : [],
	"Ext.data.proxy.Client" : [ "Ext.proxy.ClientProxy" ],
	"Ext.fx.easing.Bounce" : [],
	"Ext.data.Types" : [],
	"Ext.util.Translatable" : [],
	"Ext.app.Action" : [],
	"Ext.mixin.Templatable" : [],
	"Ext.event.recognizer.Pinch" : [],
	"Ext.device.camera.PhoneGap" : [],
	"Ext.util.Format" : [],
	"Ext.LoadMask" : [],
	"Ext.data.association.Association" : [ "Ext.data.Association" ],
	"Ext.direct.JsonProvider" : [],
	"Ext.data.identifier.Simple" : [],
	"Ext.behavior.Draggable" : [],
	"Ext.dataview.DataView" : [ "Ext.DataView" ],
	"Ext.field.Hidden" : [ "Ext.form.Hidden" ],
	"Ext.util.TranslatableGroup" : [],
	"Ext.field.Number" : [ "Ext.form.Number" ],
	"Ext.device.Connection" : [],
	"Ext.fx.Animation" : [],
	"Ext.util.Inflector" : [],
	"Ext.data.Model" : [ "Ext.data.Record" ],
	"Ext.Map" : [],
	"Ext.data.reader.Reader" : [ "Ext.data.Reader", "Ext.data.DataReader" ],
	"Ext.Sheet" : [],
	"Ext.XTemplate" : [],
	"Ext.tab.Tab" : [ "Ext.Tab" ],
	"Ext.data.NodeStore" : [],
	"Ext.form.Panel" : [ "Ext.form.FormPanel" ],
	"Ext.util.Grouper" : [],
	"Ext.util.translatable.CssPosition" : [],
	"Ext.util.paintmonitor.Abstract" : [],
	"Ext.direct.RemotingProvider" : [],
	"Ext.data.Request" : [],
	"Ext.data.NodeInterface" : [ "Ext.data.Node" ],
	"Ext.layout.Float" : [],
	"Ext.util.PositionMap" : [],
	"Ext.dataview.component.DataItem" : [],
	"Ext.data.proxy.WebStorage" : [ "Ext.data.WebStorageProxy" ],
	"Ext.log.writer.Writer" : [],
	"Ext.device.Communicator" : [],
	"Ext.util.Point" : [],
	"Ext.fx.animation.Flip" : [],
	"Ext.util.Sortable" : [],
	"Ext.fx.runner.Css" : [],
	"Ext.fx.runner.CssTransition" : [],
	"Ext.fx.layout.card.Slide" : [],
	"Ext.Anim" : [],
	"Ext.XTemplateCompiler" : [],
	"Ext.util.Wrapper" : [],
	"Ext.data.DirectStore" : [],
	"Ext.direct.Transaction" : [ "Ext.Direct.Transaction" ],
	"Ext.app.Router" : [],
	"Ext.util.Offset" : [],
	"Ext.device.device.Abstract" : [],
	"Ext.dataview.NestedList" : [ "Ext.NestedList" ],
	"Ext.mixin.Mixin" : [],
	"Ext.device.connection.Simulator" : [],
	"Ext.fx.animation.FadeOut" : [],
	"Ext.app.Route" : [],
	"Ext.event.publisher.ComponentSize" : [],
	"Ext.util.Geolocation" : [ "Ext.util.GeoLocation" ],
	"Ext.util.sizemonitor.OverflowChange" : [],
	"Ext.ComponentManager" : [ "Ext.ComponentMgr" ],
	"Ext.slider.Toggle" : [],
	"Ext.event.publisher.ElementSize" : [],
	"Ext.data.identifier.Sequential" : [],
	"Ext.tab.Bar" : [ "Ext.TabBar" ],
	"Ext.event.Dom" : [],
	"Ext.app.Application" : [],
	"Ext.AbstractComponent" : [],
	"Ext.Template" : [],
	"Ext.device.Push" : [],
	"Ext.fx.easing.BoundMomentum" : [],
	"Ext.dataview.List" : [ "Ext.List" ],
	"Ext.fx.layout.card.Scroll" : [],
	"Ext.util.translatable.Dom" : [],
	"Ext.viewport.Viewport" : [],
	"Ext.event.recognizer.VerticalSwipe" : [],
	"Ext.device.geolocation.Sencha" : [],
	"Ext.event.Event" : [ "Ext.EventObject" ],
	"Ext.behavior.Behavior" : [],
	"Ext.dataview.ListItemHeader" : [],
	"Ext.event.publisher.TouchGesture" : [],
	"Ext.data.SortTypes" : [],
	"Ext.fx.easing.EaseOut" : [],
	"Ext.event.recognizer.LongPress" : [],
	"Ext.Toolbar" : [],
	"Ext.device.notification.Sencha" : [],
	"Ext.device.contacts.Abstract" : [],
	"Ext.device.push.Sencha" : [],
	"Ext.fx.animation.WipeOut" : [],
	"Ext.data.ArrayStore" : [],
	"Ext.slider.Slider" : [],
	"Ext.Component" : [ "Ext.lib.Component" ],
	"Ext.device.communicator.Default" : [],
	"Ext.fx.runner.CssAnimation" : [],
	"Ext.event.recognizer.Rotate" : [],
	"Ext.event.publisher.ComponentPaint" : [],
	"Ext.fx.layout.card.Flip" : [],
	"Ext.mixin.Sortable" : [],
	"Ext.util.TranslatableList" : [],
	"Ext.carousel.Item" : [],
	"Ext.fx.animation.Cube" : [],
	"Ext.event.recognizer.Swipe" : [],
	"Ext.util.translatable.ScrollPosition" : [],
	"Ext.device.device.Simulator" : [],
	"Ext.device.camera.Simulator" : [],
	"Ext.Ajax" : [],
	"Ext.dataview.component.ListItem" : [],
	"Ext.util.Filter" : [],
	"Ext.layout.wrapper.Inner" : [],
	"Ext.event.recognizer.Touch" : [],
	"Ext.plugin.ListPaging" : [],
	"Ext.mixin.Observable" : [ "Ext.util.Observable" ],
	"Ext.carousel.Infinite" : [],
	"Ext.device.geolocation.Simulator" : [],
	"Ext.data.association.BelongsTo" : [ "Ext.data.BelongsToAssociation" ],
	"Ext.Mask" : [],
	"Ext.event.publisher.Publisher" : [],
	"Ext.scroll.indicator.ScrollPosition" : [],
	"Ext.layout.wrapper.Dock" : [],
	"Ext.app.History" : [],
	"Ext.data.proxy.Direct" : [ "Ext.data.DirectProxy" ],
	"Ext.field.Email" : [ "Ext.form.Email" ],
	"Ext.fx.layout.card.Abstract" : [],
	"Ext.event.Controller" : [],
	"Ext.dataview.component.Container" : [],
	"Ext.data.proxy.Sql" : [ "Ext.data.proxy.SQL" ],
	"Ext.table.Cell" : [],
	"Ext.log.writer.Remote" : [],
	"Ext.fx.layout.card.ScrollCover" : [],
	"Ext.device.orientation.Sencha" : [],
	"Ext.device.purchases.Sencha" : [],
	"Ext.fx.layout.card.Style" : [],
	"Ext.viewport.Android" : [],
	"Ext.util.Droppable" : [],
	"Ext.log.formatter.Identity" : [],
	"Ext.picker.Picker" : [ "Ext.Picker" ],
	"Ext.device.Purchases.Product" : [],
	"Ext.data.Batch" : [],
	"Ext.device.Orientation" : [],
	"Ext.direct.Provider" : [],
	"Ext.util.Draggable" : [],
	"Ext.device.contacts.Sencha" : [],
	"Ext.field.File" : [],
	"Ext.tab.Panel" : [ "Ext.TabPanel" ],
	"Ext.scroll.indicator.Throttled" : [],
	"Ext.mixin.Traversable" : [],
	"Ext.util.AbstractMixedCollection" : [],
	"Ext.device.connection.Sencha" : [],
	"Ext.fx.animation.SlideOut" : [],
	"Ext.data.JsonStore" : [],
	"Ext.fx.layout.card.Pop" : [],
	"Ext.direct.RemotingEvent" : [],
	"Ext.plugin.PullRefresh" : [],
	"Ext.log.writer.Console" : [],
	"Ext.field.Spinner" : [ "Ext.form.Spinner" ],
	"Ext.data.proxy.LocalStorage" : [ "Ext.data.LocalStorageProxy" ],
	"Ext.fx.animation.Wipe" : [ "Ext.fx.animation.WipeIn" ],
	"Ext.data.Field" : [],
	"Ext.fx.layout.Card" : [],
	"Ext.Label" : [],
	"Ext.TaskQueue" : [],
	"Ext.data.StoreManager" : [ "Ext.StoreMgr", "Ext.data.StoreMgr",
			"Ext.StoreManager" ],
	"Ext.fx.animation.PopOut" : [],
	"Ext.util.translatable.CssTransform" : [],
	"Ext.viewport.Ios" : [],
	"Ext.device.push.Abstract" : [],
	"Ext.util.DelayedTask" : [],
	"Ext.Spacer" : [],
	"Ext.fx.easing.Momentum" : [],
	"Ext.mixin.Selectable" : [],
	"Ext.fx.easing.Abstract" : [],
	"Ext.event.recognizer.Drag" : [],
	"Ext.Title" : [],
	"Ext.field.TextArea" : [ "Ext.form.TextArea" ],
	"Ext.data.proxy.Rest" : [ "Ext.data.RestProxy" ],
	"Ext.fx.Easing" : [],
	"Ext.Img" : [],
	"Ext.picker.Date" : [ "Ext.DatePicker" ],
	"Ext.data.reader.Array" : [ "Ext.data.ArrayReader" ],
	"Ext.log.writer.DocumentTitle" : [],
	"Ext.data.proxy.JsonP" : [ "Ext.data.ScriptTagProxy" ],
	"Ext.data.Error" : [],
	"Ext.util.Sorter" : [],
	"Ext.device.communicator.Android" : [],
	"Ext.layout.Abstract" : [],
	"Ext.device.notification.Abstract" : [],
	"Ext.log.filter.Filter" : [],
	"Ext.device.device.PhoneGap" : [],
	"Ext.device.camera.Sencha" : [],
	"Ext.field.Checkbox" : [ "Ext.form.Checkbox" ],
	"Ext.Media" : [],
	"Ext.TitleBar" : [],
	"Ext.field.Slider" : [ "Ext.form.Slider" ],
	"Ext.field.Search" : [ "Ext.form.Search" ],
	"Ext.device.Device" : [],
	"Ext.util.TapRepeater" : [],
	"Ext.event.Touch" : [],
	"Ext.event.Dispatcher" : [],
	"Ext.data.Store" : [],
	"Ext.behavior.Translatable" : [],
	"Ext.direct.Manager" : [ "Ext.Direct" ],
	"Ext.mixin.Bindable" : [],
	"Ext.data.proxy.Proxy" : [ "Ext.data.DataProxy", "Ext.data.Proxy" ],
	"Ext.data.proxy.Server" : [ "Ext.data.ServerProxy" ],
	"Ext.util.sizemonitor.Scroll" : [],
	"Ext.navigation.View" : [ "Ext.NavigationView" ],
	"Ext.data.ResultSet" : [],
	"Ext.data.association.HasMany" : [ "Ext.data.HasManyAssociation" ],
	"Ext.device.Notification" : [],
	"Ext.layout.VBox" : [],
	"Ext.data.proxy.Ajax" : [ "Ext.data.HttpProxy", "Ext.data.AjaxProxy" ],
	"Ext.slider.Thumb" : [],
	"Ext.MessageBox" : [],
	"Ext.layout.Default" : [],
	"Ext.fx.animation.Fade" : [ "Ext.fx.animation.FadeIn" ],
	"Ext.util.paintmonitor.CssAnimation" : [],
	"Ext.event.recognizer.Recognizer" : [],
	"Ext.data.writer.Writer" : [ "Ext.data.DataWriter", "Ext.data.Writer" ],
	"Ext.form.FieldSet" : [],
	"Ext.scroll.Indicator" : [ "Ext.util.Indicator" ],
	"Ext.behavior.Scrollable" : [],
	"Ext.XTemplateParser" : [],
	"Ext.dataview.IndexBar" : [ "Ext.IndexBar" ],
	"Ext.dataview.element.List" : [],
	"Ext.layout.FlexBox" : [],
	"Ext.data.JsonP" : [ "Ext.util.JSONP" ],
	"Ext.device.connection.PhoneGap" : [],
	"Ext.event.publisher.Dom" : [],
	"Ext.field.Url" : [ "Ext.form.Url" ],
	"Ext.data.proxy.Memory" : [ "Ext.data.MemoryProxy" ],
	"Ext.layout.Card" : [],
	"Ext.fx.layout.card.Fade" : [],
	"Ext.ComponentQuery" : [],
	"Ext.app.Controller" : [],
	"Ext.fx.State" : [],
	"Ext.device.camera.Abstract" : [],
	"Ext.layout.wrapper.BoxDock" : [],
	"Ext.device.device.Sencha" : [],
	"Ext.viewport.Default" : [],
	"Ext.layout.HBox" : [],
	"Ext.scroll.View" : [ "Ext.util.ScrollView" ],
	"Ext.util.Region" : [],
	"Ext.field.Select" : [ "Ext.form.Select" ],
	"Ext.ItemCollection" : [],
	"Ext.log.formatter.Default" : [],
	"Ext.navigation.Bar" : [],
	"Ext.scroll.indicator.Default" : [],
	"Ext.data.ModelManager" : [ "Ext.ModelMgr", "Ext.ModelManager" ],
	"Ext.data.Validations" : [ "Ext.data.validations" ],
	"Ext.util.translatable.Abstract" : [],
	"Ext.scroll.indicator.Abstract" : [],
	"Ext.Button" : [],
	"Ext.device.Geolocation" : [],
	"Ext.field.Radio" : [ "Ext.form.Radio" ],
	"Ext.data.proxy.SessionStorage" : [ "Ext.data.SessionStorageProxy" ],
	"Ext.util.HashMap" : [],
	"Ext.field.Input" : [],
	"Ext.fx.easing.EaseIn" : [],
	"Ext.field.Password" : [ "Ext.form.Password" ],
	"Ext.direct.RemotingMethod" : [],
	"Ext.direct.Event" : [],
	"Ext.device.connection.Abstract" : [],
	"Ext.device.Camera" : [],
	"Ext.mixin.Filterable" : [],
	"Ext.Evented" : [ "Ext.EventedBase" ],
	"Ext.dataview.element.Container" : [],
	"Ext.carousel.Indicator" : [ "Ext.Carousel.Indicator" ],
	"Ext.util.Collection" : [],
	"Ext.data.Connection" : [],
	"Ext.carousel.Carousel" : [ "Ext.Carousel" ],
	"Ext.device.Contacts" : [],
	"Ext.Audio" : [],
	"Ext.direct.ExceptionEvent" : [],
	"Ext.Panel" : [ "Ext.lib.Panel" ],
	"Ext.device.geolocation.Abstract" : [],
	"Ext.data.association.HasOne" : [ "Ext.data.HasOneAssociation" ],
	"Ext.table.Table" : [],
	"Ext.ActionSheet" : [],
	"Ext.layout.Box" : [],
	"Ext.bb.CrossCut" : [],
	"Ext.data.Errors" : [],
	"Ext.Video" : [],
	"Ext.field.Text" : [ "Ext.form.Text" ],
	"Ext.fx.layout.card.Cube" : [],
	"Ext.event.recognizer.HorizontalSwipe" : [],
	"Ext.data.writer.Json" : [ "Ext.data.JsonWriter" ],
	"Ext.layout.Fit" : [],
	"Ext.field.TextAreaInput" : [],
	"Ext.fx.animation.Slide" : [ "Ext.fx.animation.SlideIn" ],
	"Ext.field.DatePicker" : [ "Ext.form.DatePicker" ],
	"Ext.device.Purchases.Purchase" : [],
	"Ext.event.recognizer.Tap" : [],
	"Ext.table.Row" : [],
	"Ext.log.formatter.Formatter" : [],
	"Ext.device.orientation.Abstract" : [],
	"Ext.Container" : [ "Ext.lib.Container" ],
	"Ext.fx.animation.Pop" : [ "Ext.fx.animation.PopIn" ],
	"Ext.AbstractManager" : [],
	"Ext.fx.layout.card.Reveal" : [],
	"Ext.fx.layout.card.Cover" : [],
	"Ext.log.Base" : [],
	"Ext.scroll.indicator.CssTransform" : [],
	"Ext.util.PaintMonitor" : [],
	"Ext.direct.PollingProvider" : [],
	"Ext.event.publisher.ElementPaint" : [],
	"Ext.data.reader.Xml" : [ "Ext.data.XmlReader" ],
	"Ext.device.notification.PhoneGap" : [],
	"Ext.data.writer.Xml" : [ "Ext.data.XmlWriter" ],
	"Ext.event.recognizer.SingleTouch" : [],
	"Ext.data.reader.Json" : [ "Ext.data.JsonReader" ],
	"Ext.Decorator" : [],
	"Ext.data.TreeStore" : [],
	"Ext.event.publisher.ComponentDelegation" : [],
	"Ext.device.Purchases" : [],
	"Ext.device.orientation.HTML5" : [],
	"Ext.event.recognizer.DoubleTap" : [],
	"Ext.log.Logger" : [],
	"Ext.field.Toggle" : [ "Ext.form.Toggle" ],
	"Ext.picker.Slot" : [ "Ext.Picker.Slot" ],
	"Ext.fx.layout.card.ScrollReveal" : [],
	"Ext.data.Operation" : [],
	"Ext.device.notification.Simulator" : [],
	"Ext.fx.animation.Abstract" : [],
	"Ext.field.Field" : [ "Ext.form.Field" ],
	"Ext.log.filter.Priority" : [],
	"Ext.util.sizemonitor.Abstract" : [],
	"Ext.util.paintmonitor.OverflowChange" : [],
	"Ext.scroll.Scroller" : [],
	"Ext.util.SizeMonitor" : [],
	"Ext.util.LineSegment" : [],
	"Ext.event.ListenerStack" : [],
	"Ext.SegmentedButton" : [],
	"Ext.util.MixedCollection" : [],
	"Ext.fx.easing.Linear" : [],
	"Ext.Sortable" : [],
	"Ext.dom.CompositeElement" : [ "Ext.CompositeElement" ]
});
Ext.ClassManager.addNameAliasMappings({
	"Ext.data.identifier.Uuid" : [ "data.identifier.uuid" ],
	"Ext.event.recognizer.MultiTouch" : [],
	"Ext.app.Profile" : [],
	"Ext.fx.Runner" : [],
	"Ext.data.proxy.Client" : [],
	"Ext.fx.easing.Bounce" : [],
	"Ext.data.Types" : [],
	"Ext.util.Translatable" : [],
	"Ext.app.Action" : [],
	"Ext.mixin.Templatable" : [],
	"Ext.event.recognizer.Pinch" : [],
	"Ext.device.camera.PhoneGap" : [],
	"Ext.util.Format" : [],
	"Ext.LoadMask" : [ "widget.loadmask" ],
	"Ext.data.association.Association" : [],
	"Ext.direct.JsonProvider" : [ "direct.jsonprovider" ],
	"Ext.data.identifier.Simple" : [ "data.identifier.simple" ],
	"Ext.behavior.Draggable" : [],
	"Ext.dataview.DataView" : [ "widget.dataview" ],
	"Ext.field.Hidden" : [ "widget.hiddenfield" ],
	"Ext.util.TranslatableGroup" : [],
	"Ext.field.Number" : [ "widget.numberfield" ],
	"Ext.device.Connection" : [],
	"Ext.fx.Animation" : [],
	"Ext.util.Inflector" : [],
	"Ext.data.Model" : [],
	"Ext.Map" : [ "widget.map" ],
	"Ext.data.reader.Reader" : [],
	"Ext.Sheet" : [ "widget.sheet" ],
	"Ext.XTemplate" : [],
	"Ext.tab.Tab" : [ "widget.tab" ],
	"Ext.data.NodeStore" : [ "store.node" ],
	"Ext.form.Panel" : [ "widget.formpanel" ],
	"Ext.util.Grouper" : [],
	"Ext.util.translatable.CssPosition" : [],
	"Ext.util.paintmonitor.Abstract" : [],
	"Ext.direct.RemotingProvider" : [ "direct.remotingprovider" ],
	"Ext.data.Request" : [],
	"Ext.data.NodeInterface" : [],
	"Ext.layout.Float" : [ "layout.float" ],
	"Ext.util.PositionMap" : [],
	"Ext.dataview.component.DataItem" : [ "widget.dataitem" ],
	"Ext.data.proxy.WebStorage" : [],
	"Ext.log.writer.Writer" : [],
	"Ext.device.Communicator" : [],
	"Ext.util.Point" : [],
	"Ext.fx.animation.Flip" : [ "animation.flip" ],
	"Ext.util.Sortable" : [],
	"Ext.fx.runner.Css" : [],
	"Ext.fx.runner.CssTransition" : [],
	"Ext.fx.layout.card.Slide" : [ "fx.layout.card.slide" ],
	"Ext.Anim" : [],
	"Ext.XTemplateCompiler" : [],
	"Ext.util.Wrapper" : [],
	"Ext.data.DirectStore" : [ "store.direct" ],
	"Ext.direct.Transaction" : [ "direct.transaction" ],
	"Ext.app.Router" : [],
	"Ext.util.Offset" : [],
	"Ext.device.device.Abstract" : [],
	"Ext.dataview.NestedList" : [ "widget.nestedlist" ],
	"Ext.mixin.Mixin" : [],
	"Ext.device.connection.Simulator" : [],
	"Ext.fx.animation.FadeOut" : [ "animation.fadeOut" ],
	"Ext.app.Route" : [],
	"Ext.event.publisher.ComponentSize" : [],
	"Ext.util.Geolocation" : [],
	"Ext.util.sizemonitor.OverflowChange" : [],
	"Ext.ComponentManager" : [],
	"Ext.slider.Toggle" : [],
	"Ext.event.publisher.ElementSize" : [],
	"Ext.data.identifier.Sequential" : [ "data.identifier.sequential" ],
	"Ext.tab.Bar" : [ "widget.tabbar" ],
	"Ext.event.Dom" : [],
	"Ext.app.Application" : [],
	"Ext.AbstractComponent" : [],
	"Ext.Template" : [],
	"Ext.device.Push" : [],
	"Ext.fx.easing.BoundMomentum" : [],
	"Ext.dataview.List" : [ "widget.list" ],
	"Ext.fx.layout.card.Scroll" : [ "fx.layout.card.scroll" ],
	"Ext.util.translatable.Dom" : [],
	"Ext.viewport.Viewport" : [],
	"Ext.event.recognizer.VerticalSwipe" : [],
	"Ext.device.geolocation.Sencha" : [],
	"Ext.event.Event" : [],
	"Ext.behavior.Behavior" : [],
	"Ext.dataview.ListItemHeader" : [ "widget.listitemheader" ],
	"Ext.event.publisher.TouchGesture" : [],
	"Ext.data.SortTypes" : [],
	"Ext.fx.easing.EaseOut" : [ "easing.ease-out" ],
	"Ext.event.recognizer.LongPress" : [],
	"Ext.Toolbar" : [ "widget.toolbar" ],
	"Ext.device.notification.Sencha" : [],
	"Ext.device.contacts.Abstract" : [],
	"Ext.device.push.Sencha" : [],
	"Ext.fx.animation.WipeOut" : [],
	"Ext.data.ArrayStore" : [ "store.array" ],
	"Ext.slider.Slider" : [ "widget.slider" ],
	"Ext.Component" : [ "widget.component" ],
	"Ext.device.communicator.Default" : [],
	"Ext.fx.runner.CssAnimation" : [],
	"Ext.event.recognizer.Rotate" : [],
	"Ext.event.publisher.ComponentPaint" : [],
	"Ext.fx.layout.card.Flip" : [ "fx.layout.card.flip" ],
	"Ext.mixin.Sortable" : [],
	"Ext.util.TranslatableList" : [],
	"Ext.carousel.Item" : [],
	"Ext.fx.animation.Cube" : [ "animation.cube" ],
	"Ext.event.recognizer.Swipe" : [],
	"Ext.util.translatable.ScrollPosition" : [],
	"Ext.device.device.Simulator" : [],
	"Ext.device.camera.Simulator" : [],
	"Ext.Ajax" : [],
	"Ext.dataview.component.ListItem" : [ "widget.listitem" ],
	"Ext.util.Filter" : [],
	"Ext.layout.wrapper.Inner" : [],
	"Ext.event.recognizer.Touch" : [],
	"Ext.plugin.ListPaging" : [ "plugin.listpaging" ],
	"Ext.mixin.Observable" : [],
	"Ext.carousel.Infinite" : [],
	"Ext.device.geolocation.Simulator" : [],
	"Ext.data.association.BelongsTo" : [ "association.belongsto" ],
	"Ext.Mask" : [ "widget.mask" ],
	"Ext.event.publisher.Publisher" : [],
	"Ext.scroll.indicator.ScrollPosition" : [],
	"Ext.layout.wrapper.Dock" : [],
	"Ext.app.History" : [],
	"Ext.data.proxy.Direct" : [ "proxy.direct" ],
	"Ext.field.Email" : [ "widget.emailfield" ],
	"Ext.fx.layout.card.Abstract" : [],
	"Ext.event.Controller" : [],
	"Ext.dataview.component.Container" : [],
	"Ext.data.proxy.Sql" : [ "proxy.sql" ],
	"Ext.table.Cell" : [ "widget.tablecell" ],
	"Ext.log.writer.Remote" : [],
	"Ext.fx.layout.card.ScrollCover" : [ "fx.layout.card.scrollcover" ],
	"Ext.device.orientation.Sencha" : [],
	"Ext.device.purchases.Sencha" : [],
	"Ext.fx.layout.card.Style" : [],
	"Ext.viewport.Android" : [],
	"Ext.util.Droppable" : [],
	"Ext.log.formatter.Identity" : [],
	"Ext.picker.Picker" : [ "widget.picker" ],
	"Ext.device.Purchases.Product" : [],
	"Ext.data.Batch" : [],
	"Ext.device.Orientation" : [],
	"Ext.direct.Provider" : [ "direct.provider" ],
	"Ext.util.Draggable" : [],
	"Ext.device.contacts.Sencha" : [],
	"Ext.field.File" : [ "widget.file" ],
	"Ext.tab.Panel" : [ "widget.tabpanel" ],
	"Ext.scroll.indicator.Throttled" : [],
	"Ext.mixin.Traversable" : [],
	"Ext.util.AbstractMixedCollection" : [],
	"Ext.device.connection.Sencha" : [],
	"Ext.fx.animation.SlideOut" : [ "animation.slideOut" ],
	"Ext.data.JsonStore" : [ "store.json" ],
	"Ext.fx.layout.card.Pop" : [ "fx.layout.card.pop" ],
	"Ext.direct.RemotingEvent" : [ "direct.rpc" ],
	"Ext.plugin.PullRefresh" : [ "plugin.pullrefresh" ],
	"Ext.log.writer.Console" : [],
	"Ext.field.Spinner" : [ "widget.spinnerfield" ],
	"Ext.data.proxy.LocalStorage" : [ "proxy.localstorage" ],
	"Ext.fx.animation.Wipe" : [],
	"Ext.data.Field" : [ "data.field" ],
	"Ext.fx.layout.Card" : [],
	"Ext.Label" : [ "widget.label" ],
	"Ext.TaskQueue" : [],
	"Ext.data.StoreManager" : [],
	"Ext.fx.animation.PopOut" : [ "animation.popOut" ],
	"Ext.util.translatable.CssTransform" : [],
	"Ext.viewport.Ios" : [],
	"Ext.device.push.Abstract" : [],
	"Ext.util.DelayedTask" : [],
	"Ext.Spacer" : [ "widget.spacer" ],
	"Ext.fx.easing.Momentum" : [],
	"Ext.mixin.Selectable" : [],
	"Ext.fx.easing.Abstract" : [],
	"Ext.event.recognizer.Drag" : [],
	"Ext.Title" : [ "widget.title" ],
	"Ext.field.TextArea" : [ "widget.textareafield" ],
	"Ext.data.proxy.Rest" : [ "proxy.rest" ],
	"Ext.fx.Easing" : [],
	"Ext.Img" : [ "widget.img", "widget.image" ],
	"Ext.picker.Date" : [ "widget.datepicker" ],
	"Ext.data.reader.Array" : [ "reader.array" ],
	"Ext.log.writer.DocumentTitle" : [],
	"Ext.data.proxy.JsonP" : [ "proxy.jsonp", "proxy.scripttag" ],
	"Ext.data.Error" : [],
	"Ext.util.Sorter" : [],
	"Ext.device.communicator.Android" : [],
	"Ext.layout.Abstract" : [],
	"Ext.device.notification.Abstract" : [],
	"Ext.log.filter.Filter" : [],
	"Ext.device.device.PhoneGap" : [],
	"Ext.device.camera.Sencha" : [],
	"Ext.field.Checkbox" : [ "widget.checkboxfield" ],
	"Ext.Media" : [ "widget.media" ],
	"Ext.TitleBar" : [ "widget.titlebar" ],
	"Ext.field.Slider" : [ "widget.sliderfield" ],
	"Ext.field.Search" : [ "widget.searchfield" ],
	"Ext.device.Device" : [],
	"Ext.util.TapRepeater" : [],
	"Ext.event.Touch" : [],
	"Ext.event.Dispatcher" : [],
	"Ext.data.Store" : [ "store.store" ],
	"Ext.behavior.Translatable" : [],
	"Ext.direct.Manager" : [],
	"Ext.mixin.Bindable" : [],
	"Ext.data.proxy.Proxy" : [ "proxy.proxy" ],
	"Ext.data.proxy.Server" : [ "proxy.server" ],
	"Ext.util.sizemonitor.Scroll" : [],
	"Ext.navigation.View" : [ "widget.navigationview" ],
	"Ext.data.ResultSet" : [],
	"Ext.data.association.HasMany" : [ "association.hasmany" ],
	"Ext.device.Notification" : [],
	"Ext.layout.VBox" : [ "layout.vbox" ],
	"Ext.data.proxy.Ajax" : [ "proxy.ajax" ],
	"Ext.slider.Thumb" : [ "widget.thumb" ],
	"Ext.MessageBox" : [],
	"Ext.layout.Default" : [ "layout.default", "layout.auto" ],
	"Ext.fx.animation.Fade" : [ "animation.fade", "animation.fadeIn" ],
	"Ext.util.paintmonitor.CssAnimation" : [],
	"Ext.event.recognizer.Recognizer" : [],
	"Ext.data.writer.Writer" : [ "writer.base" ],
	"Ext.form.FieldSet" : [ "widget.fieldset" ],
	"Ext.scroll.Indicator" : [],
	"Ext.behavior.Scrollable" : [],
	"Ext.XTemplateParser" : [],
	"Ext.dataview.IndexBar" : [],
	"Ext.dataview.element.List" : [],
	"Ext.layout.FlexBox" : [ "layout.box" ],
	"Ext.data.JsonP" : [],
	"Ext.device.connection.PhoneGap" : [],
	"Ext.event.publisher.Dom" : [],
	"Ext.field.Url" : [ "widget.urlfield" ],
	"Ext.data.proxy.Memory" : [ "proxy.memory" ],
	"Ext.layout.Card" : [ "layout.card" ],
	"Ext.fx.layout.card.Fade" : [ "fx.layout.card.fade" ],
	"Ext.ComponentQuery" : [],
	"Ext.app.Controller" : [],
	"Ext.fx.State" : [],
	"Ext.device.camera.Abstract" : [],
	"Ext.layout.wrapper.BoxDock" : [],
	"Ext.device.device.Sencha" : [],
	"Ext.viewport.Default" : [ "widget.viewport" ],
	"Ext.layout.HBox" : [ "layout.hbox" ],
	"Ext.scroll.View" : [],
	"Ext.util.Region" : [],
	"Ext.field.Select" : [ "widget.selectfield" ],
	"Ext.ItemCollection" : [],
	"Ext.log.formatter.Default" : [],
	"Ext.navigation.Bar" : [],
	"Ext.scroll.indicator.Default" : [],
	"Ext.data.ModelManager" : [],
	"Ext.data.Validations" : [],
	"Ext.util.translatable.Abstract" : [],
	"Ext.scroll.indicator.Abstract" : [],
	"Ext.Button" : [ "widget.button" ],
	"Ext.device.Geolocation" : [],
	"Ext.field.Radio" : [ "widget.radiofield" ],
	"Ext.data.proxy.SessionStorage" : [ "proxy.sessionstorage" ],
	"Ext.util.HashMap" : [],
	"Ext.field.Input" : [ "widget.input" ],
	"Ext.fx.easing.EaseIn" : [ "easing.ease-in" ],
	"Ext.field.Password" : [ "widget.passwordfield" ],
	"Ext.direct.RemotingMethod" : [],
	"Ext.direct.Event" : [ "direct.event" ],
	"Ext.device.connection.Abstract" : [],
	"Ext.device.Camera" : [],
	"Ext.mixin.Filterable" : [],
	"Ext.Evented" : [],
	"Ext.dataview.element.Container" : [],
	"Ext.carousel.Indicator" : [ "widget.carouselindicator" ],
	"Ext.util.Collection" : [],
	"Ext.data.Connection" : [],
	"Ext.carousel.Carousel" : [ "widget.carousel" ],
	"Ext.device.Contacts" : [],
	"Ext.Audio" : [ "widget.audio" ],
	"Ext.direct.ExceptionEvent" : [ "direct.exception" ],
	"Ext.Panel" : [ "widget.panel" ],
	"Ext.device.geolocation.Abstract" : [],
	"Ext.data.association.HasOne" : [ "association.hasone" ],
	"Ext.table.Table" : [ "widget.table" ],
	"Ext.ActionSheet" : [ "widget.actionsheet" ],
	"Ext.layout.Box" : [ "layout.tablebox" ],
	"Ext.bb.CrossCut" : [ "widget.crosscut" ],
	"Ext.data.Errors" : [],
	"Ext.Video" : [ "widget.video" ],
	"Ext.field.Text" : [ "widget.textfield" ],
	"Ext.fx.layout.card.Cube" : [ "fx.layout.card.cube" ],
	"Ext.event.recognizer.HorizontalSwipe" : [],
	"Ext.data.writer.Json" : [ "writer.json" ],
	"Ext.layout.Fit" : [ "layout.fit" ],
	"Ext.field.TextAreaInput" : [ "widget.textareainput" ],
	"Ext.fx.animation.Slide" : [ "animation.slide", "animation.slideIn" ],
	"Ext.field.DatePicker" : [ "widget.datepickerfield" ],
	"Ext.device.Purchases.Purchase" : [],
	"Ext.event.recognizer.Tap" : [],
	"Ext.table.Row" : [ "widget.tablerow" ],
	"Ext.log.formatter.Formatter" : [],
	"Ext.device.orientation.Abstract" : [],
	"Ext.Container" : [ "widget.container" ],
	"Ext.fx.animation.Pop" : [ "animation.pop", "animation.popIn" ],
	"Ext.AbstractManager" : [],
	"Ext.fx.layout.card.Reveal" : [ "fx.layout.card.reveal" ],
	"Ext.fx.layout.card.Cover" : [ "fx.layout.card.cover" ],
	"Ext.log.Base" : [],
	"Ext.scroll.indicator.CssTransform" : [],
	"Ext.util.PaintMonitor" : [],
	"Ext.direct.PollingProvider" : [ "direct.pollingprovider" ],
	"Ext.event.publisher.ElementPaint" : [],
	"Ext.data.reader.Xml" : [ "reader.xml" ],
	"Ext.device.notification.PhoneGap" : [],
	"Ext.data.writer.Xml" : [ "writer.xml" ],
	"Ext.event.recognizer.SingleTouch" : [],
	"Ext.data.reader.Json" : [ "reader.json" ],
	"Ext.Decorator" : [],
	"Ext.data.TreeStore" : [ "store.tree" ],
	"Ext.event.publisher.ComponentDelegation" : [],
	"Ext.device.Purchases" : [],
	"Ext.device.orientation.HTML5" : [],
	"Ext.event.recognizer.DoubleTap" : [],
	"Ext.log.Logger" : [],
	"Ext.field.Toggle" : [ "widget.togglefield" ],
	"Ext.picker.Slot" : [ "widget.pickerslot" ],
	"Ext.fx.layout.card.ScrollReveal" : [ "fx.layout.card.scrollreveal" ],
	"Ext.data.Operation" : [],
	"Ext.device.notification.Simulator" : [],
	"Ext.fx.animation.Abstract" : [],
	"Ext.field.Field" : [ "widget.field" ],
	"Ext.log.filter.Priority" : [],
	"Ext.util.sizemonitor.Abstract" : [],
	"Ext.util.paintmonitor.OverflowChange" : [],
	"Ext.scroll.Scroller" : [],
	"Ext.util.SizeMonitor" : [],
	"Ext.util.LineSegment" : [],
	"Ext.event.ListenerStack" : [],
	"Ext.SegmentedButton" : [ "widget.segmentedbutton" ],
	"Ext.util.MixedCollection" : [],
	"Ext.fx.easing.Linear" : [ "easing.linear" ],
	"Ext.Sortable" : [],
	"Ext.dom.CompositeElement" : []
});
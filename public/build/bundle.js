
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/ModeSwitcher.svelte generated by Svelte v3.38.2 */
    const file$1 = "src/ModeSwitcher.svelte";

    // (30:2) {:else}
    function create_else_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M494.2 221.9l-59.8-40.5 13.7-71c2.6-13.2-1.6-26.8-11.1-36.4-9.6-9.5-23.2-13.7-36.2-11.1l-70.9 13.7-40.4-59.9c-15.1-22.3-51.9-22.3-67 0l-40.4 59.9-70.8-13.7C98 60.4 84.5 64.5 75 74.1c-9.5 9.6-13.7 23.1-11.1 36.3l13.7 71-59.8 40.5C6.6 229.5 0 242 0 255.5s6.7 26 17.8 33.5l59.8 40.5-13.7 71c-2.6 13.2 1.6 26.8 11.1 36.3 9.5 9.5 22.9 13.7 36.3 11.1l70.8-13.7 40.4 59.9C230 505.3 242.6 512 256 512s26-6.7 33.5-17.8l40.4-59.9 70.9 13.7c13.4 2.7 26.8-1.6 36.3-11.1 9.5-9.5 13.6-23.1 11.1-36.3l-13.7-71 59.8-40.5c11.1-7.5 17.8-20.1 17.8-33.5-.1-13.6-6.7-26.1-17.9-33.7zm-112.9 85.6l17.6 91.2-91-17.6L256 458l-51.9-77-90.9 17.6 17.6-91.2-76.8-52 76.8-52-17.6-91.2 91 17.6L256 53l51.9 76.9 91-17.6-17.6 91.1 76.8 52-76.8 52.1zM256 152c-57.3 0-104 46.7-104 104s46.7 104 104 104 104-46.7 104-104-46.7-104-104-104zm0 160c-30.9 0-56-25.1-56-56s25.1-56 56-56 56 25.1 56 56-25.1 56-56 56z");
    			add_location(path, file$1, 33, 6, 1735);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "sun");
    			attr_dev(svg, "class", "svg-inline--fa fa-sun fa-w-16");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$1, 30, 4, 1528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(30:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if darkMode}
    function create_if_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M279.135 512c78.756 0 150.982-35.804 198.844-94.775 28.27-34.831-2.558-85.722-46.249-77.401-82.348 15.683-158.272-47.268-158.272-130.792 0-48.424 26.06-92.292 67.434-115.836 38.745-22.05 28.999-80.788-15.022-88.919A257.936 257.936 0 0 0 279.135 0c-141.36 0-256 114.575-256 256 0 141.36 114.576 256 256 256zm0-464c12.985 0 25.689 1.201 38.016 3.478-54.76 31.163-91.693 90.042-91.693 157.554 0 113.848 103.641 199.2 215.252 177.944C402.574 433.964 344.366 464 279.135 464c-114.875 0-208-93.125-208-208s93.125-208 208-208z");
    			add_location(path, file$1, 26, 6, 933);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "moon");
    			attr_dev(svg, "class", "svg-inline--fa fa-moon fa-w-16");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$1, 23, 4, 724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:2) {#if darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*darkMode*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "absolute top-0 right-0 w-8 h-8 p-2");
    			add_location(div, file$1, 21, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleMode*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const THEME_KEY = "themePreference";

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModeSwitcher", slots, []);
    	let darkMode = false;

    	function setDarkTheme(dark) {
    		$$invalidate(0, darkMode = dark);
    		document.documentElement.classList.toggle("dark", darkMode);
    	}

    	function toggleMode() {
    		setDarkTheme(!darkMode);
    		window.localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    	}

    	onMount(() => {
    		const theme = window.localStorage.getItem(THEME_KEY);

    		if (theme === "dark") {
    			setDarkTheme(true);
    		} else if (theme == null && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    			setDarkTheme(true);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ModeSwitcher> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		darkMode,
    		THEME_KEY,
    		setDarkTheme,
    		toggleMode
    	});

    	$$self.$inject_state = $$props => {
    		if ("darkMode" in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [darkMode, toggleMode];
    }

    class ModeSwitcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModeSwitcher",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Tailwindcss.svelte generated by Svelte v3.38.2 */

    function create_fragment$2(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Landing.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file = "src/Landing.svelte";

    function create_fragment$1(ctx) {
    	let div17;
    	let div16;
    	let header;
    	let div4;
    	let nav;
    	let div3;
    	let div1;
    	let a0;
    	let span0;
    	let t1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div0;
    	let button0;
    	let span1;
    	let t4;
    	let svg;
    	let path;
    	let t5;
    	let div2;
    	let a1;
    	let t7;
    	let main;
    	let div15;
    	let div14;
    	let div13;
    	let div10;
    	let div9;
    	let h1;
    	let span2;
    	let t9;
    	let span3;
    	let t11;
    	let p;
    	let t13;
    	let div8;
    	let form;
    	let div7;
    	let div5;
    	let label;
    	let t15;
    	let input;
    	let t16;
    	let div6;
    	let button1;
    	let t18;
    	let div12;
    	let div11;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			div16 = element("div");
    			header = element("header");
    			div4 = element("div");
    			nav = element("nav");
    			div3 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			span0 = element("span");
    			span0.textContent = "Recommeddit";
    			t1 = space();
    			img0 = element("img");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "Open main menu";
    			t4 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			div2 = element("div");
    			a1 = element("a");
    			a1.textContent = "Recommeddit";
    			t7 = space();
    			main = element("main");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			h1 = element("h1");
    			span2 = element("span");
    			span2.textContent = "A better way to";
    			t9 = space();
    			span3 = element("span");
    			span3.textContent = "discover movies";
    			t11 = space();
    			p = element("p");
    			p.textContent = "Our AI-powered recommendation algorithm will search and aggregate top\n                  movie recommendations on Reddit";
    			t13 = space();
    			div8 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div5 = element("div");
    			label = element("label");
    			label.textContent = "Search";
    			t15 = space();
    			input = element("input");
    			t16 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Search";
    			t18 = space();
    			div12 = element("div");
    			div11 = element("div");
    			img1 = element("img");
    			attr_dev(span0, "class", "sr-only");
    			add_location(span0, file, 27, 16, 1447);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "h-8 w-auto sm:h-10");
    			if (img0.src !== (img0_src_value = "/assets/recommeddit.svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 28, 16, 1504);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file, 26, 14, 1418);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file, 36, 18, 1997);
    			attr_dev(path, "d", "M4 6h16M4 12h16M4 18h16");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			add_location(path, file, 40, 20, 2287);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file, 38, 18, 2114);
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "class", "bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file, 33, 16, 1713);
    			attr_dev(div0, "class", "-mr-2 flex items-center md:hidden");
    			add_location(div0, file, 32, 14, 1649);
    			attr_dev(div1, "class", "flex items-center justify-between w-full md:w-auto");
    			add_location(div1, file, 25, 12, 1339);
    			attr_dev(a1, "class", "text-2xl font-bold text-white hover:text-gray-300");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file, 47, 14, 2578);
    			attr_dev(div2, "class", "hidden space-x-8 md:flex md:ml-10");
    			add_location(div2, file, 46, 12, 2516);
    			attr_dev(div3, "class", "flex items-center flex-1");
    			add_location(div3, file, 24, 10, 1288);
    			attr_dev(nav, "aria-label", "Global");
    			attr_dev(nav, "class", "relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6");
    			add_location(nav, file, 22, 8, 1157);
    			attr_dev(div4, "class", "bg-gray-900 pt-6");
    			add_location(div4, file, 21, 6, 1118);
    			attr_dev(header, "class", "relative");
    			add_location(header, file, 20, 4, 1086);
    			attr_dev(span2, "class", "block");
    			add_location(span2, file, 63, 18, 3326);
    			attr_dev(span3, "class", "pb-3 block bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 sm:pb-5");
    			add_location(span3, file, 64, 18, 3387);
    			attr_dev(h1, "class", "mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl");
    			add_location(h1, file, 61, 16, 3182);
    			attr_dev(p, "class", "text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl");
    			add_location(p, file, 67, 16, 3574);
    			attr_dev(label, "class", "sr-only");
    			attr_dev(label, "for", "search");
    			add_location(label, file, 76, 24, 4103);
    			attr_dev(input, "class", "block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900");
    			attr_dev(input, "id", "search");
    			attr_dev(input, "placeholder", "best movies to watch after ...");
    			attr_dev(input, "type", "search");
    			add_location(input, file, 77, 24, 4178);
    			attr_dev(div5, "class", "min-w-0 flex-1");
    			add_location(div5, file, 75, 22, 4050);
    			attr_dev(button1, "class", "block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file, 86, 24, 4736);
    			attr_dev(div6, "class", "mt-3 sm:mt-0 sm:ml-3");
    			add_location(div6, file, 85, 22, 4677);
    			attr_dev(div7, "class", "sm:flex");
    			add_location(div7, file, 74, 20, 4006);
    			attr_dev(form, "action", "#");
    			attr_dev(form, "class", "sm:max-w-xl sm:mx-auto lg:mx-0");
    			add_location(form, file, 72, 18, 3865);
    			attr_dev(div8, "class", "mt-10 sm:mt-12");
    			add_location(div8, file, 71, 16, 3818);
    			attr_dev(div9, "class", "lg:py-24");
    			add_location(div9, file, 60, 14, 3143);
    			attr_dev(div10, "class", "mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center");
    			add_location(div10, file, 58, 12, 2998);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none");
    			if (img1.src !== (img1_src_value = "/assets/background.svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 100, 16, 5549);
    			attr_dev(div11, "class", "mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0");
    			add_location(div11, file, 98, 14, 5357);
    			attr_dev(div12, "class", "mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative");
    			add_location(div12, file, 97, 12, 5287);
    			attr_dev(div13, "class", "lg:grid lg:grid-cols-2 lg:gap-8");
    			add_location(div13, file, 57, 10, 2940);
    			attr_dev(div14, "class", "mx-auto max-w-7xl lg:px-8");
    			add_location(div14, file, 56, 8, 2890);
    			attr_dev(div15, "class", "bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden h-screen");
    			add_location(div15, file, 55, 6, 2802);
    			attr_dev(main, "class", "pt-16 bg-gray-900");
    			add_location(main, file, 54, 4, 2763);
    			attr_dev(div16, "class", "relative overflow-hidden");
    			add_location(div16, file, 19, 2, 1043);
    			attr_dev(div17, "class", "bg-white");
    			add_location(div17, file, 18, 0, 1018);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div16);
    			append_dev(div16, header);
    			append_dev(header, div4);
    			append_dev(div4, nav);
    			append_dev(nav, div3);
    			append_dev(div3, div1);
    			append_dev(div1, a0);
    			append_dev(a0, span0);
    			append_dev(a0, t1);
    			append_dev(a0, img0);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, span1);
    			append_dev(button0, t4);
    			append_dev(button0, svg);
    			append_dev(svg, path);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(div16, t7);
    			append_dev(div16, main);
    			append_dev(main, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div10);
    			append_dev(div10, div9);
    			append_dev(div9, h1);
    			append_dev(h1, span2);
    			append_dev(h1, t9);
    			append_dev(h1, span3);
    			append_dev(div9, t11);
    			append_dev(div9, p);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, form);
    			append_dev(form, div7);
    			append_dev(div7, div5);
    			append_dev(div5, label);
    			append_dev(div5, t15);
    			append_dev(div5, input);
    			set_input_value(input, /*query*/ ctx[0]);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, button1);
    			append_dev(div13, t18);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, img1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*handleSearch*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*query*/ 1) {
    				set_input_value(input, /*query*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Landing", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let query = "";

    	const handleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    		const res = yield fetch("https://us-central1-recommeddit.cloudfunctions.net/search?" + new URLSearchParams({ query }));
    		const recommendations = yield res.json();
    		console.log(recommendations);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		query = this.value;
    		$$invalidate(0, query);
    	}

    	$$self.$capture_state = () => ({ __awaiter, query, handleSearch });

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [query, handleSearch, input_input_handler];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */

    function create_fragment(ctx) {
    	let tailwindcss;
    	let t0;
    	let modeswitcher;
    	let t1;
    	let landing;
    	let current;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	modeswitcher = new ModeSwitcher({ $$inline: true });
    	landing = new Landing({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			create_component(modeswitcher.$$.fragment);
    			t1 = space();
    			create_component(landing.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modeswitcher, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(landing, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(modeswitcher.$$.fragment, local);
    			transition_in(landing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(modeswitcher.$$.fragment, local);
    			transition_out(landing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modeswitcher, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(landing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ModeSwitcher, Tailwindcss, Landing });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map


(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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
    const file$2 = "src/ModeSwitcher.svelte";

    // (30:2) {:else}
    function create_else_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M494.2 221.9l-59.8-40.5 13.7-71c2.6-13.2-1.6-26.8-11.1-36.4-9.6-9.5-23.2-13.7-36.2-11.1l-70.9 13.7-40.4-59.9c-15.1-22.3-51.9-22.3-67 0l-40.4 59.9-70.8-13.7C98 60.4 84.5 64.5 75 74.1c-9.5 9.6-13.7 23.1-11.1 36.3l13.7 71-59.8 40.5C6.6 229.5 0 242 0 255.5s6.7 26 17.8 33.5l59.8 40.5-13.7 71c-2.6 13.2 1.6 26.8 11.1 36.3 9.5 9.5 22.9 13.7 36.3 11.1l70.8-13.7 40.4 59.9C230 505.3 242.6 512 256 512s26-6.7 33.5-17.8l40.4-59.9 70.9 13.7c13.4 2.7 26.8-1.6 36.3-11.1 9.5-9.5 13.6-23.1 11.1-36.3l-13.7-71 59.8-40.5c11.1-7.5 17.8-20.1 17.8-33.5-.1-13.6-6.7-26.1-17.9-33.7zm-112.9 85.6l17.6 91.2-91-17.6L256 458l-51.9-77-90.9 17.6 17.6-91.2-76.8-52 76.8-52-17.6-91.2 91 17.6L256 53l51.9 76.9 91-17.6-17.6 91.1 76.8 52-76.8 52.1zM256 152c-57.3 0-104 46.7-104 104s46.7 104 104 104 104-46.7 104-104-46.7-104-104-104zm0 160c-30.9 0-56-25.1-56-56s25.1-56 56-56 56 25.1 56 56-25.1 56-56 56z");
    			add_location(path, file$2, 33, 6, 1735);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "sun");
    			attr_dev(svg, "class", "svg-inline--fa fa-sun fa-w-16");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$2, 30, 4, 1528);
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(30:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if darkMode}
    function create_if_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M279.135 512c78.756 0 150.982-35.804 198.844-94.775 28.27-34.831-2.558-85.722-46.249-77.401-82.348 15.683-158.272-47.268-158.272-130.792 0-48.424 26.06-92.292 67.434-115.836 38.745-22.05 28.999-80.788-15.022-88.919A257.936 257.936 0 0 0 279.135 0c-141.36 0-256 114.575-256 256 0 141.36 114.576 256 256 256zm0-464c12.985 0 25.689 1.201 38.016 3.478-54.76 31.163-91.693 90.042-91.693 157.554 0 113.848 103.641 199.2 215.252 177.944C402.574 433.964 344.366 464 279.135 464c-114.875 0-208-93.125-208-208s93.125-208 208-208z");
    			add_location(path, file$2, 26, 6, 933);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "moon");
    			attr_dev(svg, "class", "svg-inline--fa fa-moon fa-w-16");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$2, 23, 4, 724);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(23:2) {#if darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*darkMode*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "absolute top-0 right-0 w-8 h-8 p-2");
    			add_location(div, file$2, 21, 0, 632);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const THEME_KEY = "themePreference";

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModeSwitcher",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Tailwindcss.svelte generated by Svelte v3.38.2 */

    function create_fragment$3(ctx) {
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Landing.svelte generated by Svelte v3.38.2 */
    const file$1 = "src/Landing.svelte";

    function create_fragment$2(ctx) {
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
    			add_location(span0, file$1, 17, 16, 626);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "h-8 w-auto sm:h-10");
    			if (img0.src !== (img0_src_value = "/assets/recommeddit.svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$1, 18, 16, 683);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$1, 16, 14, 597);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$1, 26, 18, 1176);
    			attr_dev(path, "d", "M4 6h16M4 12h16M4 18h16");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			add_location(path, file$1, 29, 20, 1411);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 27, 18, 1238);
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "class", "bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$1, 23, 16, 892);
    			attr_dev(div0, "class", "-mr-2 flex items-center md:hidden");
    			add_location(div0, file$1, 22, 14, 828);
    			attr_dev(div1, "class", "flex items-center justify-between w-full md:w-auto");
    			add_location(div1, file$1, 15, 12, 518);
    			attr_dev(a1, "class", "text-2xl font-bold text-white hover:text-gray-300");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$1, 36, 14, 1702);
    			attr_dev(div2, "class", "hidden space-x-8 md:flex md:ml-10");
    			add_location(div2, file$1, 35, 12, 1640);
    			attr_dev(div3, "class", "flex items-center flex-1");
    			add_location(div3, file$1, 14, 10, 467);
    			attr_dev(nav, "aria-label", "Global");
    			attr_dev(nav, "class", "relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6");
    			add_location(nav, file$1, 12, 8, 336);
    			attr_dev(div4, "class", "bg-gray-900 pt-6");
    			add_location(div4, file$1, 11, 6, 297);
    			attr_dev(header, "class", "relative");
    			add_location(header, file$1, 10, 4, 265);
    			attr_dev(span2, "class", "block");
    			add_location(span2, file$1, 52, 18, 2450);
    			attr_dev(span3, "class", "pb-3 block bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 sm:pb-5");
    			add_location(span3, file$1, 53, 18, 2511);
    			attr_dev(h1, "class", "mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl");
    			add_location(h1, file$1, 50, 16, 2306);
    			attr_dev(p, "class", "text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl");
    			add_location(p, file$1, 56, 16, 2698);
    			attr_dev(label, "class", "sr-only");
    			attr_dev(label, "for", "search");
    			add_location(label, file$1, 65, 24, 3226);
    			attr_dev(input, "class", "block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900");
    			attr_dev(input, "id", "search");
    			attr_dev(input, "placeholder", "best movies to watch after ...");
    			attr_dev(input, "type", "search");
    			add_location(input, file$1, 66, 24, 3301);
    			attr_dev(div5, "class", "min-w-0 flex-1");
    			add_location(div5, file$1, 64, 22, 3173);
    			attr_dev(button1, "class", "block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$1, 75, 24, 3859);
    			attr_dev(div6, "class", "mt-3 sm:mt-0 sm:ml-3");
    			add_location(div6, file$1, 74, 22, 3800);
    			attr_dev(div7, "class", "sm:flex");
    			add_location(div7, file$1, 63, 20, 3129);
    			attr_dev(form, "action", "#");
    			attr_dev(form, "class", "sm:max-w-xl sm:mx-auto lg:mx-0");
    			add_location(form, file$1, 61, 18, 2989);
    			attr_dev(div8, "class", "mt-10 sm:mt-12");
    			add_location(div8, file$1, 60, 16, 2942);
    			attr_dev(div9, "class", "lg:py-24");
    			add_location(div9, file$1, 49, 14, 2267);
    			attr_dev(div10, "class", "mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center");
    			add_location(div10, file$1, 47, 12, 2122);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none");
    			if (img1.src !== (img1_src_value = "/assets/background.svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$1, 89, 16, 4672);
    			attr_dev(div11, "class", "mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0");
    			add_location(div11, file$1, 87, 14, 4480);
    			attr_dev(div12, "class", "mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative");
    			add_location(div12, file$1, 86, 12, 4410);
    			attr_dev(div13, "class", "lg:grid lg:grid-cols-2 lg:gap-8");
    			add_location(div13, file$1, 46, 10, 2064);
    			attr_dev(div14, "class", "mx-auto max-w-7xl lg:px-8");
    			add_location(div14, file$1, 45, 8, 2014);
    			attr_dev(div15, "class", "bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden h-screen");
    			add_location(div15, file$1, 44, 6, 1926);
    			attr_dev(main, "class", "pt-16 bg-gray-900");
    			add_location(main, file$1, 43, 4, 1887);
    			attr_dev(div16, "class", "relative overflow-hidden");
    			add_location(div16, file$1, 9, 2, 222);
    			attr_dev(div17, "class", "bg-white");
    			add_location(div17, file$1, 8, 0, 197);
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
    					listen_dev(form, "submit", prevent_default(/*handleClick*/ ctx[1]), false, true, false)
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Landing", slots, []);
    	const dispatch = createEventDispatcher();
    	let query = "";

    	const handleClick = () => {
    		dispatch("search", query);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		query = this.value;
    		$$invalidate(0, query);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		query,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(0, query = $$props.query);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [query, handleClick, input_input_handler];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/SearchList.svelte generated by Svelte v3.38.2 */

    const { console: console_1$1 } = globals;
    const file = "src/SearchList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (347:2) {#each recommendations as recommendation}
    function create_each_block(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0_value = /*recommendation*/ ctx[2].text + "";
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3_value = /*recommendation*/ ctx[2].score + "";
    	let t3;
    	let t4;
    	let div2_intro;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text("Score: ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(div0, "class", "font-bold text-xl mb-2");
    			add_location(div0, file, 349, 8, 23050);
    			attr_dev(p, "class", "text-gray-700 text-base");
    			add_location(p, file, 350, 8, 23122);
    			attr_dev(div1, "class", "px-6 py-4");
    			add_location(div1, file, 348, 6, 23018);
    			attr_dev(div2, "class", "rounded overflow-hidden shadow-lg");
    			add_location(div2, file, 347, 4, 22926);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div2, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recommendations*/ 1 && t0_value !== (t0_value = /*recommendation*/ ctx[2].text + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*recommendations*/ 1 && t3_value !== (t3_value = /*recommendation*/ ctx[2].score + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fly, { y: 100, duration: 1000 });
    					div2_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(347:2) {#each recommendations as recommendation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let header;
    	let div9;
    	let div8;
    	let div1;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let t2;
    	let div7;
    	let div6;
    	let div5;
    	let label;
    	let t4;
    	let div4;
    	let div3;
    	let svg0;
    	let path0;
    	let t5;
    	let input;
    	let t6;
    	let nav;
    	let div10;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let a4;
    	let t14;
    	let div17;
    	let div15;
    	let div11;
    	let img1;
    	let img1_src_value;
    	let t15;
    	let div14;
    	let div12;
    	let t17;
    	let div13;
    	let t19;
    	let button;
    	let span;
    	let t21;
    	let svg1;
    	let path1;
    	let t22;
    	let div16;
    	let a5;
    	let t24;
    	let a6;
    	let t26;
    	let a7;
    	let t28;
    	let div18;
    	let each_value = /*recommendations*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			div9 = element("div");
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			div2.textContent = "Recommeddit";
    			t2 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			label = element("label");
    			label.textContent = "Search";
    			t4 = space();
    			div4 = element("div");
    			div3 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			nav = element("nav");
    			div10 = element("div");
    			a1 = element("a");
    			a1.textContent = "Dashboard";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "Calendar";
    			t10 = space();
    			a3 = element("a");
    			a3.textContent = "Teams";
    			t12 = space();
    			a4 = element("a");
    			a4.textContent = "Directory";
    			t14 = space();
    			div17 = element("div");
    			div15 = element("div");
    			div11 = element("div");
    			img1 = element("img");
    			t15 = space();
    			div14 = element("div");
    			div12 = element("div");
    			div12.textContent = "Chelsea Hagon";
    			t17 = space();
    			div13 = element("div");
    			div13.textContent = "chelseahagon@example.com";
    			t19 = space();
    			button = element("button");
    			span = element("span");
    			span.textContent = "View notifications";
    			t21 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t22 = space();
    			div16 = element("div");
    			a5 = element("a");
    			a5.textContent = "Your\n          Profile";
    			t24 = space();
    			a6 = element("a");
    			a6.textContent = "Settings";
    			t26 = space();
    			a7 = element("a");
    			a7.textContent = "Sign\n          out";
    			t28 = space();
    			div18 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img0, "alt", "Workflow");
    			attr_dev(img0, "class", "block h-8 w-auto");
    			if (img0.src !== (img0_src_value = "/assets/recommeddit.svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 15, 12, 520);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file, 14, 10, 495);
    			attr_dev(div0, "class", "flex-shrink-0 flex items-center");
    			add_location(div0, file, 13, 8, 439);
    			attr_dev(div1, "class", "flex md:absolute md:left-0 md:inset-y-0 lg:static");
    			add_location(div1, file, 12, 6, 367);
    			attr_dev(div2, "class", "min-w-0 px-0 pt-4 xl:col-span-2 text-2xl font-bold text-white hover:text-gray-300");
    			add_location(div2, file, 21, 6, 679);
    			attr_dev(label, "class", "sr-only");
    			attr_dev(label, "for", "search");
    			add_location(label, file, 29, 12, 1038);
    			attr_dev(path0, "clip-rule", "evenodd");
    			attr_dev(path0, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path0, "fill-rule", "evenodd");
    			add_location(path0, file, 35, 18, 1459);
    			attr_dev(svg0, "aria-hidden", "true");
    			attr_dev(svg0, "class", "h-5 w-5 text-gray-400");
    			attr_dev(svg0, "fill", "currentColor");
    			attr_dev(svg0, "viewBox", "0 0 20 20");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file, 33, 16, 1290);
    			attr_dev(div3, "class", "pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center");
    			add_location(div3, file, 31, 14, 1138);
    			attr_dev(input, "class", "block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm");
    			attr_dev(input, "id", "search");
    			attr_dev(input, "name", "search");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "type", "search");
    			add_location(input, file, 40, 14, 1730);
    			attr_dev(div4, "class", "relative");
    			add_location(div4, file, 30, 12, 1101);
    			attr_dev(div5, "class", "w-full");
    			add_location(div5, file, 28, 10, 1005);
    			attr_dev(div6, "class", "flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0");
    			add_location(div6, file, 26, 8, 889);
    			attr_dev(div7, "class", "min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6");
    			add_location(div7, file, 25, 6, 822);
    			attr_dev(div8, "class", "relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8");
    			add_location(div8, file, 11, 4, 284);
    			attr_dev(div9, "class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8");
    			add_location(div9, file, 10, 2, 227);
    			attr_dev(a1, "aria-current", "page");
    			attr_dev(a1, "class", "bg-gray-100 text-gray-900 block rounded-md py-2 px-3 text-base font-medium text-gray-900");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file, 88, 6, 4274);
    			attr_dev(a2, "class", "hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 92, 6, 4442);
    			attr_dev(a3, "class", "hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900");
    			attr_dev(a3, "href", "#");
    			add_location(a3, file, 95, 6, 4571);
    			attr_dev(a4, "class", "hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900");
    			attr_dev(a4, "href", "#");
    			add_location(a4, file, 98, 6, 4697);
    			attr_dev(div10, "class", "max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4");
    			add_location(div10, file, 86, 4, 4122);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "h-10 w-10 rounded-full");
    			if (img1.src !== (img1_src_value = "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixqx=1mJ1p9O9Hf&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 104, 10, 4999);
    			attr_dev(div11, "class", "flex-shrink-0");
    			add_location(div11, file, 103, 8, 4961);
    			attr_dev(div12, "class", "text-base font-medium text-gray-800");
    			add_location(div12, file, 109, 10, 5298);
    			attr_dev(div13, "class", "text-sm font-medium text-gray-500");
    			add_location(div13, file, 110, 10, 5377);
    			attr_dev(div14, "class", "ml-3");
    			add_location(div14, file, 108, 8, 5269);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file, 115, 10, 5695);
    			attr_dev(path1, "d", "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			add_location(path1, file, 119, 12, 5957);
    			attr_dev(svg1, "aria-hidden", "true");
    			attr_dev(svg1, "class", "h-6 w-6");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file, 117, 10, 5800);
    			attr_dev(button, "class", "ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			attr_dev(button, "type", "button");
    			add_location(button, file, 112, 8, 5478);
    			attr_dev(div15, "class", "max-w-3xl mx-auto px-4 flex items-center sm:px-6");
    			add_location(div15, file, 102, 6, 4890);
    			attr_dev(a5, "class", "block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900");
    			attr_dev(a5, "href", "#");
    			add_location(a5, file, 127, 8, 6387);
    			attr_dev(a6, "class", "block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900");
    			attr_dev(a6, "href", "#");
    			add_location(a6, file, 132, 8, 6563);
    			attr_dev(a7, "class", "block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900");
    			attr_dev(a7, "href", "#");
    			add_location(a7, file, 136, 8, 6725);
    			attr_dev(div16, "class", "mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4");
    			add_location(div16, file, 126, 6, 6319);
    			attr_dev(div17, "class", "border-t border-gray-200 pt-4 pb-3");
    			add_location(div17, file, 101, 4, 4835);
    			attr_dev(nav, "aria-label", "Global");
    			attr_dev(nav, "class", "lg:hidden");
    			add_location(nav, file, 85, 2, 4074);
    			attr_dev(header, "class", "bg-gray-900 shadow-sm lg:static lg:overflow-y-visible");
    			add_location(header, file, 9, 0, 154);
    			attr_dev(div18, "class", "p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5");
    			add_location(div18, file, 343, 0, 22758);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div8, t0);
    			append_dev(div8, div2);
    			append_dev(div8, t2);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, label);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, svg0);
    			append_dev(svg0, path0);
    			append_dev(div4, t5);
    			append_dev(div4, input);
    			append_dev(header, t6);
    			append_dev(header, nav);
    			append_dev(nav, div10);
    			append_dev(div10, a1);
    			append_dev(div10, t8);
    			append_dev(div10, a2);
    			append_dev(div10, t10);
    			append_dev(div10, a3);
    			append_dev(div10, t12);
    			append_dev(div10, a4);
    			append_dev(nav, t14);
    			append_dev(nav, div17);
    			append_dev(div17, div15);
    			append_dev(div15, div11);
    			append_dev(div11, img1);
    			append_dev(div15, t15);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div14, t17);
    			append_dev(div14, div13);
    			append_dev(div15, t19);
    			append_dev(div15, button);
    			append_dev(button, span);
    			append_dev(button, t21);
    			append_dev(button, svg1);
    			append_dev(svg1, path1);
    			append_dev(div17, t22);
    			append_dev(div17, div16);
    			append_dev(div16, a5);
    			append_dev(div16, t24);
    			append_dev(div16, a6);
    			append_dev(div16, t26);
    			append_dev(div16, a7);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, div18, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div18, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*recommendations*/ 1) {
    				each_value = /*recommendations*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div18, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(div18);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots("SearchList", slots, []);
    	let { recommendations } = $$props;
    	let { isLoading } = $$props;
    	const writable_props = ["recommendations", "isLoading"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<SearchList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("recommendations" in $$props) $$invalidate(0, recommendations = $$props.recommendations);
    		if ("isLoading" in $$props) $$invalidate(1, isLoading = $$props.isLoading);
    	};

    	$$self.$capture_state = () => ({ fly, recommendations, isLoading });

    	$$self.$inject_state = $$props => {
    		if ("recommendations" in $$props) $$invalidate(0, recommendations = $$props.recommendations);
    		if ("isLoading" in $$props) $$invalidate(1, isLoading = $$props.isLoading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*recommendations*/ 1) {
    			console.log(recommendations);
    		}
    	};

    	return [recommendations, isLoading];
    }

    class SearchList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { recommendations: 0, isLoading: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchList",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*recommendations*/ ctx[0] === undefined && !("recommendations" in props)) {
    			console_1$1.warn("<SearchList> was created without expected prop 'recommendations'");
    		}

    		if (/*isLoading*/ ctx[1] === undefined && !("isLoading" in props)) {
    			console_1$1.warn("<SearchList> was created without expected prop 'isLoading'");
    		}
    	}

    	get recommendations() {
    		throw new Error("<SearchList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recommendations(value) {
    		throw new Error("<SearchList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLoading() {
    		throw new Error("<SearchList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLoading(value) {
    		throw new Error("<SearchList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;

    // (45:0) {:else}
    function create_else_block(ctx) {
    	let landing;
    	let current;
    	landing = new Landing({ $$inline: true });
    	landing.$on("search", /*handleSearch*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(landing.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(landing, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(landing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:0) {#if isSearching}
    function create_if_block(ctx) {
    	let searchlist;
    	let current;

    	searchlist = new SearchList({
    			props: {
    				isLoading: /*isLoading*/ ctx[1],
    				recommendations: /*recommendations*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchlist_changes = {};
    			if (dirty & /*isLoading*/ 2) searchlist_changes.isLoading = /*isLoading*/ ctx[1];
    			searchlist.$set(searchlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:0) {#if isSearching}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwindcss;
    	let t0;
    	let modeswitcher;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	modeswitcher = new ModeSwitcher({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isSearching*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			create_component(modeswitcher.$$.fragment);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modeswitcher, target, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(modeswitcher.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(modeswitcher.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modeswitcher, detaching);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    	let isSearching = false;
    	let isLoading = false;
    	let recommendations = [];

    	const handleSearch = ({ detail: query }) => __awaiter(void 0, void 0, void 0, function* () {
    		$$invalidate(0, isSearching = true);
    		$$invalidate(1, isLoading = true);
    		console.log(query);
    		const res = yield (yield fetch("https://us-central1-recommeddit.cloudfunctions.net/search?" + new URLSearchParams({ query }))).json();
    		console.log(res);
    		const recommendationMap = res.recommendations;
    		console.log(recommendationMap);

    		for (const recommendation in recommendationMap) {
    			console.log(recommendation);

    			recommendations.push({
    				text: recommendation,
    				score: recommendationMap[recommendation]
    			});
    		}

    		recommendations.sort((a, b) => b.score - a.score);
    		console.log(recommendations);
    		$$invalidate(1, isLoading = false);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		ModeSwitcher,
    		Tailwindcss,
    		Landing,
    		SearchList,
    		isSearching,
    		isLoading,
    		recommendations,
    		handleSearch
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("isSearching" in $$props) $$invalidate(0, isSearching = $$props.isSearching);
    		if ("isLoading" in $$props) $$invalidate(1, isLoading = $$props.isLoading);
    		if ("recommendations" in $$props) $$invalidate(2, recommendations = $$props.recommendations);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isSearching, isLoading, recommendations, handleSearch];
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

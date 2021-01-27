
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.0' }, detail)));
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.31.2 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
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
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.31.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.31.2 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true, "aria-current": true });
    			var a_nodes = children(a);
    			if (default_slot) default_slot.l(a_nodes);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
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
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			 $$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			 $$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MediaQuery.svelte generated by Svelte v3.31.2 */
    const get_default_slot_changes$1 = dirty => ({ matches: dirty & /*matches*/ 1 });
    const get_default_slot_context$1 = ctx => ({ matches: /*matches*/ ctx[0] });

    function create_fragment$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, matches*/ 9) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MediaQuery", slots, ['default']);
    	let { query } = $$props;
    	let mql;
    	let mqlListener;
    	let wasMounted = false;
    	let matches = false;

    	onMount(() => {
    		$$invalidate(2, wasMounted = true);

    		return () => {
    			removeActiveListener();
    		};
    	});

    	function addNewListener(query) {
    		mql = window.matchMedia(query);
    		mqlListener = v => $$invalidate(0, matches = v.matches);
    		mql.addListener(mqlListener);
    		$$invalidate(0, matches = mql.matches);
    	}

    	function removeActiveListener() {
    		if (mql && mqlListener) {
    			mql.removeListener(mqlListener);
    		}
    	}

    	const writable_props = ["query"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MediaQuery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("query" in $$props) $$invalidate(1, query = $$props.query);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		query,
    		mql,
    		mqlListener,
    		wasMounted,
    		matches,
    		addNewListener,
    		removeActiveListener
    	});

    	$$self.$inject_state = $$props => {
    		if ("query" in $$props) $$invalidate(1, query = $$props.query);
    		if ("mql" in $$props) mql = $$props.mql;
    		if ("mqlListener" in $$props) mqlListener = $$props.mqlListener;
    		if ("wasMounted" in $$props) $$invalidate(2, wasMounted = $$props.wasMounted);
    		if ("matches" in $$props) $$invalidate(0, matches = $$props.matches);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wasMounted, query*/ 6) {
    			 {
    				if (wasMounted) {
    					removeActiveListener();
    					addNewListener(query);
    				}
    			}
    		}
    	};

    	return [matches, query, wasMounted, $$scope, slots];
    }

    class MediaQuery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { query: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MediaQuery",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[1] === undefined && !("query" in props)) {
    			console.warn("<MediaQuery> was created without expected prop 'query'");
    		}
    	}

    	get query() {
    		throw new Error("<MediaQuery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<MediaQuery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ButtonComp.svelte generated by Svelte v3.31.2 */

    const file$1 = "src/components/ButtonComp.svelte";

    function create_fragment$4(ctx) {
    	let a;
    	let div;
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			h2 = element("h2");
    			t = text("FORIS ESSAYに応募する");
    			this.h();
    		},
    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true });
    			var a_nodes = children(a);
    			div = claim_element(a_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			h2 = claim_element(div_nodes, "H2", { class: true });
    			var h2_nodes = children(h2);
    			t = claim_text(h2_nodes, "FORIS ESSAYに応募する");
    			h2_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h2, "class", "ttl svelte-zlp9ry");
    			add_location(h2, file$1, 2, 4, 75);
    			attr_dev(div, "class", "btn_subscribe svelte-zlp9ry");
    			add_location(div, file$1, 1, 2, 43);
    			attr_dev(a, "href", "https://form.run/@foris-essay");
    			add_location(a, file$1, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, h2);
    			append_dev(h2, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ButtonComp", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ButtonComp> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ButtonComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonComp",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/HeaderComp.svelte generated by Svelte v3.31.2 */

    const file$2 = "src/components/HeaderComp.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let nav;
    	let div1;
    	let h3;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("FORIS ESSAY");
    			t1 = space();
    			nav = element("nav");
    			div1 = element("div");
    			h3 = element("h3");
    			a = element("a");
    			t2 = text("お問い合わせ");
    			this.h();
    		},
    		l: function claim(nodes) {
    			header = claim_element(nodes, "HEADER", {});
    			var header_nodes = children(header);
    			div2 = claim_element(header_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			h1 = claim_element(div0_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "FORIS ESSAY");
    			h1_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			t1 = claim_space(div2_nodes);
    			nav = claim_element(div2_nodes, "NAV", { class: true });
    			var nav_nodes = children(nav);
    			div1 = claim_element(nav_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h3 = claim_element(div1_nodes, "H3", {});
    			var h3_nodes = children(h3);
    			a = claim_element(h3_nodes, "A", { class: true, href: true });
    			var a_nodes = children(a);
    			t2 = claim_text(a_nodes, "お問い合わせ");
    			a_nodes.forEach(detach_dev);
    			h3_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			nav_nodes.forEach(detach_dev);
    			div2_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "logo svelte-1y9bvj7");
    			add_location(h1, file$2, 3, 6, 76);
    			attr_dev(div0, "class", "area_logo_header");
    			add_location(div0, file$2, 2, 4, 39);
    			attr_dev(a, "class", "btn_icon_mail svelte-1y9bvj7");
    			attr_dev(a, "href", "https://form.run/@foris-essay");
    			add_location(a, file$2, 8, 10, 209);
    			add_location(h3, file$2, 7, 8, 194);
    			attr_dev(div1, "class", "list_nav_header svelte-1y9bvj7");
    			add_location(div1, file$2, 6, 6, 156);
    			attr_dev(nav, "class", "nav_header svelte-1y9bvj7");
    			add_location(nav, file$2, 5, 4, 125);
    			attr_dev(div2, "class", "container svelte-1y9bvj7");
    			add_location(div2, file$2, 1, 2, 11);
    			add_location(header, file$2, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, nav);
    			append_dev(nav, div1);
    			append_dev(div1, h3);
    			append_dev(h3, a);
    			append_dev(a, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderComp", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HeaderComp> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class HeaderComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderComp",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/FooterComp.svelte generated by Svelte v3.31.2 */
    const file$3 = "src/components/FooterComp.svelte";

    // (9:6) <Link to="">
    function create_default_slot_2(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text("利用者規約");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h3 = claim_element(nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t = claim_text(h3_nodes, "利用者規約");
    			h3_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h3, "class", "text svelte-1oblz0h");
    			add_location(h3, file$3, 8, 18, 178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(9:6) <Link to=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:6) <Link to="">
    function create_default_slot_1(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text("個人情報取り扱い方針");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h3 = claim_element(nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t = claim_text(h3_nodes, "個人情報取り扱い方針");
    			h3_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h3, "class", "text svelte-1oblz0h");
    			add_location(h3, file$3, 9, 18, 231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(10:6) <Link to=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:6) <Link to="">
    function create_default_slot(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text("お問い合わせ");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h3 = claim_element(nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t = claim_text(h3_nodes, "お問い合わせ");
    			h3_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h3, "class", "text svelte-1oblz0h");
    			add_location(h3, file$3, 10, 18, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:6) <Link to=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let footer;
    	let div1;
    	let h2;
    	let t0;
    	let t1;
    	let div0;
    	let link0;
    	let t2;
    	let link1;
    	let t3;
    	let link2;
    	let t4;
    	let p;
    	let t5;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text("FORIS ESSAY");
    			t1 = space();
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			t3 = space();
    			create_component(link2.$$.fragment);
    			t4 = space();
    			p = element("p");
    			t5 = text("All rights reserved 2021");
    			this.h();
    		},
    		l: function claim(nodes) {
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			div1 = claim_element(footer_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h2 = claim_element(div1_nodes, "H2", { class: true });
    			var h2_nodes = children(h2);
    			t0 = claim_text(h2_nodes, "FORIS ESSAY");
    			h2_nodes.forEach(detach_dev);
    			t1 = claim_space(div1_nodes);
    			div0 = claim_element(div1_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			claim_component(link0.$$.fragment, div0_nodes);
    			t2 = claim_space(div0_nodes);
    			claim_component(link1.$$.fragment, div0_nodes);
    			t3 = claim_space(div0_nodes);
    			claim_component(link2.$$.fragment, div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			t4 = claim_space(div1_nodes);
    			p = claim_element(div1_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t5 = claim_text(p_nodes, "All rights reserved 2021");
    			p_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			footer_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h2, "class", "ttl svelte-1oblz0h");
    			add_location(h2, file$3, 6, 4, 99);
    			attr_dev(div0, "class", "body_home svelte-1oblz0h");
    			add_location(div0, file$3, 7, 4, 136);
    			attr_dev(p, "class", "copyright svelte-1oblz0h");
    			add_location(p, file$3, 12, 4, 340);
    			attr_dev(div1, "class", "container svelte-1oblz0h");
    			add_location(div1, file$3, 5, 2, 71);
    			attr_dev(footer, "class", "svelte-1oblz0h");
    			add_location(footer, file$3, 4, 0, 60);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(link0, div0, null);
    			append_dev(div0, t2);
    			mount_component(link1, div0, null);
    			append_dev(div0, t3);
    			mount_component(link2, div0, null);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FooterComp", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FooterComp> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class FooterComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FooterComp",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/QAComp.svelte generated by Svelte v3.31.2 */

    const file$4 = "src/components/QAComp.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text("Q. ");
    			t1 = text(/*question*/ ctx[0]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*answer*/ ctx[1]);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			h3 = claim_element(div_nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t0 = claim_text(h3_nodes, "Q. ");
    			t1 = claim_text(h3_nodes, /*question*/ ctx[0]);
    			h3_nodes.forEach(detach_dev);
    			t2 = claim_space(div_nodes);
    			p = claim_element(div_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, /*answer*/ ctx[1]);
    			p_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h3, "class", "question svelte-t1tig9");
    			add_location(h3, file$4, 6, 2, 88);
    			attr_dev(p, "class", "answer");
    			add_location(p, file$4, 7, 2, 130);
    			attr_dev(div, "class", "container svelte-t1tig9");
    			add_location(div, file$4, 5, 0, 62);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*question*/ 1) set_data_dev(t1, /*question*/ ctx[0]);
    			if (dirty & /*answer*/ 2) set_data_dev(t3, /*answer*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("QAComp", slots, []);
    	let { question } = $$props;
    	let { answer } = $$props;
    	const writable_props = ["question", "answer"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<QAComp> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    		if ("answer" in $$props) $$invalidate(1, answer = $$props.answer);
    	};

    	$$self.$capture_state = () => ({ question, answer });

    	$$self.$inject_state = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    		if ("answer" in $$props) $$invalidate(1, answer = $$props.answer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [question, answer];
    }

    class QAComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { question: 0, answer: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QAComp",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !("question" in props)) {
    			console.warn("<QAComp> was created without expected prop 'question'");
    		}

    		if (/*answer*/ ctx[1] === undefined && !("answer" in props)) {
    			console.warn("<QAComp> was created without expected prop 'answer'");
    		}
    	}

    	get question() {
    		throw new Error("<QAComp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<QAComp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get answer() {
    		throw new Error("<QAComp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answer(value) {
    		throw new Error("<QAComp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/FeatureComp.svelte generated by Svelte v3.31.2 */

    const file$5 = "src/components/FeatureComp.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div0;
    	let h30;
    	let t0;
    	let t1;
    	let h31;
    	let t2_value = /*$$props*/ ctx[0].point + "";
    	let t2;
    	let t3;
    	let div1;
    	let h4;
    	let raw0_value = /*$$props*/ ctx[0].title + "";
    	let t4;
    	let p;
    	let raw1_value = /*$$props*/ ctx[0].description + "";

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			t0 = text("ポイント");
    			t1 = space();
    			h31 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			h4 = element("h4");
    			t4 = space();
    			p = element("p");
    			this.h();
    		},
    		l: function claim(nodes) {
    			div2 = claim_element(nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			h30 = claim_element(div0_nodes, "H3", { class: true });
    			var h30_nodes = children(h30);
    			t0 = claim_text(h30_nodes, "ポイント");
    			h30_nodes.forEach(detach_dev);
    			t1 = claim_space(div0_nodes);
    			h31 = claim_element(div0_nodes, "H3", { class: true });
    			var h31_nodes = children(h31);
    			t2 = claim_text(h31_nodes, t2_value);
    			h31_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			t3 = claim_space(div2_nodes);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h4 = claim_element(div1_nodes, "H4", { class: true });
    			var h4_nodes = children(h4);
    			h4_nodes.forEach(detach_dev);
    			t4 = claim_space(div1_nodes);
    			p = claim_element(div1_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			p_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			div2_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h30, "class", "ttl svelte-eihyxd");
    			add_location(h30, file$5, 2, 4, 50);
    			attr_dev(h31, "class", "ttl_num svelte-eihyxd");
    			add_location(h31, file$5, 3, 4, 80);
    			attr_dev(div0, "class", "point svelte-eihyxd");
    			add_location(div0, file$5, 1, 2, 26);
    			attr_dev(h4, "class", "ttl svelte-eihyxd");
    			add_location(h4, file$5, 6, 4, 160);
    			attr_dev(p, "class", "description");
    			add_location(p, file$5, 9, 4, 219);
    			attr_dev(div1, "class", "text_home svelte-eihyxd");
    			add_location(div1, file$5, 5, 2, 132);
    			attr_dev(div2, "class", "container svelte-eihyxd");
    			add_location(div2, file$5, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h31);
    			append_dev(h31, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, h4);
    			h4.innerHTML = raw0_value;
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			p.innerHTML = raw1_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && t2_value !== (t2_value = /*$$props*/ ctx[0].point + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$$props*/ 1 && raw0_value !== (raw0_value = /*$$props*/ ctx[0].title + "")) h4.innerHTML = raw0_value;			if (dirty & /*$$props*/ 1 && raw1_value !== (raw1_value = /*$$props*/ ctx[0].description + "")) p.innerHTML = raw1_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FeatureComp", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FeatureComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FeatureComp",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/StaffComp.svelte generated by Svelte v3.31.2 */

    const file$6 = "src/components/StaffComp.svelte";

    function create_fragment$9(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let h3;
    	let t1_value = /*$$props*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*$$props*/ ctx[0].description + "";
    	let t3;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div2 = claim_element(nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			img = claim_element(div0_nodes, "IMG", { src: true, alt: true, class: true });
    			div0_nodes.forEach(detach_dev);
    			t0 = claim_space(div2_nodes);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h3 = claim_element(div1_nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t1 = claim_text(h3_nodes, t1_value);
    			h3_nodes.forEach(detach_dev);
    			t2 = claim_space(div1_nodes);
    			p = claim_element(div1_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, t3_value);
    			p_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			div2_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			if (img.src !== (img_src_value = "imgs/" + /*$$props*/ ctx[0].imageUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*$$props*/ ctx[0].imageAlt);
    			attr_dev(img, "class", "svelte-5nriar");
    			add_location(img, file$6, 2, 4, 75);
    			attr_dev(div0, "class", "img");
    			add_location(div0, file$6, 1, 2, 53);
    			attr_dev(h3, "class", "ttl svelte-5nriar");
    			add_location(h3, file$6, 5, 4, 175);
    			attr_dev(p, "class", "description svelte-5nriar");
    			add_location(p, file$6, 6, 4, 215);
    			attr_dev(div1, "class", "text_home svelte-5nriar");
    			add_location(div1, file$6, 4, 2, 147);
    			attr_dev(div2, "class", div2_class_value = "container " + (/*$$props*/ ctx[0].align || "right") + " svelte-5nriar");
    			add_location(div2, file$6, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && img.src !== (img_src_value = "imgs/" + /*$$props*/ ctx[0].imageUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$$props*/ 1 && img_alt_value !== (img_alt_value = /*$$props*/ ctx[0].imageAlt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$$props*/ 1 && t1_value !== (t1_value = /*$$props*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$$props*/ 1 && t3_value !== (t3_value = /*$$props*/ ctx[0].description + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*$$props*/ 1 && div2_class_value !== (div2_class_value = "container " + (/*$$props*/ ctx[0].align || "right") + " svelte-5nriar")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StaffComp", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class StaffComp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StaffComp",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/routes/Home.svelte generated by Svelte v3.31.2 */
    const file$7 = "src/routes/Home.svelte";

    // (150:10) {#if matches}
    function create_if_block_1$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			this.h();
    		},
    		l: function claim(nodes) {
    			img = claim_element(nodes, "IMG", { class: true, src: true, alt: true });
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(img, "class", "campaign_image svelte-11d9n2");
    			if (img.src !== (img_src_value = "imgs/campaign_desktop.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "キャンペーン画像");
    			add_location(img, file$7, 150, 12, 4264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(150:10) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (149:8) <MediaQuery query="(min-width: 481px)" let:matches>
    function create_default_slot_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*matches*/ ctx[0] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*matches*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(149:8) <MediaQuery query=\\\"(min-width: 481px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    // (159:10) {#if matches}
    function create_if_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			this.h();
    		},
    		l: function claim(nodes) {
    			img = claim_element(nodes, "IMG", { class: true, src: true, alt: true });
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(img, "class", "campaign_image svelte-11d9n2");
    			if (img.src !== (img_src_value = "imgs/campaign_mobile.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "キャンペーン画像");
    			add_location(img, file$7, 159, 12, 4530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(159:10) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (158:8) <MediaQuery query="(max-width: 480px)" let:matches>
    function create_default_slot$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*matches*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*matches*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(158:8) <MediaQuery query=\\\"(max-width: 480px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let headercomp;
    	let t0;
    	let main;
    	let section0;
    	let h10;
    	let t1;
    	let br0;
    	let t2;
    	let br1;
    	let t3;
    	let strong0;
    	let t4;
    	let t5;
    	let div0;
    	let h20;
    	let t6;
    	let t7;
    	let section1;
    	let div1;
    	let h11;
    	let t8;
    	let t9;
    	let div2;
    	let p0;
    	let t10;
    	let br2;
    	let t11;
    	let br3;
    	let t12;
    	let t13;
    	let section2;
    	let div3;
    	let h21;
    	let t14;
    	let strong1;
    	let t15;
    	let t16;
    	let t17;
    	let div4;
    	let featurecomp0;
    	let t18;
    	let featurecomp1;
    	let t19;
    	let section3;
    	let div5;
    	let t20;
    	let div6;
    	let p1;
    	let t21;
    	let br4;
    	let t22;
    	let strong2;
    	let t23;
    	let t24;
    	let t25;
    	let section4;
    	let div7;
    	let h22;
    	let t26;
    	let t27;
    	let div8;
    	let staffcomp0;
    	let t28;
    	let staffcomp1;
    	let t29;
    	let section5;
    	let div9;
    	let h23;
    	let t30;
    	let t31;
    	let div10;
    	let qacomp0;
    	let t32;
    	let qacomp1;
    	let t33;
    	let qacomp2;
    	let t34;
    	let qacomp3;
    	let t35;
    	let section6;
    	let div11;
    	let h24;
    	let t36;
    	let t37;
    	let div12;
    	let p2;
    	let t38;
    	let t39;
    	let section7;
    	let div15;
    	let div13;
    	let mediaquery0;
    	let t40;
    	let mediaquery1;
    	let t41;
    	let div14;
    	let buttoncomp;
    	let t42;
    	let footercomp;
    	let current;
    	headercomp = new HeaderComp({ $$inline: true });

    	featurecomp0 = new FeatureComp({
    			props: {
    				point: "1",
    				title: "世界的にトップスクール合格者のみが講師に。",
    				description: "コロンビア大学やワシントン大学などトップスクールと言われる\n            大学に合格し、大学のチュータリング経験も豊富な講師が\n            丁寧に対応いたします。"
    			},
    			$$inline: true
    		});

    	featurecomp1 = new FeatureComp({
    			props: {
    				point: "2",
    				title: "アイデアから細部まで丁寧な添削を。",
    				description: "合格するためのエッセイにはアイデアの部分から\n\t\t\t\t\t\t細部の文法までを完璧にする必要があります。\n\t\t\t\t\t\tFORIS ESSAYではしっかりと作り上げます"
    			},
    			$$inline: true
    		});

    	staffcomp0 = new StaffComp({
    			props: {
    				align: "right",
    				imageUrl: "dummy_image.jpeg",
    				imageAlt: "dummy Image",
    				name: "Annalise Lineman",
    				description: "ワシントン大学シアトル校を2020年に卒業。大学では\n\t\t\t\t\t言語学・文学を専攻。ライティングセンターでの\n\t\t\t\t\tチュータリング経験も豊富で、TEFL(Teaching English\n\t\t\t\t\tas a Foreign Language Certificate)も所有。\n\t\t\t\t\tワシントン大学の語学学校にて留学生に英語の講師\n\t\t\t\t\t経験もあります。"
    			},
    			$$inline: true
    		});

    	staffcomp1 = new StaffComp({
    			props: {
    				align: "left",
    				imageUrl: "dummy_image.jpeg",
    				imageAlt: "dummy Image",
    				name: "Khadijah",
    				description: "現役ワシントン大学シアトル校在学生。心理学を専攻し、\n\t\t\t\t\tアジア言語学を副専攻。シアトルセントラルカレッジと\n\t\t\t\t\tワシントン大学シアトル校のライティングセンターの\n\t\t\t\t\tチューターに3年間従事。MESA(Mathmatics, Engineering,\n\t\t\t\t\tScience Achievement)のチューターも行っており、\n\t\t\t\t\t理系の視点においてもエッセイ添削を行うことができます。"
    			},
    			$$inline: true
    		});

    	qacomp0 = new QAComp({
    			props: {
    				question: "何回の添削サービスを受けられますか？",
    				answer: "5回までがサービスの中に含まれておりますが、追加なども受け付けております。\n          追加をご希望の場合は、随時お申し付けください。"
    			},
    			$$inline: true
    		});

    	qacomp1 = new QAComp({
    			props: {
    				question: "締め切り日はありますか？",
    				answer: "希望校の出願締め切り日の2ヶ月前までにご応募をお願いいたします。\n          万が一、出願までに回数分が利用できない、もしくは全ての回数を必要でない場合は\n          一部返金対応させていただきますので、お申し付けくださいませ。"
    			},
    			$$inline: true
    		});

    	qacomp2 = new QAComp({
    			props: {
    				question: "もうエッセイを書き始めてても応募できますか？",
    				answer: "はい、もちろんです。すでに書いておられる内容に対し、添削を行わせていただきます。\n          アイデアから細部までしっかりと丁寧に対応いたします。"
    			},
    			$$inline: true
    		});

    	qacomp3 = new QAComp({
    			props: {
    				question: "このサービスはオンラインですか？",
    				answer: "はい。Zoomというアプリを使用させていただきます。ご指定いただくお時間になりましたら\n          Zoomにて入室していただく運びとなります。"
    			},
    			$$inline: true
    		});

    	mediaquery0 = new MediaQuery({
    			props: {
    				query: "(min-width: 481px)",
    				$$slots: {
    					default: [
    						create_default_slot_1$1,
    						({ matches }) => ({ 0: matches }),
    						({ matches }) => matches ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	mediaquery1 = new MediaQuery({
    			props: {
    				query: "(max-width: 480px)",
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ matches }) => ({ 0: matches }),
    						({ matches }) => matches ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	buttoncomp = new ButtonComp({ $$inline: true });
    	footercomp = new FooterComp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(headercomp.$$.fragment);
    			t0 = space();
    			main = element("main");
    			section0 = element("section");
    			h10 = element("h1");
    			t1 = text("CollegeからUniversityへ転学");
    			br0 = element("br");
    			t2 = text("\n      Universityへ進学するための");
    			br1 = element("br");
    			t3 = space();
    			strong0 = element("strong");
    			t4 = text("世界最高レベルの添削サービス");
    			t5 = space();
    			div0 = element("div");
    			h20 = element("h2");
    			t6 = text("あなたの合格率を劇的アップ！");
    			t7 = space();
    			section1 = element("section");
    			div1 = element("div");
    			h11 = element("h1");
    			t8 = text("転学・進学に重要なものって？");
    			t9 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t10 = text("転学・進学の合格に非常に重要になってくるのが、エッセイです。エッセイが最も重要な要素と言っても");
    			br2 = element("br");
    			t11 = text("\n        過言ではありません。でも、実際に願書の準備などを始めてエッセイを書き始めてみると、");
    			br3 = element("br");
    			t12 = text("\n        受かるエッセイにするのは非常に難しい問題です。");
    			t13 = space();
    			section2 = element("section");
    			div3 = element("div");
    			h21 = element("h2");
    			t14 = text("FORIS ESSAYはあなたのエッセイを");
    			strong1 = element("strong");
    			t15 = text("受かる");
    			t16 = text("エッセイにします！");
    			t17 = space();
    			div4 = element("div");
    			create_component(featurecomp0.$$.fragment);
    			t18 = space();
    			create_component(featurecomp1.$$.fragment);
    			t19 = space();
    			section3 = element("section");
    			div5 = element("div");
    			t20 = space();
    			div6 = element("div");
    			p1 = element("p");
    			t21 = text("人生のキャリアが変わる大きな節目に世界最高レベルの添削サービスで");
    			br4 = element("br");
    			t22 = text("\n        希望校への");
    			strong2 = element("strong");
    			t23 = text("合格");
    			t24 = text("を共に果たしましょう！");
    			t25 = space();
    			section4 = element("section");
    			div7 = element("div");
    			h22 = element("h2");
    			t26 = text("FORIS ESSAY講師紹介");
    			t27 = space();
    			div8 = element("div");
    			create_component(staffcomp0.$$.fragment);
    			t28 = space();
    			create_component(staffcomp1.$$.fragment);
    			t29 = space();
    			section5 = element("section");
    			div9 = element("div");
    			h23 = element("h2");
    			t30 = text("よくあるご質問");
    			t31 = space();
    			div10 = element("div");
    			create_component(qacomp0.$$.fragment);
    			t32 = space();
    			create_component(qacomp1.$$.fragment);
    			t33 = space();
    			create_component(qacomp2.$$.fragment);
    			t34 = space();
    			create_component(qacomp3.$$.fragment);
    			t35 = space();
    			section6 = element("section");
    			div11 = element("div");
    			h24 = element("h2");
    			t36 = text("全体の流れ");
    			t37 = space();
    			div12 = element("div");
    			p2 = element("p");
    			t38 = text("1.ご応募　＞＞　2.日程調整　＞＞　3.添削開始 　＞＞　4.出願");
    			t39 = space();
    			section7 = element("section");
    			div15 = element("div");
    			div13 = element("div");
    			create_component(mediaquery0.$$.fragment);
    			t40 = space();
    			create_component(mediaquery1.$$.fragment);
    			t41 = space();
    			div14 = element("div");
    			create_component(buttoncomp.$$.fragment);
    			t42 = space();
    			create_component(footercomp.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			claim_component(headercomp.$$.fragment, nodes);
    			t0 = claim_space(nodes);
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			section0 = claim_element(main_nodes, "SECTION", { class: true });
    			var section0_nodes = children(section0);
    			h10 = claim_element(section0_nodes, "H1", { class: true });
    			var h10_nodes = children(h10);
    			t1 = claim_text(h10_nodes, "CollegeからUniversityへ転学");
    			br0 = claim_element(h10_nodes, "BR", { class: true });
    			t2 = claim_text(h10_nodes, "\n      Universityへ進学するための");
    			br1 = claim_element(h10_nodes, "BR", { class: true });
    			t3 = claim_space(h10_nodes);
    			strong0 = claim_element(h10_nodes, "STRONG", { class: true });
    			var strong0_nodes = children(strong0);
    			t4 = claim_text(strong0_nodes, "世界最高レベルの添削サービス");
    			strong0_nodes.forEach(detach_dev);
    			h10_nodes.forEach(detach_dev);
    			t5 = claim_space(section0_nodes);
    			div0 = claim_element(section0_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			h20 = claim_element(div0_nodes, "H2", { class: true });
    			var h20_nodes = children(h20);
    			t6 = claim_text(h20_nodes, "あなたの合格率を劇的アップ！");
    			h20_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			section0_nodes.forEach(detach_dev);
    			t7 = claim_space(main_nodes);
    			section1 = claim_element(main_nodes, "SECTION", { class: true });
    			var section1_nodes = children(section1);
    			div1 = claim_element(section1_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h11 = claim_element(div1_nodes, "H1", { class: true });
    			var h11_nodes = children(h11);
    			t8 = claim_text(h11_nodes, "転学・進学に重要なものって？");
    			h11_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			t9 = claim_space(section1_nodes);
    			div2 = claim_element(section1_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			p0 = claim_element(div2_nodes, "P", { class: true });
    			var p0_nodes = children(p0);
    			t10 = claim_text(p0_nodes, "転学・進学の合格に非常に重要になってくるのが、エッセイです。エッセイが最も重要な要素と言っても");
    			br2 = claim_element(p0_nodes, "BR", { class: true });
    			t11 = claim_text(p0_nodes, "\n        過言ではありません。でも、実際に願書の準備などを始めてエッセイを書き始めてみると、");
    			br3 = claim_element(p0_nodes, "BR", { class: true });
    			t12 = claim_text(p0_nodes, "\n        受かるエッセイにするのは非常に難しい問題です。");
    			p0_nodes.forEach(detach_dev);
    			div2_nodes.forEach(detach_dev);
    			section1_nodes.forEach(detach_dev);
    			t13 = claim_space(main_nodes);
    			section2 = claim_element(main_nodes, "SECTION", { class: true });
    			var section2_nodes = children(section2);
    			div3 = claim_element(section2_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			h21 = claim_element(div3_nodes, "H2", { class: true });
    			var h21_nodes = children(h21);
    			t14 = claim_text(h21_nodes, "FORIS ESSAYはあなたのエッセイを");
    			strong1 = claim_element(h21_nodes, "STRONG", { class: true });
    			var strong1_nodes = children(strong1);
    			t15 = claim_text(strong1_nodes, "受かる");
    			strong1_nodes.forEach(detach_dev);
    			t16 = claim_text(h21_nodes, "エッセイにします！");
    			h21_nodes.forEach(detach_dev);
    			div3_nodes.forEach(detach_dev);
    			t17 = claim_space(section2_nodes);
    			div4 = claim_element(section2_nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			claim_component(featurecomp0.$$.fragment, div4_nodes);
    			t18 = claim_space(div4_nodes);
    			claim_component(featurecomp1.$$.fragment, div4_nodes);
    			div4_nodes.forEach(detach_dev);
    			section2_nodes.forEach(detach_dev);
    			t19 = claim_space(main_nodes);
    			section3 = claim_element(main_nodes, "SECTION", { class: true });
    			var section3_nodes = children(section3);
    			div5 = claim_element(section3_nodes, "DIV", { class: true });
    			children(div5).forEach(detach_dev);
    			t20 = claim_space(section3_nodes);
    			div6 = claim_element(section3_nodes, "DIV", { class: true });
    			var div6_nodes = children(div6);
    			p1 = claim_element(div6_nodes, "P", { class: true });
    			var p1_nodes = children(p1);
    			t21 = claim_text(p1_nodes, "人生のキャリアが変わる大きな節目に世界最高レベルの添削サービスで");
    			br4 = claim_element(p1_nodes, "BR", { class: true });
    			t22 = claim_text(p1_nodes, "\n        希望校への");
    			strong2 = claim_element(p1_nodes, "STRONG", { class: true });
    			var strong2_nodes = children(strong2);
    			t23 = claim_text(strong2_nodes, "合格");
    			strong2_nodes.forEach(detach_dev);
    			t24 = claim_text(p1_nodes, "を共に果たしましょう！");
    			p1_nodes.forEach(detach_dev);
    			div6_nodes.forEach(detach_dev);
    			section3_nodes.forEach(detach_dev);
    			t25 = claim_space(main_nodes);
    			section4 = claim_element(main_nodes, "SECTION", { class: true });
    			var section4_nodes = children(section4);
    			div7 = claim_element(section4_nodes, "DIV", { class: true });
    			var div7_nodes = children(div7);
    			h22 = claim_element(div7_nodes, "H2", { class: true });
    			var h22_nodes = children(h22);
    			t26 = claim_text(h22_nodes, "FORIS ESSAY講師紹介");
    			h22_nodes.forEach(detach_dev);
    			div7_nodes.forEach(detach_dev);
    			t27 = claim_space(section4_nodes);
    			div8 = claim_element(section4_nodes, "DIV", { class: true });
    			var div8_nodes = children(div8);
    			claim_component(staffcomp0.$$.fragment, div8_nodes);
    			t28 = claim_space(div8_nodes);
    			claim_component(staffcomp1.$$.fragment, div8_nodes);
    			div8_nodes.forEach(detach_dev);
    			section4_nodes.forEach(detach_dev);
    			t29 = claim_space(main_nodes);
    			section5 = claim_element(main_nodes, "SECTION", { class: true });
    			var section5_nodes = children(section5);
    			div9 = claim_element(section5_nodes, "DIV", { class: true });
    			var div9_nodes = children(div9);
    			h23 = claim_element(div9_nodes, "H2", { class: true });
    			var h23_nodes = children(h23);
    			t30 = claim_text(h23_nodes, "よくあるご質問");
    			h23_nodes.forEach(detach_dev);
    			div9_nodes.forEach(detach_dev);
    			t31 = claim_space(section5_nodes);
    			div10 = claim_element(section5_nodes, "DIV", { class: true });
    			var div10_nodes = children(div10);
    			claim_component(qacomp0.$$.fragment, div10_nodes);
    			t32 = claim_space(div10_nodes);
    			claim_component(qacomp1.$$.fragment, div10_nodes);
    			t33 = claim_space(div10_nodes);
    			claim_component(qacomp2.$$.fragment, div10_nodes);
    			t34 = claim_space(div10_nodes);
    			claim_component(qacomp3.$$.fragment, div10_nodes);
    			div10_nodes.forEach(detach_dev);
    			section5_nodes.forEach(detach_dev);
    			t35 = claim_space(main_nodes);
    			section6 = claim_element(main_nodes, "SECTION", { class: true });
    			var section6_nodes = children(section6);
    			div11 = claim_element(section6_nodes, "DIV", { class: true });
    			var div11_nodes = children(div11);
    			h24 = claim_element(div11_nodes, "H2", { class: true });
    			var h24_nodes = children(h24);
    			t36 = claim_text(h24_nodes, "全体の流れ");
    			h24_nodes.forEach(detach_dev);
    			div11_nodes.forEach(detach_dev);
    			t37 = claim_space(section6_nodes);
    			div12 = claim_element(section6_nodes, "DIV", { class: true });
    			var div12_nodes = children(div12);
    			p2 = claim_element(div12_nodes, "P", { class: true });
    			var p2_nodes = children(p2);
    			t38 = claim_text(p2_nodes, "1.ご応募　＞＞　2.日程調整　＞＞　3.添削開始 　＞＞　4.出願");
    			p2_nodes.forEach(detach_dev);
    			div12_nodes.forEach(detach_dev);
    			section6_nodes.forEach(detach_dev);
    			t39 = claim_space(main_nodes);
    			section7 = claim_element(main_nodes, "SECTION", { class: true });
    			var section7_nodes = children(section7);
    			div15 = claim_element(section7_nodes, "DIV", { class: true });
    			var div15_nodes = children(div15);
    			div13 = claim_element(div15_nodes, "DIV", { class: true });
    			var div13_nodes = children(div13);
    			claim_component(mediaquery0.$$.fragment, div13_nodes);
    			t40 = claim_space(div13_nodes);
    			claim_component(mediaquery1.$$.fragment, div13_nodes);
    			div13_nodes.forEach(detach_dev);
    			t41 = claim_space(div15_nodes);
    			div14 = claim_element(div15_nodes, "DIV", { class: true });
    			var div14_nodes = children(div14);
    			claim_component(buttoncomp.$$.fragment, div14_nodes);
    			div14_nodes.forEach(detach_dev);
    			div15_nodes.forEach(detach_dev);
    			section7_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			t42 = claim_space(nodes);
    			claim_component(footercomp.$$.fragment, nodes);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(br0, "class", "svelte-11d9n2");
    			add_location(br0, file$7, 15, 28, 557);
    			attr_dev(br1, "class", "svelte-11d9n2");
    			add_location(br1, file$7, 16, 24, 588);
    			attr_dev(strong0, "class", "svelte-11d9n2");
    			add_location(strong0, file$7, 17, 6, 601);
    			attr_dev(h10, "class", "ttl area_about_child svelte-11d9n2");
    			add_location(h10, file$7, 14, 4, 495);
    			attr_dev(h20, "class", "right_ttl svelte-11d9n2");
    			add_location(h20, file$7, 20, 6, 701);
    			attr_dev(div0, "class", "area_about_child area_about_right svelte-11d9n2");
    			add_location(div0, file$7, 19, 4, 647);
    			attr_dev(section0, "class", "area area_about svelte-11d9n2");
    			add_location(section0, file$7, 13, 2, 457);
    			attr_dev(h11, "class", "ttl svelte-11d9n2");
    			add_location(h11, file$7, 26, 6, 858);
    			attr_dev(div1, "class", "head_home svelte-11d9n2");
    			add_location(div1, file$7, 25, 4, 828);
    			attr_dev(br2, "class", "svelte-11d9n2");
    			add_location(br2, file$7, 30, 55, 1016);
    			attr_dev(br3, "class", "svelte-11d9n2");
    			add_location(br3, file$7, 32, 49, 1080);
    			attr_dev(p0, "class", "paragraph svelte-11d9n2");
    			add_location(p0, file$7, 29, 6, 939);
    			attr_dev(div2, "class", "body_home svelte-11d9n2");
    			add_location(div2, file$7, 28, 4, 909);
    			attr_dev(section1, "class", "area area_need svelte-11d9n2");
    			add_location(section1, file$7, 24, 2, 791);
    			attr_dev(strong1, "class", "svelte-11d9n2");
    			add_location(strong1, file$7, 42, 29, 1307);
    			attr_dev(h21, "class", "ttl svelte-11d9n2");
    			add_location(h21, file$7, 41, 6, 1261);
    			attr_dev(div3, "class", "head_home svelte-11d9n2");
    			add_location(div3, file$7, 40, 4, 1231);
    			attr_dev(div4, "class", "body_home svelte-11d9n2");
    			add_location(div4, file$7, 45, 4, 1364);
    			attr_dev(section2, "class", "area area_features svelte-11d9n2");
    			add_location(section2, file$7, 39, 2, 1190);
    			attr_dev(div5, "class", "triangle svelte-11d9n2");
    			add_location(div5, file$7, 64, 4, 1848);
    			attr_dev(br4, "class", "svelte-11d9n2");
    			add_location(br4, file$7, 67, 40, 1971);
    			attr_dev(strong2, "class", "svelte-11d9n2");
    			add_location(strong2, file$7, 68, 13, 1991);
    			attr_dev(p1, "class", "description svelte-11d9n2");
    			add_location(p1, file$7, 66, 6, 1907);
    			attr_dev(div6, "class", "body_home svelte-11d9n2");
    			add_location(div6, file$7, 65, 4, 1877);
    			attr_dev(section3, "class", "area_goal svelte-11d9n2");
    			add_location(section3, file$7, 63, 2, 1816);
    			attr_dev(h22, "class", "ttl svelte-11d9n2");
    			add_location(h22, file$7, 75, 6, 2143);
    			attr_dev(div7, "class", "head_home svelte-11d9n2");
    			add_location(div7, file$7, 74, 4, 2113);
    			attr_dev(div8, "class", "body_home svelte-11d9n2");
    			add_location(div8, file$7, 77, 4, 2195);
    			attr_dev(section4, "class", "area area_staff svelte-11d9n2");
    			add_location(section4, file$7, 73, 2, 2075);
    			attr_dev(h23, "class", "ttl svelte-11d9n2");
    			add_location(h23, file$7, 107, 6, 3047);
    			attr_dev(div9, "class", "head_home svelte-11d9n2");
    			add_location(div9, file$7, 106, 4, 3017);
    			attr_dev(div10, "class", "body_home svelte-11d9n2");
    			add_location(div10, file$7, 109, 4, 3091);
    			attr_dev(section5, "class", "area area_qa svelte-11d9n2");
    			add_location(section5, file$7, 105, 2, 2982);
    			attr_dev(h24, "class", "ttl svelte-11d9n2");
    			add_location(h24, file$7, 136, 6, 3883);
    			attr_dev(div11, "class", "head_home svelte-11d9n2");
    			add_location(div11, file$7, 135, 4, 3853);
    			attr_dev(p2, "class", "flow svelte-11d9n2");
    			add_location(p2, file$7, 139, 6, 3955);
    			attr_dev(div12, "class", "body_home svelte-11d9n2");
    			add_location(div12, file$7, 138, 4, 3925);
    			attr_dev(section6, "class", "area area_flow svelte-11d9n2");
    			add_location(section6, file$7, 134, 2, 3816);
    			attr_dev(div13, "class", "image_container svelte-11d9n2");
    			add_location(div13, file$7, 147, 6, 4138);
    			attr_dev(div14, "class", "subscribe_btn_container svelte-11d9n2");
    			add_location(div14, file$7, 167, 6, 4718);
    			attr_dev(div15, "class", "body_home svelte-11d9n2");
    			add_location(div15, file$7, 146, 4, 4108);
    			attr_dev(section7, "class", "area area_subscribe svelte-11d9n2");
    			add_location(section7, file$7, 145, 2, 4066);
    			attr_dev(main, "class", "svelte-11d9n2");
    			add_location(main, file$7, 11, 0, 429);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headercomp, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, h10);
    			append_dev(h10, t1);
    			append_dev(h10, br0);
    			append_dev(h10, t2);
    			append_dev(h10, br1);
    			append_dev(h10, t3);
    			append_dev(h10, strong0);
    			append_dev(strong0, t4);
    			append_dev(section0, t5);
    			append_dev(section0, div0);
    			append_dev(div0, h20);
    			append_dev(h20, t6);
    			append_dev(main, t7);
    			append_dev(main, section1);
    			append_dev(section1, div1);
    			append_dev(div1, h11);
    			append_dev(h11, t8);
    			append_dev(section1, t9);
    			append_dev(section1, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t10);
    			append_dev(p0, br2);
    			append_dev(p0, t11);
    			append_dev(p0, br3);
    			append_dev(p0, t12);
    			append_dev(main, t13);
    			append_dev(main, section2);
    			append_dev(section2, div3);
    			append_dev(div3, h21);
    			append_dev(h21, t14);
    			append_dev(h21, strong1);
    			append_dev(strong1, t15);
    			append_dev(h21, t16);
    			append_dev(section2, t17);
    			append_dev(section2, div4);
    			mount_component(featurecomp0, div4, null);
    			append_dev(div4, t18);
    			mount_component(featurecomp1, div4, null);
    			append_dev(main, t19);
    			append_dev(main, section3);
    			append_dev(section3, div5);
    			append_dev(section3, t20);
    			append_dev(section3, div6);
    			append_dev(div6, p1);
    			append_dev(p1, t21);
    			append_dev(p1, br4);
    			append_dev(p1, t22);
    			append_dev(p1, strong2);
    			append_dev(strong2, t23);
    			append_dev(p1, t24);
    			append_dev(main, t25);
    			append_dev(main, section4);
    			append_dev(section4, div7);
    			append_dev(div7, h22);
    			append_dev(h22, t26);
    			append_dev(section4, t27);
    			append_dev(section4, div8);
    			mount_component(staffcomp0, div8, null);
    			append_dev(div8, t28);
    			mount_component(staffcomp1, div8, null);
    			append_dev(main, t29);
    			append_dev(main, section5);
    			append_dev(section5, div9);
    			append_dev(div9, h23);
    			append_dev(h23, t30);
    			append_dev(section5, t31);
    			append_dev(section5, div10);
    			mount_component(qacomp0, div10, null);
    			append_dev(div10, t32);
    			mount_component(qacomp1, div10, null);
    			append_dev(div10, t33);
    			mount_component(qacomp2, div10, null);
    			append_dev(div10, t34);
    			mount_component(qacomp3, div10, null);
    			append_dev(main, t35);
    			append_dev(main, section6);
    			append_dev(section6, div11);
    			append_dev(div11, h24);
    			append_dev(h24, t36);
    			append_dev(section6, t37);
    			append_dev(section6, div12);
    			append_dev(div12, p2);
    			append_dev(p2, t38);
    			append_dev(main, t39);
    			append_dev(main, section7);
    			append_dev(section7, div15);
    			append_dev(div15, div13);
    			mount_component(mediaquery0, div13, null);
    			append_dev(div13, t40);
    			mount_component(mediaquery1, div13, null);
    			append_dev(div15, t41);
    			append_dev(div15, div14);
    			mount_component(buttoncomp, div14, null);
    			insert_dev(target, t42, anchor);
    			mount_component(footercomp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mediaquery0_changes = {};

    			if (dirty & /*$$scope, matches*/ 3) {
    				mediaquery0_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery0.$set(mediaquery0_changes);
    			const mediaquery1_changes = {};

    			if (dirty & /*$$scope, matches*/ 3) {
    				mediaquery1_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery1.$set(mediaquery1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headercomp.$$.fragment, local);
    			transition_in(featurecomp0.$$.fragment, local);
    			transition_in(featurecomp1.$$.fragment, local);
    			transition_in(staffcomp0.$$.fragment, local);
    			transition_in(staffcomp1.$$.fragment, local);
    			transition_in(qacomp0.$$.fragment, local);
    			transition_in(qacomp1.$$.fragment, local);
    			transition_in(qacomp2.$$.fragment, local);
    			transition_in(qacomp3.$$.fragment, local);
    			transition_in(mediaquery0.$$.fragment, local);
    			transition_in(mediaquery1.$$.fragment, local);
    			transition_in(buttoncomp.$$.fragment, local);
    			transition_in(footercomp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headercomp.$$.fragment, local);
    			transition_out(featurecomp0.$$.fragment, local);
    			transition_out(featurecomp1.$$.fragment, local);
    			transition_out(staffcomp0.$$.fragment, local);
    			transition_out(staffcomp1.$$.fragment, local);
    			transition_out(qacomp0.$$.fragment, local);
    			transition_out(qacomp1.$$.fragment, local);
    			transition_out(qacomp2.$$.fragment, local);
    			transition_out(qacomp3.$$.fragment, local);
    			transition_out(mediaquery0.$$.fragment, local);
    			transition_out(mediaquery1.$$.fragment, local);
    			transition_out(buttoncomp.$$.fragment, local);
    			transition_out(footercomp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headercomp, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(featurecomp0);
    			destroy_component(featurecomp1);
    			destroy_component(staffcomp0);
    			destroy_component(staffcomp1);
    			destroy_component(qacomp0);
    			destroy_component(qacomp1);
    			destroy_component(qacomp2);
    			destroy_component(qacomp3);
    			destroy_component(mediaquery0);
    			destroy_component(mediaquery1);
    			destroy_component(buttoncomp);
    			if (detaching) detach_dev(t42);
    			destroy_component(footercomp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		MediaQuery,
    		ButtonComp,
    		HeaderComp,
    		FooterComp,
    		QAComp,
    		FeatureComp,
    		StaffComp
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/Subscribe.svelte generated by Svelte v3.31.2 */

    const file$8 = "src/routes/Subscribe.svelte";

    function create_fragment$b(ctx) {
    	let main;
    	let t;

    	const block = {
    		c: function create() {
    			main = element("main");
    			t = text("hi!");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			t = claim_text(main_nodes, "hi!");
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(main, file$8, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Subscribe", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Subscribe> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Subscribe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Subscribe",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/NotFound.svelte generated by Svelte v3.31.2 */
    const file$9 = "src/routes/NotFound.svelte";

    // (7:2) <Link to="/">
    function create_default_slot$2(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text("ホームページに移動する");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h3 = claim_element(nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t = claim_text(h3_nodes, "ホームページに移動する");
    			h3_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h3, "class", "link_style svelte-1hz4ywg");
    			add_location(h3, file$9, 6, 15, 138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(7:2) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("404: ページが見つかりませんでした！");
    			t1 = space();
    			create_component(link.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			h1 = claim_element(div_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "404: ページが見つかりませんでした！");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(div_nodes);
    			claim_component(link.$$.fragment, div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "ttl svelte-1hz4ywg");
    			add_location(h1, file$9, 5, 2, 81);
    			attr_dev(div, "class", "root svelte-1hz4ywg");
    			add_location(div, file$9, 4, 0, 60);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			mount_component(link, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.2 */
    const file$a = "src/App.svelte";

    // (10:0) <Router {url}>
    function create_default_slot$3(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "subscribe", component: Subscribe },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: { path: "*", component: NotFound },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", {});
    			var div_nodes = children(div);
    			claim_component(route0.$$.fragment, div_nodes);
    			t0 = claim_space(div_nodes);
    			claim_component(route1.$$.fragment, div_nodes);
    			t1 = claim_space(div_nodes);
    			claim_component(route2.$$.fragment, div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(div, file$a, 10, 2, 253);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(10:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(router.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Home,
    		Subscribe,
    		NotFound,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      hydrate: true,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

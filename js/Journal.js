const CRLF = String.fromCharCode(13) + String.fromCharCode(10);
export default class Journal {
    /**
     * Creates an instance of Journal.
     * @param {Node} [parentEl]
     *
     * @memberof Journal
     */
    constructor(parentEl = undefined) {
        const el = document.createElement("div");
        el.classList.add("journal");

        if (parentEl) {
            parentEl.appendChild(el);
        }

        this._el = el;
    }

    /**
     * Internal method that processes multiple text lines
     *
     * @param {Array<String|Array<String>>} text
     * @returns {string}
     *
     * @memberof Journal
     */
    _processText(...text) {
        return text
            .map(line => line instanceof Array ? this._processText(...line) : line)
            .map(line => line ? line.replace(/\\n/g, CRLF) : "")
            .join("");

    }

    /**
     * Writes text to the journal, replacing \n with CRLF; coalesces
     * multiple blank lines to one
     *
     * @param {Array<String|Array<String>>} text
     *
     * @memberof Journal
     */
    write(...text) {
        this._el.textContent += this._processText(...text).replace(/^\n\n/gm, CRLF);
    }

    /**
     * Clears the journal
     *
     * @memberof Journal
     */
    clear() {
        this._el.textContent = "";
    }
}
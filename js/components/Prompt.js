export default class Prompt {

    /**
     * Creates an instance of Prompt.
     * @param {Node} [parentEl]
     *
     *
     * We construct a dom tree like this:
     *
     *  <form method="get" action="#" id="commandForm">
     *      <input id="command" type="text"/>
     *  </form>
     *
     * @memberof Prompt
     */
    constructor(parentEl = undefined) {
        const formEl = document.createElement("form");
        formEl.setAttribute("method", "get");
        formEl.setAttribute("action", "#");
        formEl.classList.add("prompt");

        const inputEl = document.createElement("input");
        inputEl.setAttribute("type", "text");
        inputEl.setAttribute("disabled", "disabled");
        inputEl.classList.add("command");

        formEl.appendChild(inputEl);

        if (parentEl) {
            parentEl.appendChild(formEl);
        }

        this._formEl = formEl;
        this._inputEl = inputEl;

    }

    /**
     * waits for user input with an optional timeout. user input resolves the
     * promise, while a timeout rejects the promise.
     *
     * @param {any} [timeout] timeout in ms
     * @returns Promise
     *
     * @memberof Prompt
     */
    getInput(timeout = undefined) {
        this._inputEl.removeAttribute("disabled");
        this._inputEl.scrollIntoView(false);
        this._inputEl.focus();
        return new Promise((resolve, reject) => {
            let timerId, timedOut = false;
            if (timeout) {
                timerId = setTimeout(() => {
                    timedOut = true;
                    this._inputEl.value = "";
                    this._inputEl.setAttribute("disabled", "disabled");
                    reject();
                }, timeout);
            }
            this._formEl.addEventListener("submit", (evt) => {
                evt.preventDefault();
                if (!timedOut) {
                    clearTimeout(timerId);
                    resolve(this._inputEl.value);
                }
                this._inputEl.value = "";
                this._inputEl.setAttribute("disabled", "disabled");
            }, {once: true});
        });
    }
}
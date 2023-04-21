export default function throttle(fn, delay) {
    let timer;
    return function() {
        let that = this;
        let arg = arguments
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(that, arg)
                timer = null
            }, delay);
        }

    }
}
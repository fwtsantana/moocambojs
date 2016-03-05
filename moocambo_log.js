module.exports = {
    $: function(func) {
        console.log("[LOG]", Object.keys(func).slice(-1)[0]);
    }
}
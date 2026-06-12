var FETCH_DATA = async function (url) {
    var data = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return (data.ok) ? await data.json() : "failed to fetch data";
}
FETCH_DATA("http://localhost:8000/api").then(function (e) {
    for (let i = 0; i < Object.keys(e).length; i++) {
        var data = Object.keys(e)[i];
        var res = e[data];
        console.log(res)
    }
});
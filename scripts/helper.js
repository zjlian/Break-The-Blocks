let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}
function object(o) {
    function F() { }
    F.prototype = o;
    return new F();
}
function inheritPrototype(subType, superType) {
    let prototype = object(superType.prototype);
    log(prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
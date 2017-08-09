let log = console.log.bind(console);

function imageFromPath(path) {
    let image = new Image();
    image.src = path;
    return image;
}
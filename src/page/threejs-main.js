const THREE = require('three');

var main = function(selector, width, height) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, width / height);
    camera.position.set(0, 0, 50);
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    const obj = document.querySelector(selector);
    obj.appendChild(renderer.domElement);
    var geometry = new THREE.CubeGeometry(14, 14, 14);
    var material = new THREE.MeshBasicMaterial({
        color: "green"
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    obj.addEventListener('mousemove', onMouseMove);
    var mouse = {
        x: 0,
        y: 0
    };

    function onMouseMove(e) {
        var rect = e.target.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.x = (mouse.x / width) * 2 - 1;
        mouse.y = -(mouse.y / height) * 2 + 1;
        var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
        vector.unproject(camera);
        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var objs = ray.intersectObjects(scene.children);
        if (objs.length > 0) {
            material.color.set("blue");
        }
    }
    (function update() {
        requestAnimationFrame(update);
        mesh.rotation.set(
            0,
            mesh.rotation.y + .02,
            mesh.rotation.z + .02
        );
        renderer.render(scene, camera);
    })();
};

module.exports = main;
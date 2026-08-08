(function (document, window) {
    'use strict';

    var impressThreePlugin = function (root) {
        var scene, camera, renderer;
        var objects = [];
        var impressScale = 1;
        var fov = 75; // TODO: calc the correct fov
        var currentTween;

        function init() {
            var threeContainer = document.getElementById('impress-three-container');

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            threeContainer.appendChild(renderer.domElement);

            // TODO: just for dev, to be removed
            addObjects();

            requestAnimationFrame(animate);
            window.addEventListener('resize', onWindowResize, false);
        }

        function addObjects() {
            var gridHelper = new THREE.GridHelper(2000, 20);
            scene.add(gridHelper);

            for (var i = 0; i < 50; i++) {
                var geometry = new THREE.BoxGeometry(50, 50, 50);
                var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true });
                var cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    Math.random() * 2000 - 1000,
                    Math.random() * 2000 - 1000,
                    Math.random() * 2000 - 1000
                );
                scene.add(cube);
                objects.push(cube);
            }
        }

        function animate(time) {
            requestAnimationFrame(animate);

            TWEEN.update(time);

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function updateCamera(x, y, z, rotateX, rotateY, rotateZ) {
            if (currentTween) {
                currentTween.stop();
            }
        
            const startPos = camera.position.clone();
            const startRot = camera.rotation.clone();
            
            // Adjust coordinates for Three.js
            var endPos = new THREE.Vector3(
                x * impressScale,
                -y * impressScale,
                -z * impressScale
            );
            var endRot = new THREE.Euler(
                THREE.MathUtils.degToRad(-rotateX),
                THREE.MathUtils.degToRad(rotateY),
                THREE.MathUtils.degToRad(-rotateZ)
            );

            var tweenObj = {
                x: startPos.x, y: startPos.y, z: startPos.z,
                rx: startRot.x, ry: startRot.y, rz: startRot.z
            };

            currentTween = new TWEEN.Tween(tweenObj)
                .to({
                    x: endPos.x, y: endPos.y, z: endPos.z,
                    rx: endRot.x, ry: endRot.y, rz: endRot.z
                }, 1000) // TODO: read from data-transition-duration
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(() => {
                    camera.position.set(tweenObj.x, tweenObj.y, tweenObj.z);
                    camera.rotation.set(tweenObj.rx, tweenObj.ry, tweenObj.rz);
                })
                .start();
        }

        function updateCameraFromStep(step) {
            var x = Number(step.dataset['x'] || 0);
            var y = Number(step.dataset['y'] || 0);
            var z = Number(step.dataset['z'] || 0);
            var rotateX = Number(step.dataset['rotateX'] || 0);
            var rotateY = Number(step.dataset['rotateY'] || 0);
            var rotateZ = Number(step.dataset['rotateZ'] || 0);

            updateCamera(x, y, z, rotateX, rotateY, rotateZ);
        }

        init();

        document.addEventListener("impress:stepleave", function (event) {
            // TODO: latency exists, consider a better solution
            // Or maybe it's beacouse of easing function?
            var nextStep = event.detail.next;
            updateCameraFromStep(nextStep);
        });

        return {
            updateCamera: updateCamera
        };
    };

    impress.addPreInitPlugin(impressThreePlugin);

})(document, window);
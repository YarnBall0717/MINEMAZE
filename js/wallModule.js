function createWall(positionX, positionZ, group) 
{
    const x = positionX * 8;
    const y = 0;
    const z = positionZ * 8;

    const physicsMaterial = new CANNON.Material('slipperyMaterial');
    const blockBody = new CANNON.Body({ mass: 0, material: physicsMaterial });

    const vec = new CANNON.Vec3(4, 16, 4);
    const blockShape = new CANNON.Box(vec);
    blockBody.addShape(blockShape);

    const blockGeometry = new THREE.BoxGeometry(8, 32, 8);
    const textureLoader = new THREE.TextureLoader();
    const blockMaterial = [];

    let wallTexture;
    for (let i = 0; i < 6; i++)
    {
        if(i == 2 || i == 3)
            wallTexture = textureLoader.load('./image/wallSkin_oak_8x8.png');

        else
        wallTexture = textureLoader.load('./image/wallSkin_oak_32x8.png');

        blockMaterial.push(new THREE.MeshPhongMaterial({ map: wallTexture }));
    }
    const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);

    blockBody.position.set(x, y, z);
    blockMesh.position.set(x, y, z);

    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;

    let blocks = [];
    let blockMeshes = [];
    blocks.push(blockBody);
    blockMeshes.push(blockMesh);

    world.addBody(blockBody);
    group.add(blockMesh);
}

function setMaze(group)
{
    scene.add(group);
}

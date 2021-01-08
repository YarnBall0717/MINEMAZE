let renderer, scene, camera

let world
let controls
let groundBody
let playerBody
const dt = 1.0 / 60.0 // seconds
let time = Date.now()

let sphereShape = new CANNON.Sphere(1.5)
let end = 0;

const originData = {
    AccumulatingTime: 0 
}
const AccumulatingTimeDOM = document.getElementById('AccumulatingTime')


//three scene初始化
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x80adfc)
    //scene.fog = new THREE.FogExp2(0x80adfc, 0.0008)
}

//camera初始化
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    // camera.position.set(20, 20, 20)
    // camera.lookAt(scene.position)
}
  
//渲染器 初始化
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0x80adfc, 1.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap
}

//光源 初始化
function initLight() {
    // 設置環境光提供輔助柔和白光
    let ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    // spotlight
    light = new THREE.SpotLight(0xffffff)
    light.position.set(200, 400, 200)
    light.target.position.set(0, 0, 0)
    light.castShadow = true
    light.shadow.camera.near = 20
    light.shadow.camera.far = 500 //camera.far;
    light.shadow.camera.fov = 70
    light.shadowMapBias = 0.1
    light.shadowMapDarkness = 0.7
    light.shadow.mapSize.width = 2 * 512
    light.shadow.mapSize.height = 2 * 512
    // let spotLightHelper = new THREE.SpotLightHelper(light)
    // scene.add(spotLightHelper)
    scene.add(light)

    let directionalLight = new THREE.DirectionalLight(0x555555)
    directionalLight.position.set(100, 100, 100)
    // directionalLight.castShadow = true
    scene.add(directionalLight)

    let hemiLight = new THREE.HemisphereLight(0x000022, 0x002200, 0.5)
    hemiLight.position.set(0, 300, 0)
    scene.add(hemiLight)
}

//初始化 一個cannon世界
function initCannon() {
    // 初始化 cannon.js、重力、碰撞偵測
    world = new CANNON.World()
    world.gravity.set(0, -20, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
  
    // 解算器設定
    const solver = new CANNON.GSSolver()
    solver.iterations = 7
    solver.tolerance = 0.1
    const split = false
    if (split) world.solver = new CANNON.SplitSolver(solver)
    else world.solver = solver
  
    // 接觸材質相關設定（摩擦力、恢復係數）
    world.defaultContactMaterial.contactEquationStiffness = 1e9
    world.defaultContactMaterial.contactEquationRelaxation = 4
    physicsMaterial = new CANNON.Material('slipperyMaterial')
    const physicsContactMaterial = new CANNON.ContactMaterial(
      physicsMaterial,
      physicsMaterial,
      0.0,
      0.3
    )
    world.addContactMaterial(physicsContactMaterial)
  
    // 鼠標控制器剛體
    // const playerShapeVec3 = new CANNON.Vec3(1, 1, 1)
    // const playerShape = new CANNON.Box(playerShapeVec3)
    playerBody = new CANNON.Body({ mass: 5 })
    playerBody.addShape(sphereShape)
    playerBody.position.set(8, 2, 8)
    playerBody.linearDamping = 0.9
    world.addBody(playerBody)
  
    // cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)
}

//建立地板
function createGround() {
    // 建立地板剛體
    let groundShape = new CANNON.Plane(2000,2000,2000)
    // let groundCM = new CANNON.Material()
    groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: physicsMaterial
    })
    // setFromAxisAngle 旋轉 x 軸 -90 度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.add(groundBody)
    const textureLoader = new THREE.TextureLoader()
    const groundTexture = textureLoader.load('./image/ground_grass.png')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(1000, 1000)
    groundTexture.anisotropy = 16
  
    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })
  
    ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      groundMaterial
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    ground.name = 'floor'
    scene.add(ground)
  }
function initGameData() {
    gameData = originData
    gameData.prevTime = new Date()
    AccumulatingTimeDOM.textContent = gameData.AccumulatingTime / 1000
}
function createpillar()
{
  //建立起點終點柱子
  const pillarGeometry = new THREE.BoxGeometry(2, 512, 2);
  pillarSMaterial=new THREE.MeshBasicMaterial( { color: 0x00ff00 });
  pillarEMaterial=new THREE.MeshBasicMaterial( { color: 0xff0000 });
  pillarStart=new THREE.Mesh(pillarGeometry,pillarSMaterial);
  pillarEnd=new THREE.Mesh(pillarGeometry,pillarEMaterial);
  pillarStart.position.set(8,0,8)
  pillarEnd.position.set(185,0,185)
  pillarStart.castShadow = true;
  pillarStart.receiveShadow = true;
  pillarEnd.castShadow = true;
  pillarEnd.receiveShadow = true;
  scene.add(pillarStart);
  scene.add(pillarEnd)

}
function init() {
    initCannon()
    initScene()
    initCamera()
    initPointerLockControls()
    initRenderer()
    initLight()
    initGameData()
    createpillar( )
    main()
    createGround()

  
    document.body.appendChild(renderer.domElement)
  }

//網頁大小改變時 將camera畫面隨之縮放
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

//渲染器設定
function render() {
    requestAnimationFrame(render)

    if (controls.enabled) {
        world.step(dt)
  
        gameData.AccumulatingTime += new Date() - gameData.prevTime
        AccumulatingTimeDOM.textContent = parseInt(gameData.AccumulatingTime / 1000)
        gameData.prevTime = new Date()

    }
    controls.update(Date.now() - time)
    time = Date.now()


    renderer.render(scene, camera)
}


init()
render()

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema } from '@pixiv/three-vrm'
import { convertToObject } from 'typescript';

window.addEventListener("DOMContentLoaded", () => {
  // canvasの取得
  var canvas = <HTMLCanvasElement>document.getElementById('canvas');

  // model_pathの取得
  var modelPass = '../static/base_model/Miraikomachi.vrm';
  //var modelPass = '../static/base_model/base.vrm';
  //var posepass = '../static/pose/hellovrm.csv';
  var posepass = '../static/pose/hellomirai.csv';

  // シーンの設定
  const scene = new THREE.Scene()
  sceneOption()

  function sceneOption() {
    // ライトの設定
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    // グリッドを表示
    //const gridHelper = new THREE.GridHelper(10, 10)
    //scene.add(gridHelper)
    //gridHelper.visible = true

    // 座標軸を表示
    //const axesHelper = new THREE.AxesHelper(0.5)
    //scene.add(axesHelper)
  }

  // レンダラーの設定
  const renderer = new THREE.WebGLRenderer({
    canvas: <HTMLCanvasElement>document.querySelector('#canvas'),
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(0, 1, 4)

  // カメラコントロールの設定
  //if (getWidth > 950) {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.85, 0)
  controls.screenSpacePanning = true
  controls.update()
  //}

  // VRMの読み込み
  let mixer: any
  const loader = new GLTFLoader()
  newLoad()

  function newLoad() {
    loader.load(modelPass,
      (gltf) => {
        VRM.from(gltf).then((vrm: any) => {
          // シーンへの追加
          scene.add(vrm.scene)
          vrm.scene.rotation.y = Math.PI
          setupAnimation(vrm)
        })
      }
    )
  }

  // http → str
  const http2str = (url: string) => {
    try {
      let request = new XMLHttpRequest()
      request.open("GET", url, false)
      request.send(null)
      if (request.status == 200 && request.readyState == 4) {
        return request.responseText.trim()
      }
    } catch (e) {
      console.log(e)
    }
    return ""
  }

  // CSV → hierarchy
  const csv2hierarchy = (csv: string, fps: number) => {
    // 文字列 → 配列
    let lines = csv.trim().split('\n')
    let data: number[][] = []
    for (let j = 0; j < lines.length; j++) {
      data[j] = []
      let strs = lines[j].split(',')
      for (let i = 0; i < 17 * 4; i++) {
        data[j][i] = Number(strs[i])
      }
    }
    // 配列 → hierarchy
    let hierarchy = []
    for (let i = 0; i < 17; i++) {
      let keys = []
      for (let j = 0; j < data.length; j++) {
        keys[j] = {
          rot: new THREE.Quaternion(-data[j][i * 4], -data[j][i * 4 + 1], data[j][i * 4 + 2], data[j][i * 4 + 3]).toArray(),
          time: fps * j
        }
      }
      hierarchy[i] = { 'keys': keys }
    }
    //vroid用のsplice
    //hierarchy.splice(23, 1)
    return hierarchy
  }

  // アニメーションの設定
  const setupAnimation = (vrm: any) => {
    // ボーンリストの生成 boneの数を変更した場合、csv2hierarchyの中身を変更すること
    //完全bone
    //const bones = ["hips","leftUpperLeg","rightUpperLeg","leftLowerLeg","rightLowerLeg","leftFoot","rightFoot","spine","chest","neck","head","leftShoulder","rightShoulder","leftUpperArm","rightUpperArm","leftLowerArm","rightLowerArm","leftHand","rightHand","leftToes","rightToes","leftEye","rightEye","jaw","leftThumbProximal","leftThumbIntermediate","leftThumbDistal","leftIndexProximal","leftIndexIntermediate","leftIndexDistal","leftMiddleProximal","leftMiddleIntermediate","leftMiddleDistal","leftRingProximal","leftRingIntermediate","leftRingDistal","leftLittleProximal","leftLittleIntermediate","leftLittleDistal","rightThumbProximal","rightThumbIntermediate","rightThumbDistal","rightIndexProximal","rightIndexIntermediate","rightIndexDistal","rightMiddleProximal","rightMiddleIntermediate","rightMiddleDistal","rightRingProximal","rightRingIntermediate","rightRingDistal","rightLittleProximal","rightLittleIntermediate","rightLittleDistal","upperChest"]

    //顎抜き
    //const bones = ["hips", "leftUpperLeg", "rightUpperLeg", "leftLowerLeg", "rightLowerLeg", "leftFoot", "rightFoot", "spine", "chest", "neck", "head", "leftShoulder", "rightShoulder", "leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "leftHand", "rightHand", "leftToes", "rightToes", "leftEye", "rightEye", "leftThumbProximal", "leftThumbIntermediate", "leftThumbDistal", "leftIndexProximal", "leftIndexIntermediate", "leftIndexDistal", "leftMiddleProximal", "leftMiddleIntermediate", "leftMiddleDistal", "leftRingProximal", "leftRingIntermediate", "leftRingDistal", "leftLittleProximal", "leftLittleIntermediate", "leftLittleDistal", "rightThumbProximal", "rightThumbIntermediate", "rightThumbDistal", "rightIndexProximal", "rightIndexIntermediate", "rightIndexDistal", "rightMiddleProximal", "rightMiddleIntermediate", "rightMiddleDistal", "rightRingProximal", "rightRingIntermediate", "rightRingDistal", "rightLittleProximal", "rightLittleIntermediate", "rightLittleDistal", "upperChest"]

    //最低限bone
    const bones = ["hips", "leftUpperLeg", "rightUpperLeg", "leftLowerLeg", "rightLowerLeg", "leftFoot", "rightFoot", "spine", "chest", "neck", "head", "leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "leftHand", "rightHand"]
    const boneNode = []
    for (let i = 0; i < bones.length; i++) {
      boneNode[i] = vrm.humanoid.getBoneNode(bones[i])
    }

    // AnimationClipの生成
    const clip = THREE.AnimationClip.parseAnimation({
      hierarchy: csv2hierarchy(http2str(posepass), 200)
    }, boneNode)

    // トラック名の変更
    clip.tracks.some((track) => {
      track.name = track.name.replace(/^\.bones\[([^\]]+)\].(position|quaternion|scale)$/, '$1.$2')
    })

    // AnimationMixerの生成と再生
    mixer = new THREE.AnimationMixer(vrm.scene)

    // AnimationActionの生成とアニメーションの再生
    let action = mixer.clipAction(clip)
    action.play()
  }
  let lastTime = (new Date()).getTime()

  // フレーム毎に呼ばれる
  const update = () => {
    requestAnimationFrame(update)

    // 時間計測
    let time = (new Date()).getTime()
    let delta = time - lastTime;

    // アニメーションの定期処理
    if (mixer) {
      mixer.update(delta)
    }

    // 最終更新時間
    lastTime = time;

    // レンダリング
    renderer.render(scene, camera)
  }
  update()
})

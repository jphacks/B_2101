import * as THREE from 'three'
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema, VRMUnlitMaterial } from '@pixiv/three-vrm'
import { convertToObject } from 'typescript';
import { mode } from '../../../webpack.config';

window.addEventListener("DOMContentLoaded", () => {
  // canvasの取得
  var canvas = <HTMLCanvasElement>document.getElementById('canvas');

  // model_pathの取得
  var modelPass = '../static/base_model/Miraikomachi.vrm';
  //var modelPass = '../static/base_model/base.vrm';
  //var posepass = '../static/pose/hellovrm.csv';
  var posepass = '../static/pose/hellomirai.csv';
  var pose_hello = '../static/pose/hellomirai.csv';
  var pose_a = '../static/pose/a_face.csv';
  var pose_i = '../static/pose/cats.csv';
  var pose_u = '../static/pose/u_face.csv';
  var pose_e = '../static/pose/e_face.csv';
  var pose_o = '../static/pose/o_face.csv';

  // シーンの設定
  const scene = new THREE.Scene()
  sceneOption()

  function sceneOption() {
    // ライトの設定
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)
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
  camera.position.set(0, 1, 3)
  camera.lookAt(0, 0.85, 0)

  // VRMの読み込み
  var boneNode: any = []
  var faceNode: any = []
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
          makeAnimation(posepass);
        })
      },
      (progress) => //console.log('Loading model...', Math.round(100.0 * (progress.loaded / progress.total)), '%')
      {
        /*(<HTMLInputElement>document.getElementById('loading')).value = String(Math.round(100.0 * (progress.loaded / progress.total)));*/
        console.log('Loading model...', Math.round(100.0 * (progress.loaded / progress.total)), '%');
        const progressNum = <HTMLInputElement>document.getElementById('progressNum');
        progressNum.innerHTML = String(Math.round(100.0 * (progress.loaded / progress.total)) + '%');
        const progressBarFull = <HTMLInputElement>document.getElementById('progressBarFull');
        progressBarFull.style.width = Math.round(100.0 * (progress.loaded / progress.total)) + '%';
         /*if((Math.round(100.0 * (progress.loaded / progress.total))) == 100) {(<HTMLInputElement>document.getElementById('loading')).style.display = 'none'}*/
      },
      (error) => console.error(error)
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
    return hierarchy
  }

  // アニメーションの設定
  const setupAnimation = (vrm: any) => {
    mixer = new THREE.AnimationMixer(vrm.scene)
    // ボーンリストの生成 boneの数を変更した場合、csv2hierarchyの中身を変更すること
    //最低限bone
    const bones = ["hips", "leftUpperLeg", "rightUpperLeg", "leftLowerLeg", "rightLowerLeg", "leftFoot", "rightFoot", "spine", "chest", "neck", "head", "leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "leftHand", "rightHand"]
    for (let i = 0; i < bones.length; i++) {
      boneNode[i] = vrm.humanoid.getBoneNode(bones[i])
    }
    faceNode = vrm.blendShapeProxy //表情読み込む用のやつ
    vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Joy, 1.0)
    vrm.blendShapeProxy.update()
  }
  const makeAnimation = (posepass: string) => {
    // AnimationClipの生成
    const clip = THREE.AnimationClip.parseAnimation({
      hierarchy: csv2hierarchy(http2str(posepass), 200)
    }, boneNode)
    // トラック名の変更
    clip.tracks.some((track) => {
      track.name = track.name.replace(/^\.bones\[([^\]]+)\].(position|quaternion|scale)$/, '$1.$2')
    })
    //前のアニメをストップ
    mixer.stopAllAction();
    //AnimationActionの生成とアニメーションの再生
    let action = mixer.clipAction(clip)
    action.play()
  }

  const resetFaceNode = (faceNode: any) => {
    faceNode.setValue(VRMSchema.BlendShapePresetName.Angry, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.Fun, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.Joy, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.Sorrow, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.A, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.I, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.U, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.E, 0)
    faceNode.setValue(VRMSchema.BlendShapePresetName.O, 0)
  }

  //消えないように変数宣言
  let lastTime = (new Date()).getTime()
  let stepValue = 0
  let step = <HTMLInputElement>document.getElementById('flag');
  //let step = 0
  //let startStep = 0
  //let elapsedFlag = true

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

    if (Number(step.value) != 0) {
      console.log("step.value" + step.value)
      //startStep = (new Date()).getTime();
      stepValue = Number(step.value);
      (<HTMLInputElement>document.getElementById('flag')).value = '0';
      console.log("stepValue" + stepValue)
      if (mixer != null) { resetFaceNode(faceNode) }
      if (stepValue == -5) {
        camera.position.set(0, 1.3, 0.85);
        camera.lookAt(0, 1.4, 0);
        stepValue = 0
      }
      if (stepValue == 1) {
        posepass = pose_a
        faceNode.setValue(VRMSchema.BlendShapePresetName.A, 0.48)
        faceNode.setValue(VRMSchema.BlendShapePresetName.E, 1.0)
        faceNode.update()
      }
      if (stepValue == 2) {
        posepass = pose_i
        faceNode.setValue(VRMSchema.BlendShapePresetName.A, 0.05)
        faceNode.setValue(VRMSchema.BlendShapePresetName.I, 1.0)
        faceNode.update()
      }
      if (stepValue == 3) {
        posepass = pose_u
        faceNode.setValue(VRMSchema.BlendShapePresetName.Joy, 0.5)
        faceNode.setValue(VRMSchema.BlendShapePresetName.Fun, 1.0)
        faceNode.setValue(VRMSchema.BlendShapePresetName.U, 1.0)
        faceNode.setValue(VRMSchema.BlendShapePresetName.O, 0.14)
        faceNode.update()
      }
      if (stepValue == 4) {
        posepass = pose_e
        faceNode.setValue(VRMSchema.BlendShapePresetName.A, 0.2)
        faceNode.setValue(VRMSchema.BlendShapePresetName.E, 1.0)
        faceNode.update()
      }
      if (stepValue == 5) {
        posepass = pose_o;
        faceNode.setValue(VRMSchema.BlendShapePresetName.U, 0.05)
        faceNode.setValue(VRMSchema.BlendShapePresetName.O, 1.0)
        faceNode.update()
      }
      if (stepValue == 10) {
        posepass = pose_hello;
        faceNode.setValue(VRMSchema.BlendShapePresetName.Joy, 1.0)
        faceNode.update()
        stepValue = 0
      }
      //if(stepValue%2 == 0){posepass = "../static/pose/hellomirai.csv"}
      if (mixer != undefined) { makeAnimation(posepass) }
      //elapsedFlag =true
    }
    //let step_elapsed = time - startStep
    //if(step_elapsed > 5000){}

    // 最終更新時間
    lastTime = time;

    // レンダリング
    renderer.render(scene, camera)
  }
  update()
})


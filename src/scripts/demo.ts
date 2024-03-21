import { Engine3D, Object3D, Scene3D, View3D, Object3DUtil, AtmosphericComponent, HoverCameraController, DirectLight, CameraUtil, Color, ViewPanel, UIImage, UITextField, TextAnchor, GUICanvas, FontInfo, Vector3, BitmapTexture2D, makeAloneSprite, MeshRenderer, LitMaterial, UIInteractive, PointerEvent3D, UIShadow, GUISprite } from "@orillusion/core";
import { Stats } from "@orillusion/stats";
import { AudioListener, StaticAudio } from "@orillusion/media-extention";

export default class demo {
    view: View3D;
    font: FontInfo;
    canvas: GUICanvas;
    audio: StaticAudio;
    audioIcon: UIImage;
    jingyinSprite: GUISprite;
    labaSprite: GUISprite;
    controller: HoverCameraController;
    //图例中可点击线路的背景默认颜色以及选中颜色
    defaultContentBGColor: Color = new Color(0, 0, 0, 0);
    clickedContentBGColor: Color = new Color(0, 0, 0, 0.3);
    //图例中所有可点击线路的背景集合
    contentBGGroup: UIImage[] = [];
    //线路未选中颜色为lineGrayColor,选中颜色为lineColorGroup中对应的颜色
    lineGrayColor: Color = new Color(0.1, 0.1, 0.1, 1);
    lineColorGroup: Color[] = [];
    //所有线路的材质集合
    lineMatGroup: LitMaterial[] = [];
    //线路信息弹窗的集合，0：线路名称 1：标识颜色 2：线路简介 3：弹窗3DObject
    lineInfoObj: object[] = [];
    //当前选中的图例index，0为未选中，1~24为各线路
    buttonIndex: number = 0;
    //所有线路图例的16进制颜色
    legendColors = [0xb84339, 0x405f84, 0x098586, 0xa13678, 0xca8c31, 0xfab973, 0x009867, 0x8cbd3a, 0x1295ab, 0xef786c, 0xf5e03c, 0xd09c94, 0x723b6e, 0x7b9839, 0x07a69a, 0xd3a1b3, 0x344d8d, 0xdc81ae, 0xe72979, 0xe16338, 0x9a8eaa, 0xa95b2f, 0xe53430, 0xbd7c6a, 0x7d8195, 0x958f7d, 0x957f7d, 0x84957d];
    lineName = ["1号线八通线", "2号线", "4号线大兴线", "5号线", "6号线", "7号线", "8号线", "9号线", "10号线", "11号线", "13号线", "14号线", "15号线", "16号线", "17号线", "19号线", "大兴机场线", "昌平线", "亦庄线", "房山线燕房线", "首都机场线", "S1线", "西郊线", "亦庄T1线", "城市副中心线", "S2线", "怀密线", "通密线"];
    //所有线路的镜头参数，6个为1组，对应controller.setCamera()的参数
    cameraValue: number[] = [
        0, -30, 50, 0, 0, 0, 12, -31.67, 47.63, 3.93, 0, 1.64, -2, -33.33, 13.67, 0.36, 0, 2.79, 32.34, -26.33, 16.94, -9.13, 0, 15.11, 28.35, -30.65, 18.17, 2.9, 0, 2.6, 33.77, -32.64, 41.13, 9.04, 0, -0.86, 26.35, -27.31, 31.62, 8.28, 0, 3.52, -20.67, -31.97, 18.66, 2.39, 0, 9.77, 17.98, -34.64, 11.02, -15.84, 0, 10.39, -1.68, -38.63, 24.04, -3.11, 0, 7.63, 30.31, -23.97, 6.8, -28.12, 0, 2.48, 0.31, -37.31, 18.66, -0.24, 0, -6.26, 38.72, -30.07, 29.36, -0.4, 0, 4.7, -30.45, -27.65, 25.61, 9.68, 0, -14.94, -25.79, -26.99, 16.15, -16.88, 0, 6.02, -6.48, -32.66, 22.52, 18.44, 0, 10.39, 17.51, -34.66, 13.05, -4.92, 0, 8.93, -11.16, -24.67, 10.14, -1.34, 0, 23.98, -8.49, -28.66, 12.77, -7.91, 0, -11.18, -6.84, -33.32, 17.6, 14.62, 0, 17.13, 21.17, -26.65, 19.27, -23.94, 0, 16.6, 11.84,
        -30.32, 17.79, 12.98, 0, -5.45, 3.84, -23.99, 11.62, -31.88, 0, 1.53, -8.16, -26.32, 10.52, -19.49, 0, -7.61, 17.82, -46.31, 9.87, 11.49, 0, 21.68,
    ];
    lineInfo: string[] = [
        "北京地铁1号线八通线是一条贯通北京东西向的重要地铁线路.1号线作为北京最早的地铁线路之一,开通以来一直是城市交通的骨干.八通线则是1号线的东延长线,连接城市副中心通州与中心城区.1号线与八通线合并后,乘客无需换乘即可从西五环直达东六环,全长约54.47公里,共设38个站点,大大提升了通勤效率和出行体验.",
        "北京地铁2号线是一条环状线路,也是北京地铁的第二条线路,于1984年开通运营.它环绕北京市中心,连接了多个重要商业区和交通枢纽,如西直门、东直门、北京站等.全长约23.1公里,共设有18个车站,是北京地铁最为繁忙的线路之一.该线路以其环形设计,为乘客提供了便捷的换乘选项,缓解了城市交通压力并促进了北京城市发展.",
        "北京地铁4号线,又称大兴线,是一条连接北京市中心与大兴区的重要地铁线路.4号线北起安河桥北站,南至天宫院站,全长约50.5公里,共设有23个车站.该线路自2009年开通以来,不仅极大地方便了沿线居民的出行,还促进了北京南部地区的经济发展.大兴线作为4号线的南延段,进一步延伸至大兴新城,加强了郊区与中心城区的联系.",
        "北京地铁5号线是北京市内的一条主要南北向地铁线路,北起点为天通苑北站,南至宋家庄站,全长约27.6公里,共设有23个车站.2007年开通运营,贯穿了北京市的主要区域,连接了立水桥、东单、崇文门等重要交通枢纽和商业区,对于缓解城市南北向交通压力、提升市民出行效率起到了重要的作用,是北京地铁网络中不可或缺的一部分.",
        "北京地铁6号线是一条东西走向的线路,东起金安桥站,西至潞城站,全长约51.6公里,共设有34个车站.自2012年开通以来,逐渐成为连接北京城市副中心与中心城区的重要交通干线.线路穿越多个行政区,包括石景山、海淀、西城、东城、朝阳、通州等,为沿线居民提供了便捷的出行选择,并对促进沿线区域的经济社会发展发挥了重要作用.",
        "北京地铁7号线是一条贯穿北京市东西方向的重要地铁线路,西起北京西站,东至环球度假区站,全长约40公里,共设有30个车站.7号线连接了多个重要区域和交通枢纽,如北京西站、菜市口、珠市口等,极大地方便了市民的日常出行,有效缓解了城市东西向的交通压力,对于促进沿线区域的经济社会发展和提高市民的出行效率具有重要意义.",
        "北京地铁8号线,全长约51.6公里,共设有35个车站.北起朱辛庄站,南至瀛海站,贯穿北京市的多个重要区域,包括著名的奥林匹克公园和什刹海等.自2008年7月19日开通运营以来,8号线已成为北京地铁网络中不可或缺的一部分,为市民提供了高效便捷的南北向交通服务,对于缓解城市交通压力、促进沿线区域发展起到了关键作用.",
        "北京地铁9号线,全长16.5公里,共设有13座车站.线路北起国家图书馆站,南至郭公庄站,呈南北走向,是北京地铁网络中的重要组成部分.9号线采用6节编组B型列车,运行时速可达80公里,实行计程限时票制,起步价为3元.线路标识色为淡绿色,自2007年开工以来,对改善北京西部交通状况、缓解北京西站交通压力具有重要意义.",
        "北京地铁10号线,全长约57.1公里,共设有45个车站.线路环绕北京市中心,连接了多个重要商业区和居住区,如三元桥、国贸、苏州街等.是北京地铁网络中最繁忙的线路之一,对于缓解城市交通压力和提高市民出行效率起着至关重要的作用.线路标识色为天蓝色,自2008年全线通车以来,已成为北京市民日常出行的重要选择.",
        "北京地铁11号线是一条位于石景山区的地铁线路,服务于北京冬奥会.线路北起模式口站,南至新首钢站,全长约4公里,共设有4座车站(模式口站暂缓开通).11号线采用4节编组A型列车,最高运行速度为100千米/小时.该线路的开通,加强了石景山区内部的交通联系,并与6号线和S1线在金安桥站实现换乘,提高了区域的交通便利性",
        "北京地铁13号线是北京市内的一条主要地铁线路,西起西直门,东至东直门,全长约40.5公里,设有16个车站.线路连接多个重要区域,包括教育区、商业区和居住区,是北部地区的主要交通干线.最高时速80公里,为市民提供便捷的出行服务.自2002年全线通车以来,13号线在缓解城市交通压力、提升出行效率方面发挥了关键作用.",
        "北京地铁14号线的终点站确实是善各庄站.14号线是一条东西走向的地铁线路,西起张郭庄站,东至善各庄站,全长约47.8公里,共设有31个车站.线路连接了北京市的多个重要区域,包括北京南站、CBD、望京等,对于促进沿线区域的经济社会发展和提供便捷出行服务具有重要意义.线路标识色为淡紫色,采用6节编组A型列车.",
        "北京地铁15号线是一条重要的地铁线路,连接顺义、朝阳、海淀三区,全长约41.4公里,东起俸伯站,西至清华东路西口站,共20个车站.线路标识色紫罗兰,采用6节编组B型列车,服务学院路、奥林匹克公园、望京等区域.自2010年开通,15号线有效缓解了北部交通压力,提升了居民出行效率,促进了沿线区域的经济社会发展.",
        "北京地铁16号线是一条位于北京市西部的地铁线路,北起北安河,南至宛平城,全长约49.8公里,设有29个车站.标识色为淡紫色,采用A型车6节编组,最高运行时速为80公里.16号线穿越多个行政区,连接了海淀、西城、丰台等区域,对于缓解西部地区的交通压力、促进沿线区域发展具有重要作用.线路于2016年12月31日开通运营.",
        "北京地铁17号线,北段起于未来科技城北区站,终至工人体育场，南段起于十里河站,终至嘉会湖站,全长约49.7公里,共设有19座车站.线路标识色为蓝绿色,采用8节编组A型列车,最高运行时速100公里.17号线连接了昌平区、朝阳区、东城区、西城区和大兴区,对于缓解南北向交通压力、促进沿线区域发展起到了关键作用.",
        "北京地铁19号线是一条南北向的地铁线路,北起牡丹园站,南至新宫站,全长约22.4公里,设有10个车站.线路标识色为暗紫色,采用6节编组A型列车,最高运行速度80公里/小时.连接了北京市的重要商业区和居住区,提高了北部和南部地区的交通便利性,对于缓解地铁5号线的客流压力具有显著作用.2020年12月31日开通运营.",
        "北京大兴国际机场线,是连接北京市区与北京大兴国际机场的地铁线路.起点站是位于市中心的草桥站,终点站是位于大兴区的大兴机场站,全长约41.4公里.线路特色为全自动驾驶动车组列车,最高速度160公里/小时,为旅客提供快速、便捷的出行服务.大兴机场线不仅优化了北京交通网络,也助力区域经济发展,提升城市形象.",
        "北京地铁昌平线北起昌平西山口站,南至蓟门桥站,全长约43.1公里,共设有18个车站.线路贯穿北京市北部,连接昌平区与中心城区,成为北部郊区与城市核心区的重要交通干线.昌平线采用6节编组B型列车,最高运行速度100千米/小时,为市民提供快速直达的出行服务,有效缓解了沿线地区的交通压力,促进了区域经济和社会发展.",
        "北京地铁亦庄线,全长约23.3公里,北起宋家庄站,南至亦庄火车站,共设有14座车站.线路标识色为粉蓝色,采用6节编组B型列车,最高运行速度80公里/小时.亦庄线为北京市亦庄经济技术开发区提供便捷服务,连接市中心与亦庄新城,是促进区域发展和改善居民出行的重要通道,有效缓解了交通压力,提升了区域交通效率.",
        "北京地铁房山线（含燕房线）的北端终点站是东管头南站,南端终点站是阎村东站.全长约为47.4公里,共26个车站.线路标识色为橙色,最高运行速度为100千米/小时.房山线连接了北京市房山区的主要区域,为沿线居民提供了快速便捷的出行选择,并在多个站点与其他地铁线路实现换乘,增强了房山区与北京市中心的交通联系.",
        "北京首都机场线是一条连接北京市区与首都国际机场的快速轨道交通线路,全长29.8千米,共设有5座车站,包括东直门站、三元桥站、北新桥站、T2航站楼站和T3航站楼站.最高运行速度可达110公里/小时,为旅客提供快速直达机场的服务.线路标识色为银灰色,自2008年7月19日开通以来,已成为北京市重要的机场接驳线路.",
        "北京地铁S1线是一条连接北京市区与门头沟区的地铁线路,全长约10.2公里,共设有8个车站.最高运行速度为80公里/小时.S1线沿永定河而建,连接了苹果园、金安桥等重要区域,为门头沟区居民提供了便捷的进城通道,同时也为市区居民前往门头沟区提供了快速的交通选择.线路的开通促进了区域均衡发展,改善了市民出行条件",
        "北京地铁西郊线,全长约8.8公里,共设有6个车站.线路起点为巴沟站,终点为香山站,主要服务于北京西郊的香山公园、北京植物园等旅游景点.采用4节编组A型列车,最高运行速度为70公里/小时,为市民提供了直达香山等风景名胜区的便捷交通方式.线路的开通缓解了节假日期间西郊地区的交通压力,促进了当地旅游业的发展.",
        "北京亦庄T1线是一条服务于北京经济技术开发区的有轨电车线路,全长约13.25公里,共设有15个车站.为亦庄区域内的居民和工作人员提供便捷的出行服务.T1线连接多个工业区和生活区,对于促进亦庄区域的经济发展和改善交通状况具有重要作用.线路的开通提高了区域内的公共交通效率,为乘客提供了舒适、环保的出行选择.",
    ];
    async run() {
        //init engine
        await Engine3D.init();
        //set shadow
        Engine3D.setting.shadow.updateFrameRate = 1;
        Engine3D.setting.shadow.shadowSize = 2048;
        Engine3D.setting.shadow.shadowBound = 100;

        //create scene,add sky and fps
        let scene = new Scene3D();
        let sky = scene.addComponent(AtmosphericComponent);
        sky.roughness = 0.8;
        sky.exposure = 3;
        scene.addComponent(Stats);

        //create camera and controller
        let camera = CameraUtil.createCamera3DObject(scene);
        camera.perspective(60, Engine3D.aspect, 1, 5000);
        this.controller = camera.object3D.addComponent(HoverCameraController);
        //设置相机最近以及最远的距离
        this.controller.maxDistance = 80;
        this.controller.minDistance = 5;
        //相机改变后的过渡平滑效果
        this.controller.dragSmooth = 3;
        this.controller.rollSmooth = 3;
        this.controller.wheelSmooth = 3;
        this.controller.setCamera(0, -30, 50);

        //add DirectLight
        let lightObj = new Object3D();
        let light = lightObj.addComponent(DirectLight);
        light.intensity = 30;
        light.castShadow = true;
        lightObj.rotationX = 60;
        lightObj.rotationY = 60;
        scene.addChild(lightObj);

        //start render
        this.view = new View3D();
        this.view.scene = scene;
        this.view.camera = camera;
        Engine3D.startRenderView(this.view);
        //加载喇叭图标
        let jingyinTex = await Engine3D.res.loadTexture("png/jingyin.png");
        let labaTex = await Engine3D.res.loadTexture("png/laba.png");
        this.jingyinSprite = makeAloneSprite("jingyin", jingyinTex);
        this.labaSprite = makeAloneSprite("laba", labaTex);
        //加载字体
        this.font = await Engine3D.res.loadFont("/font/alibabapuhuiti-light.fnt");
        //获取canvas,后续将添加UI
        this.canvas = this.view.enableUICanvas();
        //创建基础场景
        await this.initScene();
        //添加声音
        await this.addAudio();
        //创建顶部标题
        await this.createTopTitle();
        //创建图例
        await this.createLegend();
        //创建线路信息
        await this.createLineInfo();
    }

    private async initScene() {
        //添加地面
        {
            let floor = Object3DUtil.GetSingleCube(100, 0.1, 100, 0.2, 0.2, 0.2);
            floor.y = -5;
            this.view.scene.addChild(floor);
        }

        //加载线路模型 将每个模型线路的材质存入数组,后续用于点击事件
        let Lines = await Engine3D.res.loadGltf("/gltf/BJ_Lines.glb");
        Lines.localScale = new Vector3(0.1, 0.1, 0.1);
        this.view.scene.addChild(Lines);
        let lineParent = Lines.entityChildren[0] as Object3D;
        for (let index = 0; index < lineParent.entityChildren.length; index++) {
            let line = (lineParent.entityChildren[index] as Object3D).entityChildren[0] as Object3D;
            let mat = line.getComponent(MeshRenderer).material as LitMaterial;
            this.lineMatGroup.push(mat);
            this.lineColorGroup.push(mat.emissiveColor);
        }
        //加载线路名称
        let LineName = await Engine3D.res.loadGltf("/gltf/BJ_LineName.glb");
        LineName.localScale = new Vector3(0.1, 0.1, 0.1);
        this.view.scene.addChild(LineName);
        //加载站点
        let Stations = await Engine3D.res.loadGltf("/gltf/BJ_Stations.glb");
        Stations.localScale = new Vector3(0.1, 0.1, 0.1);
        this.view.scene.addChild(Stations);
        //加载站名
        let StationName = await Engine3D.res.loadGltf("/gltf/BJ_StationName.glb");
        StationName.localScale = new Vector3(0.1, 0.1, 0.1);
        this.view.scene.addChild(StationName);
    }
    private async addAudio() {
        let listener = this.view.scene.addComponent(AudioListener);
        let audioObj = new Object3D();
        this.audio = audioObj.addComponent(StaticAudio);
        this.audio.setLisenter(listener);
        await this.audio.load("audio/BGBGM.ogg");
    }
    private async createTopTitle() {
        let panelRoot = new Object3D();
        panelRoot.addComponent(ViewPanel);
        this.canvas.addChild(panelRoot);
        //顶部背景
        let titleBGObj = new Object3D();
        let titleBG = titleBGObj.addComponent(UIImage);
        titleBG.color = new Color(0.1, 0.2, 0.3, 0.7);
        titleBG.uiTransform.resize(Engine3D.width, 100);
        titleBG.uiTransform.setXY(0, Engine3D.height / 2 - 50);
        panelRoot.addChild(titleBGObj);
        //logo
        let logoObj = new Object3D();
        let logo = logoObj.addComponent(UIImage);
        let tex = await Engine3D.res.loadTexture("png/bglogo.png");
        logo.sprite = makeAloneSprite("bglogo", tex);
        logo.uiTransform.resize(129, 100);
        logo.uiTransform.setXY(-370, 0);
        titleBGObj.addChild(logoObj);
        //大标题
        let titleObj = new Object3D();
        titleObj.addComponent(UIShadow);
        let title = titleObj.addComponent(UITextField);
        title.text = "北京城市轨道交通立体线网图";
        title.font = this.font.face;
        title.fontSize = 70;
        title.uiTransform.resize(Engine3D.width, 100);
        title.alignment = TextAnchor.MiddleCenter;
        titleBGObj.addChild(titleObj);
        //时间
        let timeObj = new Object3D();
        timeObj.addComponent(UIShadow);
        let time = timeObj.addComponent(UITextField);
        time.text = this.formatDateTime(new Date());
        time.font = this.font.face;
        time.fontSize = 42;
        time.uiTransform.resize(Engine3D.width, 100);
        time.alignment = TextAnchor.MiddleRight;
        time.uiTransform.setXY(-70, 0);
        titleBGObj.addChild(timeObj);
        setInterval(() => {
            time.text = this.formatDateTime(new Date());
        }, 1000);
        //声音
        let audioObj = new Object3D();
        audioObj.addComponent(UIInteractive).interactive = true;
        audioObj.addEventListener(PointerEvent3D.PICK_CLICK_GUI, this.labaClicked, this);
        this.audioIcon = audioObj.addComponent(UIImage);
        this.audioIcon.uiTransform.resize(50, 50);
        this.audioIcon.uiTransform.setXY(Engine3D.width / 2 - 25 - 10, 0);
        this.audioIcon.sprite = this.jingyinSprite;
        titleBGObj.addChild(audioObj);
    }
    private async createLegend() {
        //创建viewpanel
        let panelRoot = new Object3D();
        panelRoot.addComponent(ViewPanel);
        this.canvas.addChild(panelRoot);

        //创建图例背景
        let legendBG = new Object3D();
        let bg = legendBG.addComponent(UIImage);
        bg.color = new Color(0.1, 0.2, 0.3, 0.7);
        bg.uiTransform.resize(400, 720);
        //以下三行做的是图例大小以及位置的自适应
        let scale = Engine3D.height / 1100;
        legendBG.localScale = new Vector3(scale, scale, scale);
        bg.uiTransform.setXY(-Engine3D.width / 2 + 200 * scale + 30, 0);
        panelRoot.addChild(legendBG);

        //创建图例的标题 以下所有GUI组件都以图例背景为父物体
        let titleObj = new Object3D();
        let title = titleObj.addComponent(UITextField);
        title.text = "图例";
        title.font = this.font.face;
        title.alignment = TextAnchor.UpperLeft;
        title.fontSize = 42;
        title.uiTransform.resize(400, 720);
        title.uiTransform.setXY(15, -10);
        legendBG.addChild(titleObj);

        //辅助线
        {
            let lineObj = new Object3D();
            let line = lineObj.addComponent(UIImage);
            line.uiTransform.resize(400, 2);
            line.uiTransform.setXY(0, 300);
            line.color = new Color(1, 1, 1, 0.5);
            legendBG.addChild(lineObj);
        }

        //创建地铁线路图例 共24条线路
        for (let index = 0; index < 24; index++) {
            //创建地铁图例背景,添加点击事件
            let contentObj = new Object3D();
            contentObj.data = index + 1;
            let contentBG = contentObj.addComponent(UIImage);
            contentObj.addComponent(UIInteractive).interactive = true;
            contentObj.addEventListener(PointerEvent3D.PICK_CLICK_GUI, this.Click, this, contentObj.data);
            contentBG.uiTransform.resize(200, 40);
            contentBG.color = this.defaultContentBGColor;
            this.contentBGGroup.push(contentBG);
            legendBG.addChild(contentObj);

            //地铁图例颜色
            let contentIcon = new Object3D();
            let icon = contentIcon.addComponent(UIImage);
            icon.color = Color.hexRGBColor(this.legendColors[index]);
            icon.uiTransform.resize(30, 30);
            icon.uiTransform.setXY(-70, 0);
            contentObj.addChild(contentIcon);

            //地铁线路名称
            let contentText = new Object3D();
            let text = contentText.addComponent(UITextField);
            text.text = this.lineName[index];
            text.font = this.font.face;
            text.alignment = TextAnchor.MiddleLeft;
            text.fontSize = 30;
            text.uiTransform.resize(200, 40);
            text.uiTransform.setXY(60, 0);
            contentObj.addChild(contentText);
            //设置图例位置
            contentBG.uiTransform.setXY(index < 12 ? -100 : 100, 270 - (index % 12) * 40);
        }

        //辅助线
        {
            let lineObj = new Object3D();
            let line = lineObj.addComponent(UIImage);
            line.uiTransform.resize(400, 2);
            line.uiTransform.setXY(0, -210);
            line.color = new Color(1, 1, 1, 0.5);
            legendBG.addChild(lineObj);
        }

        //创建4个市郊铁路图例 无交互
        for (let index = 24; index < 28; index++) {
            let contentObj = new Object3D();
            let contentBG = contentObj.addComponent(UIImage);
            contentBG.uiTransform.resize(200, 40);
            contentBG.color = this.defaultContentBGColor;
            legendBG.addChild(contentObj);

            let contentIcon = new Object3D();
            let icon = contentIcon.addComponent(UIImage);
            icon.color = Color.hexRGBColor(this.legendColors[index]);
            icon.uiTransform.resize(30, 30);
            icon.uiTransform.setXY(-70, 0);
            contentObj.addChild(contentIcon);

            let contentText = new Object3D();
            let text = contentText.addComponent(UITextField);
            text.text = this.lineName[index];
            text.font = this.font.face;
            text.alignment = TextAnchor.MiddleLeft;
            text.fontSize = 30;
            text.uiTransform.resize(200, 40);
            text.uiTransform.setXY(60, 0);
            contentObj.addChild(contentText);

            contentBG.uiTransform.setXY(index < 26 ? -100 : 100, -240 - ((index - 24) % 2) * 40);
        }

        //站点图例 普通站与换乘站
        let normalStationTex = new BitmapTexture2D();
        await normalStationTex.load("/png/normalStation.png");
        let normalSprite = makeAloneSprite("normal", normalStationTex);
        let exchangeStationTex = new BitmapTexture2D();
        await exchangeStationTex.load("/png/exchangeStation.png");
        let exchangeSprite = makeAloneSprite("exchange", exchangeStationTex);

        {
            //普通站点图例
            let normalBG = new Object3D();
            let normal = normalBG.addComponent(UIImage);
            normal.uiTransform.resize(200, 40);
            normal.color = this.defaultContentBGColor;
            legendBG.addChild(normalBG);

            let normalIcon = new Object3D();
            let icon = normalIcon.addComponent(UIImage);
            icon.sprite = normalSprite;
            icon.uiTransform.resize(30, 30);
            icon.uiTransform.setXY(-70, 0);
            normalBG.addChild(normalIcon);

            let normalText = new Object3D();
            let text = normalText.addComponent(UITextField);
            text.text = "普通站";
            text.font = this.font.face;
            text.alignment = TextAnchor.MiddleLeft;
            text.fontSize = 30;
            text.uiTransform.resize(200, 40);
            text.uiTransform.setXY(60, 0);
            normalBG.addChild(normalText);
            normal.uiTransform.setXY(-100, -320);
        }
        {
            //换乘站点图例
            let exchangeBG = new Object3D();
            let normal = exchangeBG.addComponent(UIImage);
            normal.uiTransform.resize(200, 40);
            normal.color = this.defaultContentBGColor;
            legendBG.addChild(exchangeBG);

            let exchangelIcon = new Object3D();
            let icon = exchangelIcon.addComponent(UIImage);
            icon.sprite = exchangeSprite;
            icon.uiTransform.resize(60, 30);
            icon.uiTransform.setXY(-85, 0);
            exchangeBG.addChild(exchangelIcon);

            let exchangeText = new Object3D();
            let text = exchangeText.addComponent(UITextField);
            text.text = "换乘站";
            text.font = this.font.face;
            text.alignment = TextAnchor.MiddleLeft;
            text.fontSize = 30;
            text.uiTransform.resize(200, 40);
            text.uiTransform.setXY(60, 0);
            exchangeBG.addChild(exchangeText);
            normal.uiTransform.setXY(100, -320);
        }
    }
    private async createLineInfo() {
        let panelRoot = new Object3D();
        panelRoot.addComponent(ViewPanel);
        this.canvas.addChild(panelRoot);
        //先隐藏 查看线路信息时再弹出
        panelRoot.transform.enable = false;

        let lineInfoBG = new Object3D();
        let bg = lineInfoBG.addComponent(UIImage);
        bg.color = new Color(0.1, 0.2, 0.3, 0.7);
        bg.uiTransform.resize(300, 450);
        let scale = Engine3D.height / 1100;
        lineInfoBG.localScale = new Vector3(scale, scale, scale);
        bg.uiTransform.setXY(Engine3D.width / 2 - 150 * scale - 30, 0);
        panelRoot.addChild(lineInfoBG);

        let titleObj = new Object3D();
        let title = titleObj.addComponent(UITextField);
        title.text = this.lineName[0];
        title.font = this.font.face;
        title.alignment = TextAnchor.UpperLeft;
        title.fontSize = 42;
        title.uiTransform.resize(300, 450);
        title.uiTransform.setXY(15, -10);
        lineInfoBG.addChild(titleObj);
        this.lineInfoObj.push(title);
        //辅助线
        {
            let lineObj = new Object3D();
            let line = lineObj.addComponent(UIImage);
            line.uiTransform.resize(300, 2);
            line.uiTransform.setXY(0, 165);
            line.color = new Color(1, 1, 1, 0.5);
            lineInfoBG.addChild(lineObj);
        }
        //颜色标识线
        {
            let lineObj = new Object3D();
            let line = lineObj.addComponent(UIImage);
            line.uiTransform.resize(50, 10);
            line.uiTransform.setXY(-110, 165);
            line.color = this.lineColorGroup[0];
            lineInfoBG.addChild(lineObj);
            this.lineInfoObj.push(line);
        }

        let textObj = new Object3D();
        let text = textObj.addComponent(UITextField);
        text.text = this.lineInfo[20];
        text.font = this.font.face;
        text.alignment = TextAnchor.UpperLeft;
        text.fontSize = 30;
        text.uiTransform.resize(270, 450);
        text.uiTransform.setXY(0, -80);
        lineInfoBG.addChild(textObj);
        this.lineInfoObj.push(text);
        this.lineInfoObj.push(panelRoot);
    }
    //处理点击地铁线路图例的逻辑
    private Click(e: PointerEvent3D) {
        //index是点击图例的传参,24条线路从1~24
        let index = e.currentTarget.param;
        //如果点击的图例已经被选中,则取消选中
        if (index == this.buttonIndex) {
            this.contentBGGroup[index - 1].color = this.defaultContentBGColor;
            this.buttonIndex = 0;
        }
        //如果点击的图例未被选中,则选中点击的图例并取消之前选中图例的选中状态
        else {
            this.contentBGGroup[index - 1].color = this.clickedContentBGColor;

            if (this.buttonIndex != 0) {
                //有种特殊情况就是之前没有选中图例,这时候this.buttonIndex=0,不会进入这个判断
                this.contentBGGroup[this.buttonIndex - 1].color = this.defaultContentBGColor;
            }
            this.buttonIndex = index;
        }
        this.controller.setCamera(this.cameraValue[6 * this.buttonIndex], this.cameraValue[6 * this.buttonIndex + 1], this.cameraValue[6 * this.buttonIndex + 2], new Vector3(this.cameraValue[6 * this.buttonIndex + 3], this.cameraValue[6 * this.buttonIndex + 4], this.cameraValue[6 * this.buttonIndex + 5]));
        this.changeLineColor(this.buttonIndex);
        this.changeLineInfo(this.buttonIndex);
    }
    private changeLineColor(index: number) {
        for (let i = 0; i < this.lineMatGroup.length; i++) {
            if (index == 0 || index == i + 1) {
                this.lineMatGroup[i].emissiveColor = this.lineColorGroup[i].clone();
            } else {
                this.lineMatGroup[i].emissiveColor = this.lineGrayColor.clone();
            }
        }
    }
    private changeLineInfo(index: number) {
        if (index == 0) {
            (this.lineInfoObj[3] as Object3D).transform.enable = false;
        } else {
            (this.lineInfoObj[0] as UITextField).text = this.lineName[index - 1];
            (this.lineInfoObj[1] as UIImage).color = this.lineColorGroup[index - 1];
            (this.lineInfoObj[2] as UITextField).text = this.lineInfo[index - 1];
            (this.lineInfoObj[3] as Object3D).transform.enable = true;
        }
    }
    private labaClicked() {
        if (this.audio.playing) {
            this.audio.stop();
            this.audioIcon.sprite = this.jingyinSprite;
        } else {
            this.audio.play();
            this.audioIcon.sprite = this.labaSprite;
        }
    }
    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
/*
    问题    
    1.控制器不能设定限制范围，比如移动范围和旋转范围，缩放大小倒是能设置
    2.LitMaterial修改basecolor后，想做透明效果，a设置无效
    3.设置拾取模式后为pixel后，bloom无法被添加，报错
    4.bloom开启时，不同的颜色效果不同
    BUG：景深post,SSR,fog会影响UI   
*/

// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available
//console.log($scope)


//few general use APIs:
function LogOnCondition(val, logMsg) {
    if (!val)
        return false;
    console.log(logMsg);
    return true;
}

function IsVoid(obj) {
    return ((obj === undefined) || (obj === null) || (obj === 'none'));
}

function ExtractFileName(AFileName) {
    return AFileName.split('\\').pop().split('/').pop();
}

function ExtractFileExt(AFileName) {
    Result = ExtractFileName(AFileName).split('.').pop();
    if (Result !== "")
        return '.' + Result;
    return "";
}

//few app-specific APIs:
function GetPVIpath(FigureNumber) {
    return `app/resources/Uploaded/${Storyboard.pvz}/l-Creo%203D%20-%20figure${FigureNumber}.pvi`
    //in this project the naming rule is very standardized, figed path and name prefix, with a 1-based numbering
}

function ExtractFigureIndex(PVI = undefined) {
    //reverse of GetPVIpath: extracting just the number part of the PVI file name//
    var AFigureName = PVI;
    if (IsVoid(AFigureName))
        AFigureName = $scope.view.wdg['sewingMachine'].sequence;
    console.log('$scope.view.wdg["sewingMachine"].sequence;' + AFigureName);
    AFigureName = ExtractFileName(AFigureName).split('.').shift();
    AFigureName = AFigureName.split('figure').pop();
    if (IsVoid(AFigureName))
        return false;
    if (AFigureName == "")
        return false;
    return AFigureName;
}

//Main storyboard
Storyboard = {
    //PROPERTIES://
    machineModel: "Gogoro VIVA",
    pvz: "Gogoro_S2_20191231",
    specification: "https://www.gogoro.com/tw/smartscooter/viva/",
    manual: "Gogoro_2_Series_User_Manual_MY17_zhTW.pdf",
    currentStep: 1, //1-based
    steps: [{
            fig: 1,
            stp: 1,
            img: '1.png',
            cap: '按下智慧型鑰匙與壓儀表GO鍵',
            cap6: '☐ 按壓鑰匙',
            cap7: '☐ 按壓儀表GO建',
            cap8: 'noshow'
        }, {
            fig: 1,
            stp: 2,
            img: '1.png',
            cap: '完成前面兩動作後儀表無反應',
            cap6: '☑ 按壓鑰匙',
            cap7: '☑ 按壓儀表GO建',
            cap8: '儀表板無反應請前往下一步'
        }, {
            fig: 2,
            stp: 1,
            img: '2.png',
            cap: '從機車中取出備用電池(PB) 拉出的4 pin插頭，凸點朝上 三用電表轉到伏特檔位',
            cap6: '三用電表轉到伏特檔位',
            cap7: '拉出的4 pin插頭，凸點朝上',
            cap8: 'noshow'
        }, {
            fig: 2,
            stp: 2,
            img: '3.png',
            cap: '紅線/黑線連接三用電表及4 pin插頭，接線第1孔及第2孔，，產生數值G1',
            cap6: '☐ G1=接線第1孔及第2孔',
            cap7: 'noshow',
            cap8: 'noshow'
        }, {
            fig: 2,
            stp: 3,
            img: '4.png',
            cap: '紅線/黑線連接三用電表及4 pin插頭，接線第2孔及第3孔，產生數值G2',
            cap6: '☑ G1=接線第1孔及第2孔',
            cap7: '☐ G2=接線第2孔及第3孔',
            cap8: 'noshow'
        }, {
            fig: 2,
            stp: 4,
            img: '5.png',
            cap: '紅線/黑線連接三用電表及4 pin插頭，接線第1孔及第3孔，產生數值總電壓',
            cap6: 'noshow',
            cap7: '☑ G2=接線第2孔及第3孔',
            cap8: '☐ 總電壓=接線第1孔及第3孔'
        }, {
            fig: 3,
            stp: 1,
            img: '6.png',
            cap: '讀寫器接上電源，再使用USB線連接讀寫器與電腦',
            cap6: '☑  讀寫器接電源 ',
            cap7: '☑ 讀寫器與電腦連接',
            cap8: 'noshow'
        }, {
            fig: 3,
            stp: 2,
            img: '7.png',
            cap: '分別將從備用電池(PB)的4 pin插頭量得G1/G2輸入到GDS系統',
            cap6: 'noshow',
            cap7: 'noshow',
            cap8: '☐ 輸入G1/G2數值'
        }, {
            fig: 4,
            stp: 1,
            img: '7.png',
            cap: 'GDS系統判斷備用電池(PB)需要更換',
            cap6: '如顯示如下則需更換電池 ',
            cap7: 'noshow',
            cap8: '☑ 輸入G1/G2數值'
        }
    ],
    lock: false, //set while this.loadStep is working
    lock2: false, //set when widget is playing
    //METHODS://
    stepsCount: function () {
        return this.steps.length;
    },
    loadStep: function (index) {
        if (this.lock === true)
            return false;
        this.lock = true;
        try {
            console.log('DBG::loadStep(' + index + ');');
            if (IsVoid(index))
                return false;
            if ((index < 1) || (index > this.steps.length))
                return false;
            var step = this.steps[index - 1];
            if (IsVoid(step))
                return false; //because index is 1-based, and array is 0-based
            var fig = step.fig;
            if (IsVoid(fig))
                return false;
            var stp = step.stp;
            if (IsVoid(stp))
                return false;
            var wdg = $scope.view.wdg['sewingMachine'];
            if (IsVoid(wdg))
                return false;
            var wdg_fig = ExtractFigureIndex(wdg.sequence);
            if (IsVoid(wdg_fig))
                return false;
            var wdg_stp = wdg.currentStep;
            if (IsVoid(wdg_stp))
                return false;
            var Result = ((wdg_fig == fig) && (wdg_stp == stp));
            if (!Result) {
                console.log('DBG::loadStep from (f' + wdg_fig + ':s' + wdg_stp + ') to (f' + fig + ':s' + stp + ')');
                wdg.sequence = GetPVIpath(fig);
                $timeout(50);
                wdg.currentStep = stp;
                $timeout(50);
                wdg_fig = ExtractFigureIndex(wdg.sequence);
                if (IsVoid(wdg_fig))
                    return false;
                wdg_stp = wdg.currentStep;
                if (IsVoid(wdg_stp))
                    return false;
                Result = ((wdg_fig == fig) && (wdg_stp == stp));
            }
            if (Result)
                this.currentStep = index;
            reloadUI(step);
            console.log('DBG::loadStep->out');
            return Result;
        }
        finally {
            console.log('SET::Storyboard.currentStep=' + this.currentStep);
            this.lock = false;
        }
    },
    displayName: ['01/PB故障', '02/智慧型鑰匙故障']
}

//Some hooked events:
function OnCurrentStepChanged(Sender, currentStep) {
    //this event gets triggered by a watcher, Sender is the widget
    if (Storyboard.lock2 !== true)
        return false; //we wait for a change detected after widget playing, which sets the lock2
    try {
        if (Storyboard.lock === true)
            return false;
        if (IsVoid(Sender))
            return false;
        if (IsVoid(Sender.currentStep))
            return false;
        if (IsVoid(Sender.sequence))
            return false;
        //console.log('Sender.currentStep'+Sender.currentStep);
        //console.log('Sender.sequence'+Sender.sequence);
        var wdg_fig = ExtractFigureIndex(Sender.sequence);
        if (IsVoid(wdg_fig))
            return false;
        var wdg_stp = Sender.currentStep;
        if (IsVoid(wdg_stp))
            return false;
        var step = Storyboard.steps[Storyboard.currentStep - 1];
        if (IsVoid(step))
            return false;
        var fig = step.fig;
        var stp = step.stp;
        console.log('EVENT::OnCurrentStepChanged=' + currentStep);
        stp = Storyboard.currentStep + 1;
        if (stp > Storyboard.steps.length)
            stp = Storyboard.steps.length;
        Storyboard.loadStep(stp);
    }
    finally {
        Storyboard.lock2 = false;
        console.log('::LOCK2::UNSET::')
    }
}

function OnSequenceChanged(Sender, sequence) {
    //this event gets triggered by a watcher, Sender is the widget
    if (Storyboard.lock === true)
        return false;
    var seq = ExtractFigureIndex(sequence);
    var fig = ExtractFigureIndex();
    console.log('EVENT::OnSequenceChanged, seq=' + seq + ', fig=' + fig);
    $scope.refreshUI();
}

function OnPlayingChanged(Sender, playing) {
    //this event gets triggered by a watcher, Sender is the widget
    if (playing !== true)
        return false; //we only want to know when it's playing
    //if(Storyboard.lock===true)return false;
    if (Storyboard.lock2 === true)
        return false;
    Storyboard.lock2 = true;
    console.log('::LOCK2::SET::');
}

//Exposed APIs (can be called from the UI):
function reloadUI(stepData) {
    var Label_curr = $scope.view.wdg['step-indicator'];
    var Label_total = $scope.view.wdg['label-4'];
    if (!IsVoid(Label_curr))
        Label_curr.text = Storyboard.currentStep;
    if (!IsVoid(Label_total))
        Label_total.text = Storyboard.stepsCount();
    $scope.refreshUI();
}

$scope.welcome = () => {
    $scope.app.fn.navigate("Welcome");
}

//----------------------------------------------------------
$scope.show = (parameter) => {

    if (parameter == 1) {
        $scope.view.wdg['rotateSlider'].visible = false;
        $scope.view.wdg['scaleSlider'].visible = true;
        $scope.view.wdg['scale']['pressed'] = true;
        $scope.view.wdg['rotate']['pressed'] = false;

    }
    if (parameter == 2) {
        $scope.view.wdg['rotateSlider'].visible = true;
        $scope.view.wdg['scaleSlider'].visible = false;
        $scope.view.wdg['rotate']['pressed'] = true;
        $scope.view.wdg['scale']['pressed'] = false;
    }
}

$scope.valueChanged = () => {
    $scope.view.wdg['3DGauge-1'].scale = 2 * $scope.view.wdg['scaleSlider'].value;
    $scope.view.wdg['3DGauge-2'].scale = 2 * $scope.view.wdg['scaleSlider'].value;
    $scope.view.wdg['3DGauge-3'].scale = 2 * $scope.view.wdg['scaleSlider'].value;

    if ($scope.view.wdg['scaleSlider'].value == 0.1) {
        $scope.view.wdg['3DGauge-1'].x = -0.138;
        $scope.view.wdg['3DGauge-1'].z = 0.02;

        $scope.view.wdg['3DGauge-2'].y = 0.058;

        $scope.view.wdg['3DGauge-3'].x = 0.065;
        $scope.view.wdg['3DGauge-3'].y = 0.083;

    } else {
        $scope.view.wdg['3DGauge-1'].x = (-0.138 - ($scope.view.wdg['scaleSlider'].value));
        $scope.view.wdg['3DGauge-1'].z = 0.02 * ($scope.view.wdg['scaleSlider'].value * 10);

        $scope.view.wdg['3DGauge-2'].y = 0.058 * (10 * $scope.view.wdg['scaleSlider'].value);

        $scope.view.wdg['3DGauge-3'].x = (0.065 * (10 * $scope.view.wdg['scaleSlider'].value));
        $scope.view.wdg['3DGauge-3'].y = 0.083 * (10 * $scope.view.wdg['scaleSlider'].value);

    }

}

//------------------------------------------------------------

$scope.refreshUI = (stepData) => {
    $timeout(3000)
    //Read step number:
    var LBL = $scope.view.wdg['step-indicator'];
    if (IsVoid(LBL))
        return false;
    var nnn = parseInt(LBL.text);
    if (IsVoid(nnn))
        return false;
    if ((nnn < 1) || (nnn > Storyboard.stepsCount()))
        return false;
    //Set caption:
    // var cap = Storyboard.steps[nnn-1].cap; if(IsVoid(cap))return false;
    // var CAP = $scope.view.wdg['label-5']; if(IsVoid(CAP))return false;
    // CAP.text = cap;
    //Set image: TODO

    var cap6 = Storyboard.steps[nnn - 1].cap6; //if(IsVoid(cap6))return false;
    if (cap6 === "noshow") {
        $scope.view.wdg['3DGauge-1'].visible = false;
    } else {
        $scope.view.wdg['3DGauge-1'].visible = true;
        var CAP6 = $scope.view.wdg['3DGauge-1'];
        if (IsVoid(CAP6))
            return false;
        CAP6.text = cap6;
    }

    var cap7 = Storyboard.steps[nnn - 1].cap7; //if(IsVoid(cap7))return false;
    if (cap7 === "noshow") {
        $scope.view.wdg['3DGauge-2'].visible = false;
    } else {
        $scope.view.wdg['3DGauge-2'].visible = true;
        var CAP7 = $scope.view.wdg['3DGauge-2'];
        if (IsVoid(CAP7))
            return false;
        CAP7.text = cap7;
    }

    var cap8 = Storyboard.steps[nnn - 1].cap8; //if(IsVoid(cap7))return false;
    if (cap8 === "noshow") {
        $scope.view.wdg['3DGauge-3'].visible = false;
    } else {
        $scope.view.wdg['3DGauge-3'].visible = true;
        var CAP8 = $scope.view.wdg['3DGauge-3'];
        if (IsVoid(CAP8))
            return false;
        CAP8.text = cap8;
    }

    var img = Storyboard.steps[nnn - 1].img;
    if (IsVoid(img))
        return false;
    var IMG = $scope.view.wdg['image-4'];
    if (IsVoid(IMG))
        return false;
    //IMG.source = 'app/resources/Uploaded/'+img;

    $scope.app.params.stepImage = 'app/resources/Uploaded/' + img;

}

$scope.gotoStep = (stepNumber) => {
    if ($scope.view.wdg['sewingMachine'].playing === true)
        return false; //don't do anything while widget is playing
    return Storyboard.loadStep(stepNumber);
}

$scope.nextStep = () => {
    if ($scope.view.wdg['sewingMachine'].playing === true)
        return false; //don't do anything while widget is playing
    var stp = Storyboard.currentStep;
    if (stp > Storyboard.stepsCount())
        return false;
    Result = Storyboard.loadStep(stp + 1);
    //if(Result)$scope.view.wdg["sewingMachine"].play();
    return Result;
}

$scope.prevStep = () => {
    if ($scope.view.wdg['sewingMachine'].playing === true)
        return false; //don't do anything while widget is playing
    console.log('DBG::prevStep()');
    var stp = Storyboard.currentStep;
    console.log('DBG::prevStep() from ' + stp);
    if (stp <= 1)
        return false;
    return Storyboard.loadStep(stp - 1);
}

//Handlers for specific buttons:
function SpecButtonPressed(buttonId) {
    if (buttonId !== 'spec')
        return false;
    window.location = Storyboard.specification;
    return true;
}

function ManualButtonPressed(buttonId) {
    if (buttonId !== 'manual')
        return false;
    window.location = `app/resources/Uploaded/${Storyboard.manual}`;
    return true;
}

//GOTOURL EVENT:
$scope.goToUrl = (buttonId) => {
    if (SpecButtonPressed(buttonId))
        return 0;
    if (ManualButtonPressed(buttonId))
        return 1;
    return -1;
}

//Dropdown

$scope.OnButtonClick = () => {
    var dynHTML = "<div style='background-color: coral; height:100%; width:100%; align-items: center; justify-content: center;' onclick='alert(`kiki!`);'><center>H<sub>2</sub>O</center></div>";
    var DropDown = `
                  <div class="dropdown">
                    <button onclick='document.getElementById("myDropdown").classList.toggle("dpdShow");' class="dropbtn">切換檢測項目</button>
                    <div id="myDropdown" class="dropdown-content">
                      <a href="#home">01/PB故障</a>
                      <a href="#about">02/智慧型鑰匙故障</a>
                    </div>
                  </div>
                 `;
    //var Result = $KAPI.InjectHtmlIntoDivAboveWidget('column-21', dynHTML);
    //console.log('dynamic html incjection: '+Result);
    var Result = $KAPI.InjectHtmlIntoDivAboveWidget('label-31', DropDown);
    console.log('dynamic html incjection: ' + Result);
}

//SCOPE INITIALIZATION:
$scope.init = () => {
    console.log("$scope.view", $scope.view);
    $scope.app.params.workList = []
    Storyboard.displayName.forEach(element => {
        // Setting the dropdown of worklist
        $scope.app.params.workList.push({
            'displayName': element
        });
        //$scope.view.wdg['select-1'].list.current =  $scope.view.wdg['select-1'].list[0];
    });

    var wdg = $scope.view.wdg['sewingMachine'];
    console.log('wdg', wdg);

    Storyboard.loadStep(1);
    var watcher1 = $scope.$watch('view.wdg["sewingMachine"].currentStep', function (val) {
            OnCurrentStepChanged(wdg, val);
        });
    var watcher2 = $scope.$watch('view.wdg["sewingMachine"].sequence', function (val) {
            OnSequenceChanged(wdg, val);
        });
    var watcher3 = $scope.$watch('view.wdg["sewingMachine"].playing', function (val) {
            OnPlayingChanged(wdg, val);
        });

    //cope.view.wdg['label-5'].text = Storyboard.steps[0].cap;

    //cope.app.fn.loadResourceScript("Uploaded/bootstrap.min.css",type="text/css");
    //cope.app.fn.loadResourceScript("Uploaded/bootstrap.min.js");
    //cope.app.fn.loadResourceScript("Uploaded/jquery-3.4.1.js");
    //cope.setHTML();
    /*var labeldiv = document.querySelector("*[widget-id='label-11'] div");
    labeldiv.innerHTML =
    `<div class="dropdown">
    <button onclick='document.getElementById("myDropdown").classList.toggle("dpdShow");' class="dropbtn">切換檢測項目</button>
    <div id="myDropdown" class="dropdown-content">
    <a href="#home">01/PB故障</a>
    <a href="#about">02/智慧型鑰匙故障</a>
    </div>
    </div>`;*/

    $scope.OnButtonClick();

}

$scope.ScriptInject = function (src) {
    return new Promise((resolve, reject) => {
        var fn = src.split('\\').pop().split('/').pop();
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', () => reject('Error loading script (' + fn + ').'));
        script.addEventListener('abort', () => reject('Script loading aborted (' + fn + ').'));
        document.head.appendChild(script);
    });
};

$scope.DoInject = function () {
    $scope.ScriptInject('app/resources/Uploaded/krisapi4vs.js').then(() => {
        console.log('ScriptInject: krisapi4vs.js loaded.');
        angular.element(document).ready($scope.init);
    }).catch(error => {
        console.log('ScriptInject: ' + error);
    });
};

angular.element(document).ready($scope.DoInject);

//MAIN PROGRAM:
// angular.element(document).ready($scope.init);

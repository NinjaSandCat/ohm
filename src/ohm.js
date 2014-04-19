var inputForm = document.getElementById("inputForm");
//inputForm.addEventListener("input", inputHandle, false); // ah yeah
inputForm.addEventListener("keydown",inputSubmit, false);
inputForm.focus();
var hCanvas = document.getElementById('hCanvas');
var vis = hCanvas.getContext('2d');;
var textOut = document.getElementById("textOut");
var textOut2 = document.getElementById("textOut2");
var textOut3 = document.getElementById("textOut3");
var inputEcho = document.getElementById("inputEcho");

/*--------------------------------------------------------------------*\
 * foo holds a string
 * 
 * remove all leading zeroes
 * foo.replace(/^0+/, '')
 * 
 * remove all leading zeroes except some that make sense
 * foo.replace(/^0+(?!\.|$)/, '')
 * 
 * http://stackoverflow.com/questions/594325/truncate-leading-zeros-of-a-string-in-javascript
 * 
 * 
\*--------------------------------------------------------------------*/


/* * * TODO * * *\
 * 
 * genResistanceFromBands() - DONE
 * genResistanceFromESeries()
 * genBandsFromResistance()
 * handleInput() - DONE
 * switch game states after inputs -ELIMINATED
 * select difficulty
 * accuracy ratings session
 * touch crap for jeremiah
 * Auto-focus form for easier data entry
 * 
\* * * TODO * * */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var box = '<span class="box">☐</span>';
var xbox = '<span class="x">☒</span>';
var checkbox = '<span class="check">☑</span>';
var omega = 'Ω';
var rounds = 0;
var correct = 0;
var e12 = [10,12,15,18,22,27,33,39,47,56,68,82];
var bandColorNames = ['black',
'SaddleBrown', 'red', 'orange',
'yellow', 'green', 'blue',
'purple', 'grey', 'white'];
var bandColor = ['0,0,0',
'139,69,19', '178,34,34', '255,69,0',
'255,255,0', '34,139,34', '30,144,255',
'148,0,211', '105,105,105', '245,245,245'];

var bandMultColorNames = ['black',
'SaddleBrown', 'red', 'orange',
'yellow', 'green', 'blue',
'purple', 'gold', 'silver'];
var bandMultColor = ['0,0,0',
'139,69,19', '178,34,34', '255,69,0',
'255,255,0', '34,139,34', '30,144,255',
'148,0,211', '192,192,192', '255,215,0'];

var bandTolColor = ['192,192,192', '255,215,0'];
var eSeries = [6,12,24,48];
var history = new Array();
history.push(box);

function Resistor() {
    this.x=35;
    this.y=40;
    this.alpha=1;
    this.solved=false;
    this.value;
    this.valueOhms;
    this.series;
    this.band1;
    this.band2;
    this.band3;
    this.bandMult;//M for Multiplier
    this.bandTol;//T for Tolerance
}
Resistor.prototype.genValueString = function() {
    if (24<this.series) {
        
        switch (this.bandMult) {
        case 0:
            this.value=this.band1.toString() + this.band2.toString() + this.band3.toString();
        break;
        case 1:
            this.value=this.band1.toString() + '.' + this.band2.toString() + this.band3.toString() + 'k';
        break;
        case 2:
            this.value=this.band1.toString() + this.band2.toString() + '.' + this.band3.toString() + 'k';
        break;
        case 3:
            this.value=this.band1.toString() + this.band2.toString() + this.band3.toString() + 'k';
        break;
        case 4:
            this.value=this.band1.toString() + '.' + this.band2.toString() + this.band3.toString() + 'M';
        break;
        case 5:
            this.value=this.band1.toString() + this.band2.toString() + '.' + this.band3.toString() + 'M';
        break;
        case 6:
            this.value=this.band1.toString() + this.band2.toString() + this.band3.toString() + 'M';
        break;
        case 7:
            this.value=this.band1.toString() + '.' + this.band2.toString() + this.band3.toString() + 'G';
        break;
        case 8:
            this.value=this.band1.toString() + this.band2.toString() + '.' + this.band3.toString();
        break;
        case 9:
            this.value=this.band1.toString() + '.' + this.band2.toString() + this.band3.toString();
        break;
        
        default:
            this.value='#error';
        break;
        }
        
    } else {
        
        switch (this.bandMult) {
        case 0:
            this.value=this.band1.toString() + this.band2.toString();
        break;
        case 1:
            this.value=this.band1.toString() + this.band2.toString() + '0';
        break;
        case 2:
            this.value=this.band1.toString() + '.' + this.band2.toString() + 'k';
        break;
        case 3:
            this.value=this.band1.toString() + this.band2.toString() + 'k';
        break;
        case 4:
            this.value=this.band1.toString() + this.band2.toString() + '0k';
        break;
        case 5:
            this.value=this.band1.toString() + '.' + this.band2.toString() + 'M';
        break;
        case 6:
            this.value=this.band1.toString() + this.band2.toString() + 'M';
        break;
        case 7:
            this.value=this.band1.toString() + this.band2.toString() + '0M';
        break;
        case 8:
            this.value=this.band1.toString() + '.' + this.band2.toString();
        break;
        case 9:
            this.value='.' + this.band1.toString() + this.band2.toString();
        break;
        
        default:
            this.value='#error';
        break;
        }
    }
    this.value=this.value.replace(/^0+(?!\.|$)/, '');
    this.valueOhms=this.value+omega;
}
Resistor.prototype.randomize = function() {
        this.series=eSeries[randInt(0,3)];
        this.band1=randInt(1,9);
        this.band2=randInt(0,9);
        this.band3=0;
        if (24<this.series) {this.band3=randInt(0,9);};
        this.bandMult=randInt(0,5);
        if (0==(this.band1 + this.band2 + this.band3)){this.bandMult=0;};
        this.bandTol=randInt(0,1);
        this.genValueString();
        //writeLine2(this.value);
        //writeLine3(this.valueOhms);
};
Resistor.prototype.draw = function() {
    //frame
    vis.fillStyle="rgba(248, 223, 165, "+this.alpha+")";
    vis.fillRect(this.x,this.y+5,250,50);
    vis.fillRect(this.x,this.y,50,5);
    vis.fillRect(this.x,this.y+55,50,5);
    vis.fillRect(this.x+200,this.y,50,5);
    vis.fillRect(this.x+200,this.y+55,50,5);
    //band1
    vis.fillStyle = "rgba(" + bandColor[this.band1] + "," + this.alpha + ")";
    vis.fillRect(this.x+55,this.y+5,20,50);
    //band2
    vis.fillStyle= "rgba(" + bandColor[this.band2] + "," + this.alpha + ")";
    vis.fillRect(this.x+55+30,this.y+5,20,50);
    
    if (24<this.series) {
    //band3
    vis.fillStyle= "rgba(" + bandColor[this.band3] + "," + this.alpha + ")";
    vis.fillRect(this.x+55+60,this.y+5,20,50);
    //bandMult
    vis.fillStyle= "rgba(" + bandColor[this.bandMult] + "," + this.alpha + ")";
    vis.fillRect(this.x+55+90,this.y+5,20,50);
    } else {
    //bandMult
    vis.fillStyle= "rgba(" + bandColor[this.bandMult] + "," + this.alpha + ")";
    vis.fillRect(this.x+55+60,this.y+5,20,50);
    }
    //bandTol
    vis.fillStyle= "rgba(" + bandColor[this.bandTol] + "," + this.alpha + ")";
    vis.fillRect(this.x+55+120,this.y+5,20,50);
    
    if (this.solved){
        vis.fillStyle = "rgb(0,0,0)";
        vis.font = '40px Lucida Console ';
        vis.fillText(this.valueOhms,this.x+50,this.y+50);
    }
    
}
Resistor.prototype.draw2 = function() {
    //frame
    vis.fillStyle='#F8DFA5';
    vis.fillRect(35,95,250,50);
    vis.fillRect(35,90,50,60);
    vis.fillRect(235,90,50,60);
    //band1
    vis.fillStyle=bandColor[this.band1];
    vis.fillRect(90,95,20,50);
    //band2
    vis.fillStyle=bandColor[this.band2];
    vis.fillRect(90+30,95,20,50);
    
    if (24<this.series) {
    //band3
    vis.fillStyle=bandColor[this.band3];
    vis.fillRect(90+60,95,20,50);
    //bandMult
    vis.fillStyle=bandColor[this.bandMult];
    vis.fillRect(90+90,95,20,50);
    } else {
    //bandMult
    vis.fillStyle=bandMultColor[this.bandMult];
    vis.fillRect(90+60,95,20,50);
    }
    //bandTol
    vis.fillStyle=bandTolColor[this.bandTol];
    vis.fillRect(90+120,95,20,50);
    
};

function write(txt) {
    textOut.textContent = txt;
}

function writeSpecial(txt) {
    textOut.innerHTML = txt;
}

function writeLine2(txt) {
    textOut2.textContent = txt;
}

function writeLine3(txt) {
    textOut3.textContent = txt;
}

function log(txt) {
    console.log(txt);
}

function drawClear() {
    vis.clearRect(0, 0, hCanvas.width, hCanvas.height);
}

function inputHandle(e) {
    var input = e.target.value;
    input = input.toLowerCase();
    inputEcho.textContent = input;
    //inputForm.value = '';
    logic(input);
}

function inputSubmit(e) {
  //console.log(e);
  if (13 == e.which) {
     //write('success');
     //writeLine2(e.target.value+"Ω");
     logic(e.target.value);
     inputForm.value = '';
     //resistor.randomize();
     //resistor.draw();
  }
}


function logic(input) {

        if (!input && !(0==r1.value)){return;};
        var output;
        var checkinput;
        var checkvalue;
        // Sanatize inputs
        checkinput=input.toString();
        checkinput=checkinput.replace(/^0+/, '');
        checkinput=checkinput.toLowerCase();
        console.log(checkinput);
        checkvalue=r1.value.replace(/^0+/, '');
        checkvalue=checkvalue.toLowerCase();
        console.log(checkvalue);

        //compare
        if (checkinput==checkvalue){
                output=checkbox;
                correct+=1;
            } else {
                output=xbox;
            }
        
        history.pop();
        history.push(output);
        history.push(box);
        writeSpecial(history.join(''));
        console.log('output=' + output);
        console.log(history.join(''));
        
        drawClear();
        var r2=r1;
        r2.y+=60+40;
        r2.alpha=.25;
        r2.solved=true;
        r2.draw();
        r1 = new Resistor();
        r1.randomize();
        r1.draw();
        
        rounds+=1;
        writeLine2(Math.round(correct/rounds*100)+'%');
        

}
drawClear();
var r1 = new Resistor();
r1.randomize();
r1.draw();

writeSpecial(history.join(''));
    


//c is the game canvas
console.clear();
var t = 0;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//ch and cw are canvas width and canvas height
var cH = canvas.height;
var cW = canvas.width;
var m;
var keylist = [];
var obslist = [];
var conlist1 = [37, 38, 39, 40];
var conlist2 = [65, 87, 68, 83];
var linelist = [];
var movelist = [[-1, 0, "left"], [0, -1, "up"], [1, 0, 'right'], [0, 1, "down"]]
const dGH = 400;
const dGW = 400;
console.log(cW + "x" + cH);
//gD is greater dimension 
var gD;
//this isn't used, but i'm not deleting it because it might break something 
if (cH > cW) {
    gD = cH;
    m = gD / dGH;
} else if (cW > cH) {
    gD = cW;
    m = gD / dGW;
} else {
    gD = cW;
    m = gD / dGW;
}
console.log(m);
class bike {
    constructor(c, x, y) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.w = 5;
        this.s = 1;
        this.d = 0;
        this.moving = false;
        this.linelist = [];
    }
    draw() {
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x - (this.w / 2), this.y - (this.w / 2), this.w * m, this.w * m);
    }
    move(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
    }
    dmove() {
        this.x = (this.x + (movelist[this.d][0]) * this.s) * m;
        if (this.x > 400) {
            this.x = 400;
        } else if (this.x < 0) {
            this.x = 0;
        }
        this.y = (this.y + (movelist[this.d][1]) * this.s) * m;
        if (this.y > 400) {
            this.y = 400;
        } else if (this.y < 0) {
            this.y = 0;
        }
    }
    dash(dstnc){
        ds = this.s;
        this.s = dstnc;
        this.dmove;
        this.s=ds;
    }
    turn(t) {
        this.d = t;
    }
    path() {
        var temp = [this.x, this.y];
        this.linelist.push(temp);
    }
    ccheck(x,y,w,wa) {
        if(wa==null || wa<=0){
            var xd=(this.x-x)*(this.x-x);
            var yd=(this.y-y)*(this.y-y);
            var total=xd+yd;
            var d=Math.sqrt(total);
            if(d<=w){
                console.log('ow');
                clearInterval(game);
                clear();
                ctx.font = "30px Arial";
                ctx.fillText("You survived for "+(wave-startwave)+" waves", 10, 50);
                ctx.font = "18px Arial";
                ctx.fillText("To play again, double-click the play button", 10, 90)
            }
        }
    }
}
class obstacle{
    constructor(color,x,y,size,xs,ys,wait,drawWait){
        this.c=color;
        this.x=x;
        this.y=y;
        this.s=size;
        this.xs=xs;
        this.ys=ys;
        if(wait!=null){
            this.w=wait;
        }
        if(drawWait!=null){
            this.dw=drawWait;
        }
    }
    draw(){

        if(this.dw==null||this.dw<=0){
            ctx.fillStyle = "#9999FF";
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
            ctx.fill();
            if(this.w==null || this.w<=0){
                ctx.fillStyle = this.c;
                ctx.beginPath();
                ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
                ctx.fill();
            }else{
            }
        }   
    }
    move(x,y){
        this.x=this.x+x;
        this.y=this.y+y;
    }
    smove(){
        if(this.w==null || this.w<=0){
        this.x=this.x+this.xs;
        this.y=this.y+this.ys;
        }
    }
    adv(){
        if(this.w!=null){
            this.w=this.w-1;
        }
    }
}
function turn(conlist, bike, evt) {
    if (conlist.indexOf(evt.keyCode) != -1) {
        bike.turn(conlist.indexOf(evt.keyCode));    
    }
}
function move(conlist, bike, evt) {
    if (conlist.indexOf(evt.keyCode) != -1) {
        bike.moving=true;
    }
}
function stopmove(conlist,bike,evt){
    if(conlist.indexOf(evt.keyCode)==bike.d){
        bike.moving=false;
    }
}
document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (keylist.indexOf(evt.keyCode) == -1) {
        console.log(evt.keyCode);
        keylist.push(evt.keyCode);
    }
    turn(conlist1, bike1, evt);
    move(conlist1,bike1,evt);
    // turn(conlist2,bike2,evt);
}
document.onkeyup = function (evt) {
    evt = evt || window.event;
    keylist.splice(keylist.indexOf(evt.keyCode), 1);
    stopmove(conlist1,bike1,evt);
}
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
var bike1 = new bike("#FF0000", 200, 200);
var obs1 = new obstacle("#0000FF",200,200,5,0,0);
//var bike2 = new bike("#00FF00",200,200);
console.log(bike1);
bike1.draw();
bike1.dmove();
bike1.draw();
function bikeloop(bike) {
    for(i in obslist){
        bike.ccheck(i.x,i.y,i.s);
    }  
    if(bike.moving==true){
        bike.dmove();
    }
    bike.draw();
    bike.path();
    ctx.strokeStyle = bike.c;
    ctx.beginPath();
    ctx.moveTo(bike.linelist[0][0], bike.linelist[0][1])
    for (i in bike1.linelist) {
        ctx.lineTo(bike.linelist[i][0], bike.linelist[i][1]);
    }
    ctx.stroke();
    //console.log(bike1.linelist);
    if (t > 10) {
        bike.linelist.splice(0, 1);
    }
}
obslist=[];
var wave = -1;
const wavelist = [	[new obstacle("#0000FF",0,0,5,0,1),new obstacle("#0000FF",40,0,5,0,1),  new obstacle("#0000FF",80,0,5,0,1),  new obstacle("#0000FF",120,0,5,0,1),  new obstacle("#0000FF",160,0,5,0,1),  new obstacle("#0000FF",200,0,5,0,1),  new obstacle("#0000FF",240,0,5,0,1),  new obstacle("#0000FF",280,0,5,0,1),  new obstacle("#0000FF",320,0,5,0,1),  new obstacle("#0000FF",360,0,5,0,1),  new obstacle("#0000FF",400,0,5,0,1),new obstacle("#0000FF",0,0,5,1,0),  new obstacle("#0000FF",0,40,5,1,0),  new obstacle("#0000FF",0,80,5,1,0),  new obstacle("#0000FF",0,120,5,1,0),  new obstacle("#0000FF",0,160,5,1,0),  new obstacle("#0000FF",0,200,5,1,0),  new obstacle("#0000FF",0,240,5,1,0),  new obstacle("#0000FF",0,280,5,1,0),  new obstacle("#0000FF",0,320,5,1,0),  new obstacle("#0000FF",0,360,5,1,0),  new obstacle("#0000FF",0,400,5,1,0)]
,[new obstacle("#0000FF",0,0,10,1,1), new obstacle("#0000FF",400,0,10,-1,1), new obstacle("#0000FF",0,400,10,1,-1), new obstacle("#0000FF",400,400,10,-1,-1), new obstacle("#0000FF",0,200,10,1,0), new obstacle("#0000FF",200,400,10,0,-1), new obstacle("#0000FF",400,200,10,-1,0), new obstacle("#0000FF",200,0,10,0,1)]
,[new obstacle("#0000FF",0,0,5,1,0), new obstacle("#0000FF",400,20,5,-1,0), new obstacle("#0000FF",0,40,5,1,0), new obstacle("#0000FF",400,60,5,-1,0), new obstacle("#0000FF",0,80,5,1,0), new obstacle("#0000FF",400,100,5,-1,0), new obstacle("#0000FF",0,120,5,1,0), new obstacle("#0000FF",400,140,5,-1,0), new obstacle("#0000FF",0,160,5,1,0), new obstacle("#0000FF",400,180,5,-1,0), new obstacle("#0000FF",0,200,5,1,0), new obstacle("#0000FF",400,220,5,-1,0), new obstacle("#0000FF",0,240,5,1,0), new obstacle("#0000FF",400,260,5,-1,0), new obstacle("#0000FF",0,280,5,1,0), new obstacle("#0000FF",400,300,5,-1,0), new obstacle("#0000FF",0,320,5,1,0), new obstacle("#0000FF",400,340,5,-1,0), new obstacle("#0000FF",0,360,5,1,0), new obstacle("#0000FF",400,380,5,-1,0), new obstacle("#0000FF",0,400,5,1,0)]
,[new obstacle('#0000FF',0,0,10,3,3)]
,[new obstacle('#0000FF',0,0,10,3,3),new obstacle('#0000FF',400,0,10,-3,3)]
,[new obstacle('#0000FF',0,0,10,3,3),new obstacle('#0000FF',400,0,10,-3,3),new obstacle('#0000FF',400,400,10,-3,-3)]
,[new obstacle('#0000FF',0,200,10,3,0),new obstacle('#0000FF',200,0,10,0,3),new obstacle('#0000FF',200,400,10,0,-3),new obstacle('#0000FF',400,200,10,-3,0)]
,[new obstacle('#0000FF',0,0,10,0,3),new obstacle('#0000FF',100,0,10,0,3,33),new obstacle('#0000FF',200,0,10,0,3,66),new obstacle('#0000FF',300,0,10,0,3,99),new obstacle('#0000FF',400,0,10,0,3 ,33*4),new obstacle('#0000FF',350,0,10,0,3),new obstacle('#0000FF',250,0,10,0,3,33),new obstacle('#0000FF',150,0,10,0,3,66),new obstacle('#0000FF',50,0,10,0,3,99)]



];
console.log(bike1);
console.log(obslist);
function gloop() {
    clear();
    t++;
    bikeloop(bike1);
    for (i in obslist){
        obslist[i].draw();
        obslist[i].adv()
        obslist[i].smove();
        bike1.ccheck(obslist[i].x,obslist[i].y,obslist[i].s,obslist[i].w);
        if (obslist[i].x > 400) {
            obslist.splice(i,1);
        } else if (obslist[i].x < 0) {
            obslist.splice(i,1);
        }else if (obslist[i].y > 400) {
            obslist.splice(i,1);
        } else if (obslist[i].y < 0) {
            obslist.splice(i,1);
        }

    }
    if (obslist.length==0){
        wave++;
        obslist=wavelist[wave];
    }
    if (wave>=wavelist.length){
        clearInterval(game);
        clear();
        ctx.font = "30px Arial";
        ctx.fillText("You won!", 10, 50);       
    }
}
var gamestarted = false;
var game;
function start(){
    if(gamestarted==true){
        location.reload();

    }else if(game==null){
    cb = document.getElementById("hitbox");
    wave = prompt("Start at wave:", 0)-1;
    startwave=wave;
    gamestarted = true;
    game = setInterval(gloop, 10);
    }
        

    
    console.log(game);
}